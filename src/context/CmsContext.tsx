import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROBLEMS_DATA, FAQ_ITEMS, CLIPPASIA_INFO } from '../data/mockData';
import { ProblemItem } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface BeforeAfterContent {
  preTitle: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  afterBadge: string;
  hookPill: string;
  hookTitle: string;
  hookSubtitle: string;
  audioStemLabel: string;
  colorGradeLabel: string;
}

export interface ChallengesContent {
  preTitle: string;
  title: string;
  subtitle: string;
  items: ProblemItem[];
}

export interface RoiContent {
  preTitle: string;
  title: string;
  subtitle: string;
  recoveryPercentage: number;
}

export interface ProcessStepItem {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  highlight: string;
}

export interface ProcessContent {
  preTitle: string;
  title: string;
  subtitle: string;
  steps: ProcessStepItem[];
}

export interface FaqContent {
  preTitle: string;
  title: string;
  subtitle: string;
  items: { question: string; answer: string }[];
}

export interface SiteCmsData {
  beforeAfter: BeforeAfterContent;
  challenges: ChallengesContent;
  roi: RoiContent;
  process: ProcessContent;
  faq: FaqContent;
}

export const DEFAULT_CMS_DATA: SiteCmsData = {
  beforeAfter: {
    preTitle: 'Side-by-Side Fidelity',
    title: 'Color Grading & Hook Dynamic Split-Screen',
    subtitle: 'Drag the divider to compare raw flat log camera footage against Clippasia\'s DaVinci Resolve 3D LUT grade & kinetic retention editing.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    afterBadge: 'AFTER: Clippasia Master Grade',
    hookPill: '⚡️ 3-SECOND PATTERN INTERRUPT',
    hookTitle: '"Engineered for Pure Retention"',
    hookSubtitle: '+184% Watch Time · Dynamic Zoom Punch-in',
    audioStemLabel: 'Foley SFX · Sub-Bass Riser',
    colorGradeLabel: 'DaVinci 3D LUT Grade'
  },
  challenges: {
    preTitle: 'Stop Losing Viewers',
    title: 'Why Standard Videos Fail in the First 3 Seconds',
    subtitle: 'The modern video feed is ruthless. Viewers judge your content in 1.8 seconds. Here is how standard editing leaks retention—and how we fix it.',
    items: PROBLEMS_DATA
  },
  roi: {
    preTitle: 'Interactive Video Churn & Revenue Recovery Engine',
    title: 'Calculate How Much Revenue You Leak to 3-Second Drop-Offs',
    subtitle: 'Every viewer who bounces before your hook is lost ad spend and lost pipeline. See your estimated monthly revenue recovery with Clippasia.',
    recoveryPercentage: 40
  },
  process: {
    preTitle: 'Frictionless Production',
    title: 'From Raw SD Card to High-Retention Master in 4 Steps',
    subtitle: 'Stop spending 20+ hours per week trapped in video editing timelines. Our specialized post-production team operates in the background while you focus on creating and scaling.',
    steps: [
      {
        num: '01',
        title: 'Hand-off Your Raw Footage',
        subtitle: 'Effortless Cloud Intake',
        desc: 'Drop your Google Drive, Dropbox, or camera memory card links directly into your Clippasia portal. No tedious brief paperwork required.',
        highlight: 'Takes < 2 minutes'
      },
      {
        num: '02',
        title: 'The Kinetic A-Roll Cut',
        subtitle: 'Pacing & Narrative Hook',
        desc: 'Our editors cut all awkward pauses, breaths, and rambling takes. We build the first 3.5-second visual hook to halt feed scrolling.',
        highlight: 'Zero dead air'
      },
      {
        num: '03',
        title: 'Retention Sound & Color Polish',
        subtitle: 'Commercial Production Value',
        desc: 'We layer kinetic animated typography, subtle zoom punch-ins, synchronized Foley whooshes, and cinema DaVinci 3D LUT color grading.',
        highlight: '-14 LUFS calibrated audio'
      },
      {
        num: '04',
        title: 'Review & 24-48h Delivery',
        subtitle: 'Guaranteed On-Time SLA',
        desc: 'Inspect your master 4K cut with our interactive review player. Request any tweaks or download your publish-ready video immediately.',
        highlight: 'Unlimited revisions'
      }
    ]
  },
  faq: {
    preTitle: 'Frequently Asked Questions',
    title: 'Everything You Need to Know Before Starting',
    subtitle: 'Clear answers about our turnaround time, revisions, file handling, and free test edits.',
    items: FAQ_ITEMS
  }
};

interface CmsContextType {
  cms: SiteCmsData;
  updateSection: <K extends keyof SiteCmsData>(section: K, data: SiteCmsData[K]) => Promise<void>;
  resetToDefault: () => void;
  isSaving: boolean;
}

const CmsContext = createContext<CmsContextType>({
  cms: DEFAULT_CMS_DATA,
  updateSection: async () => {},
  resetToDefault: () => {},
  isSaving: false
});

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cms, setCms] = useState<SiteCmsData>(() => {
    try {
      const stored = localStorage.getItem('clippasia_cms_content');
      return stored ? { ...DEFAULT_CMS_DATA, ...JSON.parse(stored) } : DEFAULT_CMS_DATA;
    } catch {
      return DEFAULT_CMS_DATA;
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load from Firestore on mount
  useEffect(() => {
    const loadFromFirestore = async () => {
      try {
        const docRef = doc(db, 'site_config', 'content');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<SiteCmsData>;
          setCms((prev) => {
            const merged = { ...prev, ...remoteData };
            localStorage.setItem('clippasia_cms_content', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Firestore CMS content fetch fallback to local:', err);
      }
    };
    loadFromFirestore();
  }, []);

  const updateSection = async <K extends keyof SiteCmsData>(section: K, data: SiteCmsData[K]) => {
    setIsSaving(true);
    const updated = { ...cms, [section]: data };
    setCms(updated);
    try {
      localStorage.setItem('clippasia_cms_content', JSON.stringify(updated));
      const docRef = doc(db, 'site_config', 'content');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn('CMS update save warning:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    setCms(DEFAULT_CMS_DATA);
    localStorage.removeItem('clippasia_cms_content');
  };

  return (
    <CmsContext.Provider value={{ cms, updateSection, resetToDefault, isSaving }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
