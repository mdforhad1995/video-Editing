import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemChallengeSection } from './components/ProblemChallengeSection';
import { BeforeAfterPlayer } from './components/BeforeAfterPlayer';
import { PortfolioSection } from './components/PortfolioSection';
import { ProjectModal } from './components/ProjectModal';
import { PricingSection } from './components/PricingSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { InquirySection } from './components/InquirySection';
import { FaqSection } from './components/FaqSection';
import { LiveChatModal } from './components/LiveChatModal';
import { RoiRecoverySection } from './components/RoiRecoverySection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { PortfolioItem } from './types';
import { Sparkles, ArrowRight, Phone, Camera } from 'lucide-react';
import { CLIPPASIA_INFO } from './data/mockData';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [inquiryTier, setInquiryTier] = useState<string>('Growth eCommerce & YouTube');
  const [inquiryVideoType, setInquiryVideoType] = useState<string>('eCommerce & Product Ads');
  const [inquiryNotes, setInquiryNotes] = useState<string>('');
  const [forceFreeTestEdit, setForceFreeTestEdit] = useState<boolean>(true);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Sync hash routing so #admin directly loads the Admin Suite, plus Ctrl+Shift+A shortcut
  useEffect(() => {
    const handleHash = () => {
      setIsAdminOpen(window.location.hash === '#admin');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Hotkey: Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => {
          const next = !prev;
          window.location.hash = next ? 'admin' : '';
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openAdmin = () => {
    setIsAdminOpen(true);
    window.location.hash = 'admin';
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
    window.location.hash = '';
  };

  const scrollToInquiry = () => {
    const el = document.getElementById('inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTestEdit = () => {
    setForceFreeTestEdit(true);
    setInquiryNotes('I would like to claim the 1-Minute Free Test Edit to evaluate your quality.');
    scrollToInquiry();
  };

  const handleSelectTier = (
    tierName: string,
    customDetails?: string,
    packagePrice?: string,
    mode: 'package_order' | 'free_test_edit' = 'package_order'
  ) => {
    setInquiryTier(tierName);
    if (customDetails) {
      setInquiryNotes(customDetails);
    }
    setForceFreeTestEdit(mode === 'free_test_edit');
    scrollToInquiry();
  };

  const handleRequestStyle = (project: PortfolioItem) => {
    setSelectedProject(null);
    setInquiryTier(project.categoryLabel);
    const matchedService =
      project.category === 'ecommerce'
        ? 'eCommerce & Product Ads'
        : project.category === 'youtube'
        ? 'YouTube & Long-form'
        : project.category === 'shortform'
        ? 'Shorts & TikTok UGC'
        : project.category === 'explainer'
        ? 'SaaS & Corporate'
        : 'eCommerce & Product Ads';
    setInquiryVideoType(matchedService);
    setInquiryNotes(
      `I would like an edit styled similar to "${project.title}" (${project.client}) featuring ${project.editingHighlights[0]}.`
    );
    setForceFreeTestEdit(false);
    scrollToInquiry();
  };

  const handleSelectSolution = (problemId: string) => {
    setForceFreeTestEdit(true);
    setInquiryNotes(`I want to fix problem "${problemId}" with a sample test edit on our raw footage.`);
    scrollToInquiry();
  };

  const handleApplyRoiEstimate = (roiSummary: string) => {
    handleSelectTier('Growth eCommerce & YouTube', roiSummary, '$799 / month', 'package_order');
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navigation */}
      <Navbar onOpenTestEdit={handleOpenTestEdit} onOpenAdmin={openAdmin} />

      {/* Main Content Sections - pb-20 on mobile prevents content from hiding behind fixed bottom bar */}
      <main className="flex-1 pb-20 md:pb-0">
        {/* 1. Hero Section */}
        <Hero onOpenTestEdit={handleOpenTestEdit} />

        {/* 2. Customer Challenges & Pain Points Animated Section */}
        <ProblemChallengeSection onSelectSolution={handleSelectSolution} />

        {/* 3. Interactive Before/After Video Split-Screen Player */}
        <BeforeAfterPlayer />

        {/* 4. Interactive Video Churn & Revenue Recovery ROI Calculator */}
        <RoiRecoverySection onApplyRoiEstimate={handleApplyRoiEstimate} />

        {/* 5. Categorized Video Portfolio Grid */}
        <PortfolioSection onSelectProject={(p) => setSelectedProject(p)} />

        {/* 6. Production Workflow Section */}
        <ProcessSection />

        {/* 7. Pricing Tiers & Interactive Scope/Budget Output Calculator */}
        <PricingSection onSelectTier={handleSelectTier} />

        {/* 7. Scrollable Multi-Client Reviews & Verified Outcomes */}
        <TestimonialsSection />

        {/* 8. Dedicated Project Booking & Free Test Edit Intake Form */}
        <InquirySection
          initialServiceTier={inquiryTier}
          initialVideoType={inquiryVideoType}
          initialNotes={inquiryNotes}
          forceFreeTestEdit={forceFreeTestEdit}
          onOpenAdmin={openAdmin}
        />

        {/* 9. Conversion-Oriented FAQ */}
        <FaqSection />
      </main>

      {/* Dedicated Studio Admin Dashboard */}
      {isAdminOpen && (
        <AdminPanel onClose={closeAdmin} />
      )}

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRequestStyle={handleRequestStyle}
        />
      )}

      {/* Subtle 'Chat with an Editor' Floating Live Chat in Bottom Right */}
      <LiveChatModal
        onBookService={(tier, notes) => handleSelectTier(tier || 'Growth eCommerce & YouTube', notes, undefined, 'package_order')}
        onClaimTestEdit={handleOpenTestEdit}
      />

      {/* High-Converting Mobile Floating Quick Action Strip */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0B0E17]/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2.5 pb-[calc(0.65rem+env(safe-area-inset-bottom,0px))] flex items-center justify-between gap-2.5 shadow-2xl shadow-black">
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick WhatsApp tap */}
          <a
            href="https://wa.me/8801911862115"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 active:scale-95 transition-transform"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Quick Photo Editing link */}
          <a
            href="https://clippasia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 active:scale-95 transition-transform"
            title="Visit Main Photo Editing Studio"
            aria-label="Visit Main Photo Editing Studio"
          >
            <Camera className="w-4 h-4" />
          </a>
        </div>

        {/* Primary Call to Action on Mobile */}
        <button
          onClick={handleOpenTestEdit}
          className="flex-1 py-2.5 px-3.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span className="text-slate-950 font-black">Claim 1-Min Free Test</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </button>
      </div>

      {/* Footer */}
      <Footer onOpenAdmin={openAdmin} />
    </div>
  );
}
