import { PortfolioItem, ProblemItem, PricingTier, TestimonialItem } from '../types';

export const CLIPPASIA_INFO = {
  brandName: 'Clippasia',
  tagline: 'Professional Video Post-Production & Color Grading Studio',
  officialWebsite: 'https://clippasia.com',
  primaryEmail: 'info@clippasia.com',
  alternateEmail: 'asiaclipp@gmail.com',
  phoneWhatsApp: '+880 1911-862115',
  locations: {
    usa: '1221 W Airport Fwy #217, Irving, TX 75062, United States',
    uae: 'Burj Nahar Views Building, Office 119, Deira, Dubai, UAE',
    bd: 'Creative Production Office, Shahjadpur, Sirajganj & Dhaka, Bangladesh'
  },
  stats: {
    videosDelivered: '1,250+',
    avgTurnaround: '24-48 Hours',
    retentionBoost: '+184%',
    satisfactionRate: '99.4%',
    activeEditors: '45+ Senior Post-Production Specialists'
  }
};

export const PROBLEMS_DATA: ProblemItem[] = [
  {
    id: 'retention-cliff',
    title: 'The 3-Second Drop-off Trap',
    subtitle: '70% of viewers scroll away before you even introduce your core value proposition.',
    painStat: '71% Immediate Drop',
    painExplanation:
      'Uncut silences, monotonous audio, and flat stationary camera shots cause viewers to swipe away within 3.2 seconds. Algorithms on TikTok, Meta, and YouTube penalize low completion rates by suffocating your organic and paid distribution.',
    solutionTitle: 'Kinetic Hook Architecture & Dynamic Pacing',
    solutionExplanation:
      'Clippasia engineers visual pattern interrupts every 3.5 seconds: dynamic zoom framing, custom Foley whoosh & punch sound effects, motion-tracked kinetic subtitles, and compelling first-second hooks that retain viewer attention.',
    solutionMetric: '+184% Watch Time',
    animationType: 'retention_curve'
  },
  {
    id: 'creator-burnout',
    title: 'The 25-Hour Weekly Editing Drain',
    subtitle: 'Business owners and creators spend entire weekends trimming pauses instead of filming or closing sales.',
    painStat: '21 hrs Lost / Video',
    painExplanation:
      'Sorting through 4 hours of raw 4K footage, cleaning room echo, hunting royalty-free music, keyframing subtitles, and color matching takes 15-25 hours per project. This leads directly to creator burnout and inconsistent posting schedules.',
    solutionTitle: 'Turnkey 24-48h Delivery Pipeline',
    solutionExplanation:
      'Simply drop your raw camera files into Google Drive, Dropbox, or Frame.io. Clippasia’s dedicated post-production team handles the assembly, narrative cut, audio mastering, and DaVinci color grading, returning broadcast-ready 4K renders.',
    solutionMetric: '90% Time Saved',
    animationType: 'timeline_burnout'
  },
  {
    id: 'ecommerce-ad-fatigue',
    title: 'Flat ROAS & Creative Ad Fatigue',
    subtitle: 'Generic product clips look like low-budget slideshows that shoppers scroll right past.',
    painStat: '1.2x Average ROAS',
    painExplanation:
      'Running standard product turntable videos burns ad spend without generating conversions. Without psychological visual hooks, lifestyle motion graphics, and fast-paced product benefit callouts, customer acquisition cost climbs unsustainably.',
    solutionTitle: 'High-Converting Performance Video Ads',
    solutionExplanation:
      'We craft high-impact eCommerce video ads with 3x hook variations for rapid A/B testing on Meta and TikTok Ads, lifestyle speed ramps, customer testimonial overlays, and urgency triggers proven to lower CAC by 35-45%.',
    solutionMetric: '3.8x - 5.2x Verified ROAS',
    animationType: 'roas_scale'
  },
  {
    id: 'freelancer-lottery',
    title: 'The Unreliable Freelancer Roulette',
    subtitle: 'Unpredictable delays, blown-out audio levels, and editors who vanish mid-revision.',
    painStat: '60% Revision Re-edits',
    painExplanation:
      'Hiring disconnected individual freelancers brings erratic quality, missed launch deadlines, inconsistent color science across episodes, and surprise extra charges for minor revisions.',
    solutionTitle: 'Studio-Grade Reliability & Dedicated Pods',
    solutionExplanation:
      'Clippasia assigns dedicated senior video editors supervised by creative directors. You receive direct communication, guaranteed 24-48h turnaround SLAs, unlimited revisions until 100% satisfied, and complete source project archives.',
    solutionMetric: '100% On-Time SLA',
    animationType: 'quality_gap'
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'kronos-luxury-timepiece',
    title: 'Kronos Apex Chronograph — Global DTC Launch',
    category: 'ecommerce',
    categoryLabel: 'eCommerce & Product Commercial',
    client: 'Kronos Horology (Dallas, TX)',
    duration: '0:45',
    aspectRatio: '16:9',
    thumbnailUrl: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hookHeadline: 'Speed-Ramped Macro Water Resistance Stress Test (4.6x ROAS)',
    metrics: {
      label: 'Performance Ad ROAS',
      value: '4.6x Return'
    },
    editingHighlights: [
      'Micro-macro speed ramping matched to 128 BPM soundtrack rhythm',
      'DaVinci Resolve Studio 3D LUT grading for brushed stainless steel & sapphire glass',
      'Custom Foley sound design (sub-bass impacts, crisp bezel clicks, water splashes)',
      '3 distinct first-3-second hook variations delivered for Meta & TikTok Ads Manager'
    ],
    software: ['DaVinci Resolve Studio', 'Adobe After Effects', 'FabFilter Audio Suite'],
    description:
      'High-impact commercial video production for direct-to-consumer Swiss-movement watch brand. Clippasia transformed 42 minutes of raw studio and macro b-roll into 3 high-converting 30-45s vertical and horizontal ad variants.',
    clientFeedback: {
      quote:
        'Clippasia delivered our highest-converting ad campaign of the year. Their speed ramping and sound design dropped our Customer Acquisition Cost by 41% within the first 14 days of testing.',
      author: 'Marcus Vance',
      role: 'Growth Marketing Director, Kronos Horology'
    }
  },
  {
    id: 'future-silicon-docu',
    title: 'The AI Hardware Revolution — Documentary Essay',
    category: 'youtube',
    categoryLabel: 'YouTube & Long-form Documentary',
    client: 'Futura Tech Insights (820K Subscribers)',
    duration: '14:20',
    aspectRatio: '16:9',
    thumbnailUrl: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    hookHeadline: 'Sustained 68% Average View Duration on a 14-Minute Technical Breakdown',
    metrics: {
      label: 'Total Views & Retention',
      value: '1.42M Views (68% AVD)'
    },
    editingHighlights: [
      'Bespoke 2.5D photo parallax depth mapping from historical silicon archives',
      'Kinetic motion typography synchronized to conversational speech cadence',
      'Multi-stem documentary Foley soundscape building narrative anticipation',
      'Visual retention cliff smoothing using animated infographic comparisons'
    ],
    software: ['Adobe Premiere Pro', 'Adobe After Effects', 'iZotope RX 10 Audio'],
    description:
      'A cinematic deep-dive documentary analyzing the transition to wearable AI devices. Engineered to maintain 65%+ watch time retention through complex technical explanations using 3D camera projections and clean graphic overlays.',
    clientFeedback: {
      quote:
        'I used to spend 30 hours per YouTube video. Handing our raw footage to Clippasia doubled our upload cadence and drove our channel past 1 million views.',
      author: 'David Chen',
      role: 'Host & Producer, Futura Tech'
    }
  },
  {
    id: 'hydraglow-skincare-ugc',
    title: 'HydraGlow Skin Revival Serum — Viral TikTok UGC Cut',
    category: 'shortform',
    categoryLabel: 'Short-Form / Reels & TikTok',
    client: 'HydraGlow Beauty (London & Los Angeles)',
    duration: '0:34',
    aspectRatio: '9:16',
    thumbnailUrl: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    hookHeadline: 'Instant Split-Screen Problem-Agitation Hook (2.2M Organic Impressions)',
    metrics: {
      label: 'Organic Reach & Engagement',
      value: '2.2M Views'
    },
    editingHighlights: [
      'Skin texture preservation with digital blemish and lighting balance',
      'High-contrast kinetic captions with animated highlight color cues',
      'TikTok trending sound cue cut matching and audio risers',
      'Zoom punch-in on product dispenser sound triggers and foam texture'
    ],
    software: ['Adobe Premiere Pro', 'After Effects', 'CapCut Pro'],
    description:
      'Native-feeling UGC video ad optimized for TikTok Shop and Instagram Reels. Clippasia filtered through 14 customer selfie clips to construct a razor-sharp hook-story-offer narrative.',
    clientFeedback: {
      quote:
        'Clippasia understands viral TikTok pacing. It does not feel like stiff corporate agency fluff; it hooks viewers immediately and converts cold audiences profitably.',
      author: 'Sophia Rossi',
      role: 'Head of Social Commerce, HydraGlow'
    }
  },
  {
    id: 'cloudsync-saas-explainer',
    title: 'CloudSync Enterprise Platform — 60s Product Tour',
    category: 'explainer',
    categoryLabel: 'SaaS & Enterprise Product Tour',
    client: 'CloudSync Technologies (San Francisco, CA)',
    duration: '1:08',
    aspectRatio: '16:9',
    thumbnailUrl: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    hookHeadline: 'Turned Complex Multi-Cloud Architecture into an Intuitive 60-second Demo',
    metrics: {
      label: 'Trial Conversion Lift',
      value: '+42% Demo Bookings'
    },
    editingHighlights: [
      '3D isometric UI screen mockups with perspective tilt and drop shadows',
      'Cursor movement smoothing, click rippling, and feature pulsing',
      'Calibrated upbeat tech ambient soundtrack mixed at -14 LUFS broadcast standard',
      'Seamless vector camera zooms between analytics dashboards'
    ],
    software: ['Adobe After Effects', 'Premiere Pro', 'Cinema 4D Lite'],
    description:
      'Homepage hero product walkthrough video. Replaced static UI screenshots with fluid, cinematic motions that communicate speed, enterprise reliability, and ease of deployment.',
    clientFeedback: {
      quote:
        'Our sales team embeds this video in every outbound sequence. Demo booking conversions jumped 42% right after putting Clippasia’s cut on our homepage.',
      author: 'Elena Rostova',
      role: 'VP Marketing, CloudSync'
    }
  },
  {
    id: 'peak-performance-shorts',
    title: 'The Founder Mindset — 15x Micro-Content Weekly Batch',
    category: 'shortform',
    categoryLabel: 'Short-Form / Reels & TikTok',
    client: 'Peak Performance Media',
    duration: '0:48',
    aspectRatio: '9:16',
    thumbnailUrl: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    hookHeadline: '1 Long-form Podcast Episode -> 15 High-Engagement Viral Shorts',
    metrics: {
      label: 'Monthly Follower Growth',
      value: '+18.5K Followers/mo'
    },
    editingHighlights: [
      'Multi-speaker auto-reframe with dynamic speaker face tracking',
      'Word-by-word kinetic captions with bespoke brand typography and colors',
      'Contextual b-roll cutaways overlaid at pivotal emotional insights',
      'Seamless loop transitions encouraging viewers to watch twice'
    ],
    software: ['Adobe Premiere Pro', 'Descript', 'After Effects'],
    description:
      'Weekly batch post-production where 90 minutes of studio podcast footage is extracted into 15 high-retention conversational clips, fully animated with subtitles and viral sound design.',
    clientFeedback: {
      quote:
        'We grew our social reach from zero to over 600,000 monthly views in 60 days without having to spend any time inside an editing timeline ourselves.',
      author: 'Coach Liam Vance',
      role: 'Host, Peak Performance Media'
    }
  },
  {
    id: 'highland-coffee-artisan',
    title: 'Highland Specialty Coffee — Direct-Origin Brand Film',
    category: 'ecommerce',
    categoryLabel: 'eCommerce & Brand Story',
    client: 'Highland Coffee Roasters (Seattle, WA)',
    duration: '1:35',
    aspectRatio: '16:9',
    thumbnailUrl: '',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    hookHeadline: 'Sensory Storytelling Campaign for Subscription Coffee Launch',
    metrics: {
      label: 'Subscription Repeat Lift',
      value: '+54% LTV Growth'
    },
    editingHighlights: [
      'Kodachrome film emulation with organic 35mm grain integration',
      'Artisanal acoustic score synchronized to bean pour and espresso drip flow',
      '120fps high-frame-rate speed ramping with motion blur preservation',
      'Lower-third typography detailing farm altitude, varietal, and processing method'
    ],
    software: ['DaVinci Resolve Studio', 'Apple Logic Pro X'],
    description:
      'Brand film capturing the craftsmanship behind specialty single-origin coffee roasting. Designed for direct eCommerce subscriptions, Kickstarter pledges, and digital storefront heroes.',
    clientFeedback: {
      quote:
        'The warmth and organic cinematic tone Clippasia achieved with the color grade made our product subscription launch surpass its initial goal in under 48 hours.',
      author: 'Nico De Smet',
      role: 'Founder, Highland Coffee Roasters'
    }
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter-shortform',
    name: 'Short-Form Sprint Pack',
    tagline: 'Ideal for TikTok, Reels, & Shorts creators seeking high watch-time and rapid growth.',
    pricePerVideo: 49,
    monthlyPrice: 389,
    badge: 'Popular for Creators',
    features: [
      'Up to 8 viral short-form edits (up to 60s each)',
      'First-second hook construction & zoom punch-ins',
      'Word-by-word kinetic typography with emoji cues',
      'Trending sound design, whooshes, risers, and impact hits',
      'Skin tone color grading & noise balance',
      'Vertical 9:16 format with high-bitrate 4K export',
      '2 rounds of revisions included per video',
      'Guaranteed 24-48 hour turnaround per video'
    ],
    turnaround: '24-48 Hours',
    idealFor: 'Creators, personal brands, podcast repurposing, TikTok Shop sellers'
  },
  {
    id: 'growth-pro',
    name: 'Growth eCommerce & YouTube',
    tagline: 'Engineered for DTC brands and YouTube creators scaling ROAS and watch time.',
    pricePerVideo: 169,
    monthlyPrice: 799,
    badge: 'Best Value for Brands',
    isPopular: true,
    features: [
      'Long-form YouTube videos (up to 15 mins) OR 4 performance ad creatives',
      '3 distinct 3-second hook variations for ad split-testing',
      'Advanced 2.5D photo parallax depth mapping & custom motion graphics',
      'Licensed commercial royalty-free music & multi-stem sound design',
      'DaVinci Resolve cinema color grading (Rec.709 & HDR ready)',
      'Full audio mastering, dialogue isolation, and -14 LUFS loudness target',
      'High-CTR YouTube thumbnail concept included',
      'Unlimited revisions until 100% satisfied',
      'Assigned senior video editor dedicated to your account'
    ],
    turnaround: '48 Hours SLA',
    idealFor: 'DTC eCommerce brands, YouTube channels (10k-500k+), SaaS companies'
  },
  {
    id: 'studio-dedicated',
    name: 'Dedicated Video Editor Pod',
    tagline: 'Your outsourced high-volume post-production department on tap every business day.',
    monthlyPrice: 1490,
    badge: 'Full Scale Agency Retainer',
    features: [
      'Unlimited video editing requests & active queue management',
      'Full-time senior video editor assigned exclusively to your brand',
      'Direct private Slack / Discord / WhatsApp communication channel',
      'All video formats: Paid Ads, YouTube, Shorts, Courses, Webinars',
      'Complete raw project source files (.prproj, .drp, .aep) delivered',
      'Custom branded asset library & motion graphic templates created',
      'Priority 24-hour rush turnaround on all urgent cuts',
      'Zero long-term contracts: pause or cancel anytime with 1 click'
    ],
    turnaround: 'Daily Continuous Output',
    idealFor: 'Marketing agencies, high-volume DTC catalogs, media production companies'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Zack Thornton',
    role: 'Founder & CEO',
    company: 'Apex Nutrition DTC',
    location: 'Dallas, TX',
    avatar: 'ZT',
    stat: '+210% Ad Spend Efficiency',
    category: 'ecommerce',
    categoryLabel: 'DTC eCommerce Ads',
    rating: 5,
    verifiedDeliverable: '12x Meta & TikTok Video Creatives',
    quote:
      'We were burning $18,000/month on product videos that felt slow and dated. Clippasia completely restructured our video pacing. Their speed ramps, Foley sound design, and hook variations delivered our first 4.8x ROAS winner on TikTok and Meta ads.'
  },
  {
    id: 'test-2',
    name: 'Maya Lin',
    role: 'Tech Creator (450K Subs)',
    company: 'Lin Tech Media',
    location: 'San Francisco, CA',
    avatar: 'ML',
    stat: 'Retention: 34% -> 66% AVD',
    category: 'youtube',
    categoryLabel: 'YouTube Long-Form',
    rating: 5,
    verifiedDeliverable: 'Weekly 12-15min Tech Essays',
    quote:
      'Finding an editor who understands YouTube watch time without making it look like cheap hype slop is extremely rare. Clippasia strikes the perfect balance between high retention, 2.5D graphics, and editorial elegance. I save 25 hours every single week.'
  },
  {
    id: 'test-3',
    name: 'Farhan Kabir',
    role: 'Managing Director',
    company: 'Velox Digital Agency',
    location: 'Dubai, UAE',
    avatar: 'FK',
    stat: '50+ Client Videos / Month',
    category: 'agency',
    categoryLabel: 'Dedicated Pod Retainer',
    rating: 5,
    verifiedDeliverable: 'Omnichannel Post-Production',
    quote:
      'Clippasia has been the reliable operational backbone of our agency. Our clients love the 24-hour turnaround on short-form reels, and the DaVinci color grading on our luxury brand films is truly world-class. Zero missed deadlines in 8 months.'
  },
  {
    id: 'test-4',
    name: 'Samantha Reed',
    role: 'Head of Paid Acquisition',
    company: 'Lumina Horology',
    location: 'New York, NY',
    avatar: 'SR',
    stat: '-38% Customer Acquisition Cost',
    category: 'ecommerce',
    categoryLabel: 'DTC eCommerce Ads',
    rating: 5,
    verifiedDeliverable: 'Macro Watch Product Commercials',
    quote:
      'The 3-second hook variations Clippasia delivered made all the difference in our Meta Ads Manager. Being able to test three distinct intro hooks with the same body footage gave us an immediate 38% decrease in cost per purchase.'
  },
  {
    id: 'test-5',
    name: 'David Chen',
    role: 'Producer & Host (820K Subs)',
    company: 'Futura Tech Insights',
    location: 'Toronto, Canada',
    avatar: 'DC',
    stat: '1.42M Views on Docu-Cut',
    category: 'youtube',
    categoryLabel: 'YouTube Long-Form',
    rating: 5,
    verifiedDeliverable: 'Documentary Multi-Track Cut',
    quote:
      'Our audience noticed the quality upgrade immediately. The kinetic typography, archive b-roll animations, and audio mastering made our video essay feel like a Netflix documentary. It became our most viewed upload of the quarter.'
  },
  {
    id: 'test-6',
    name: 'Coach Tyler Brooks',
    role: 'Founder & Host',
    company: 'Peak Athletic Media',
    location: 'Miami, FL',
    avatar: 'TB',
    stat: '+35,000 Followers in 45 Days',
    category: 'shortform',
    categoryLabel: 'Shorts & TikTok UGC',
    rating: 5,
    verifiedDeliverable: '15x Weekly Shorts Batch',
    quote:
      'We simply drop our podcast recording link every Monday. By Wednesday morning, 15 animated, punchy reels with accurate subtitles, sound design, and zoom-cuts are in our portal ready to schedule. Invaluable team.'
  },
  {
    id: 'test-7',
    name: 'Liam O’Connor',
    role: 'eCommerce Director',
    company: 'Nordic Gear Outdoor',
    location: 'Oslo & London',
    avatar: 'LO',
    stat: '+44% Shopify Conversion Rate',
    category: 'ecommerce',
    categoryLabel: 'Product Video Ads',
    rating: 5,
    verifiedDeliverable: 'Highland Jacket Commercial Cut',
    quote:
      'We replaced our static product images on the homepage with Clippasia’s 45-second waterproof stress-test video cut. Conversion rates jumped 44% in month one. The color balance on outdoor weather footage is breathtaking.'
  },
  {
    id: 'test-8',
    name: 'Christopher Hayes',
    role: 'VP Marketing',
    company: 'CloudSync Enterprise',
    location: 'San Francisco, CA',
    avatar: 'CH',
    stat: '+42% Demo Bookings',
    category: 'agency',
    categoryLabel: 'SaaS Explainer Cut',
    rating: 5,
    verifiedDeliverable: '60s Interactive UI Walkthrough',
    quote:
      'Clippasia turned our complex cloud infrastructure diagram into a sleek, animated 60-second product tour. Prospects actually watch it to the end, and demo booking rates from our landing page climbed 42%.'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How does the free 1-minute test edit work?',
    answer:
      'We offer a zero-risk, no-credit-card required 1-minute test edit for qualifying businesses and creators. Submit a short raw clip via our inquiry form. We will cut it with our signature pacing, sound design, and color grade within 24 hours so you can evaluate our quality before committing.'
  },
  {
    question: 'What is Clippasia\'s typical turnaround time?',
    answer:
      'Short-form videos (Reels, TikToks, Shorts) are delivered within 24-48 hours. Full-length YouTube videos (8-15 mins) and multi-scene commercial ads are delivered in 48 hours. Dedicated Pod clients have continuous daily delivery.'
  },
  {
    question: 'How do we send our raw footage and assets?',
    answer:
      'You can share links via Google Drive, Dropbox, Frame.io, WeTransfer, or OneDrive. Once you onboard, we also provide a dedicated structured cloud folder organized by campaign and episode.'
  },
  {
    question: 'What if I need changes or revisions?',
    answer:
      'Growth and Dedicated plans include unlimited revisions. We use timestamped video review links so you can pause at any second, leave a note, and your editor adjusts it within hours.'
  },
  {
    question: 'Do you deliver source project files?',
    answer:
      'Yes! On our Dedicated Studio Pod and upon request for Growth plans, we provide clean, organized Adobe Premiere Pro project files (.prproj), DaVinci Resolve project archives (.drp), and After Effects comps (.aep).'
  },
  {
    question: 'What post-production software does Clippasia use?',
    answer:
      'Our senior editors are certified in DaVinci Resolve Studio (for industry-standard color grading), Adobe Premiere Pro (for precision narrative editing), Adobe After Effects (for motion graphics), and FabFilter / iZotope RX (for broadcast audio mastering).'
  }
];
