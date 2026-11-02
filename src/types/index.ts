export type VideoCategory = 'all' | 'ecommerce' | 'youtube' | 'shortform' | 'explainer';

export interface PortfolioItem {
  id: string;
  title: string;
  category: VideoCategory;
  categoryLabel: string;
  client: string;
  duration: string;
  aspectRatio: '16:9' | '9:16';
  thumbnailUrl: string;
  videoUrl?: string;
  hookHeadline: string;
  metrics: {
    label: string;
    value: string;
  };
  editingHighlights: string[];
  software: string[];
  description: string;
  clientFeedback?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface ProblemItem {
  id: string;
  title: string;
  subtitle: string;
  painStat: string;
  painExplanation: string;
  solutionTitle: string;
  solutionExplanation: string;
  solutionMetric: string;
  animationType: 'retention_curve' | 'timeline_burnout' | 'roas_scale' | 'quality_gap';
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  pricePerVideo?: number;
  monthlyPrice?: number;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  turnaround: string;
  idealFor: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  stat: string;
  category: 'ecommerce' | 'youtube' | 'shortform' | 'agency';
  categoryLabel: string;
  quote: string;
  rating: number;
  verifiedDeliverable: string;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phoneOrWhatsApp?: string;
  channelOrBrand: string;
  serviceTier?: string;
  videoType?: string;
  monthlyVolume?: string;
  footageLink: string;
  projectNotes: string;
  requestFreeTestEdit: boolean;
}
