export type Language = 'en' | 'es' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' }
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    navChallenges: 'The Challenges',
    navComparison: 'Before & After',
    navPortfolio: 'Portfolio',
    navPricing: 'Pricing',
    navWorkflow: 'Workflow',
    navBookTest: 'Book Free Test Edit',
    navLanguage: 'Language',
    navPhotoEditing: 'Photo Editing Services',
    navMainWebsite: 'Main clippasia.com',

    // Hero
    heroBadge: 'Elite Video Post-Production & Color Grading Studio',
    heroTitlePart1: 'High-Retention Video Editing',
    heroTitlePart2: 'Engineered for Watch-Time & ROAS',
    heroSubtitle: 'We transform raw A-roll and shaky footage into retention-calibrated video assets. 24–48h delivery SLAs, DaVinci Resolve Studio color science, and dynamic sound design.',
    heroCtaPrimary: 'Claim 1-Minute Free Test Edit',
    heroCtaSecondary: 'Explore Video Portfolio',
    heroTurnaround: '24-48h Delivery SLA',
    heroRevision: 'Unlimited Revisions',
    heroRetention: '+184% Avg Retention Lift',

    // Challenges Section
    challengesPre: 'Stop Losing Viewers',
    challengesTitle: 'Real Production Bottlenecks Costing You Revenue',
    challengesSubtitle: 'Viewers judge your production value in under 3.5 seconds. Here is why conventional editing fails and how Clippasia recovers your retention.',
    challengesFixProblem: 'Fix This Problem',

    // Comparison Section
    comparePre: 'Side-by-Side Fidelity',
    compareTitle: 'Raw Log Footage vs. Clippasia Master Grade',
    compareSubtitle: 'Drag the interactive split slider to compare ungraded Sony S-Log3/Apple ProRes camera profiles against our calibrated DaVinci Resolve Studio grade and audio master.',
    compareRawLabel: 'Flat S-Log3 Camera File',
    compareGradeLabel: 'Clippasia Master 4K Grade',

    // Portfolio Section
    portfolioPre: 'Real Commercial Cuts & Case Studies',
    portfolioTitle: 'Videos Built for Watch-Time & Conversions',
    portfolioSubtitle: 'Explore real video assets delivered across DTC product launches, YouTube documentary essays, and viral TikTok campaigns. Hover to preview live playback.',
    portfolioAll: 'All Projects',
    portfolioEcommerce: 'eCommerce & Product Ads',
    portfolioYoutube: 'YouTube & Long-form',
    portfolioShorts: 'Shorts & TikTok UGC',
    portfolioExplainer: 'SaaS & Corporate',
    portfolioWatchFull: 'Watch Full Cut',

    // Pricing Section
    pricingPre: 'Transparent Investment & Measurable Returns',
    pricingTitle: 'Predictable Pricing. Zero Surprises.',
    pricingSubtitle: 'No bloated agency retainers or hidden hourly fees. Choose a flat package, measure your video churn recovery, or build a custom production scope.',
    pricingPerMonth: '/ month',
    pricingPerCut: 'or / single cut',
    pricingWhatsIncluded: "What's Included:",
    pricingBookTier: 'Book Plan',

    // Form Section
    formPre: 'Start Without Friction',
    formTitlePackage: 'Book Your Video Production Package',
    formTitleTest: 'Request a 1-Min Free Test Edit',
    formTabPackage: 'Book Service Package',
    formTabTest: '1-Min Free Test Edit',
    formFullName: 'Your Full Name',
    formEmail: 'Work Email',
    formBrand: 'Channel, Store or Brand Name',
    formPhone: 'Phone or WhatsApp',
    formOptional: 'Optional',
    formRequired: 'Required',
    formSelectService: 'Select Video Service',
    formFootageLink: 'Raw Footage Link (Google Drive, Dropbox, WeTransfer)',
    formNotesPackage: 'Project Brief, Pacing Notes, Reference Links or Deadlines',
    formNotesTest: 'Specific Style Instructions or Reference Channels for Your Test Cut',
    formSubmitPackage: 'Confirm & Book Service Package',
    formSubmitTest: 'Claim 1-Minute Free Test Edit (Zero Risk)',
    formNda: 'NDA & Confidentiality Guaranteed',
    formResponseTime: '2-Hour Response Time',

    // Live Chat & Footer
    chatButton: 'Chat with an Editor',
    chatTypicallyReplies: 'Typically replies in ~2m',
    chatOnline: 'Online'
  },
  es: {
    // Navigation
    navChallenges: 'Los Retos',
    navComparison: 'Antes y Después',
    navPortfolio: 'Portafolio',
    navPricing: 'Precios',
    navWorkflow: 'Proceso',
    navBookTest: 'Prueba Gratis de 1 Min',
    navLanguage: 'Idioma',
    navPhotoEditing: 'Servicios de Edición de Fotos',
    navMainWebsite: 'Sitio Principal clippasia.com',

    // Hero
    heroBadge: 'Estudio Élite de Posproducción y Corrección de Color',
    heroTitlePart1: 'Edición de Video de Alta Retención',
    heroTitlePart2: 'Diseñada para Tiempo de Visualización y ROAS',
    heroSubtitle: 'Transformamos tu metraje sin editar en videos optimizados para retener a tu audiencia. Entregas en 24-48h, gradación DaVinci Resolve y diseño de audio dinámico.',
    heroCtaPrimary: 'Solicitar Edición de Prueba Gratis (1 Min)',
    heroCtaSecondary: 'Explorar Portafolio',
    heroTurnaround: 'Entrega en 24-48 horas',
    heroRevision: 'Revisiones Ilimitadas',
    heroRetention: '+184% Retención Promedio',

    // Challenges Section
    challengesPre: 'Deja de Perder Audiencia',
    challengesTitle: 'Cuellos de Botella que le Cuestan Dinero a tu Negocio',
    challengesSubtitle: 'Los espectadores juzgan tu calidad en menos de 3.5 segundos. Descubre por qué la edición tradicional falla y cómo Clippasia recupera tu retención.',
    challengesFixProblem: 'Resolver Este Problema',

    // Comparison Section
    comparePre: 'Fidelidad Comparativa',
    compareTitle: 'Metraje Plano Log vs. Master Grado Clippasia',
    compareSubtitle: 'Arrastra el control deslizante para comparar perfiles planos Sony S-Log3/Apple ProRes con nuestra gradación calibrada en DaVinci Resolve y masterización de sonido.',
    compareRawLabel: 'Metraje Plano S-Log3',
    compareGradeLabel: 'Master Clippasia 4K Calibrado',

    // Portfolio Section
    portfolioPre: 'Cortes Comerciales y Casos Reales',
    portfolioTitle: 'Videos Creados para Retención y Conversiones',
    portfolioSubtitle: 'Explora proyectos reales entregados para marcas DTC, documentales de YouTube y campañas virales de TikTok. Pasa el cursor para ver reproducción en vivo.',
    portfolioAll: 'Todos los Proyectos',
    portfolioEcommerce: 'Anuncios eCommerce y Productos',
    portfolioYoutube: 'YouTube y Formato Largo',
    portfolioShorts: 'Shorts y TikTok UGC',
    portfolioExplainer: 'SaaS y Corporativo',
    portfolioWatchFull: 'Ver Corte Completo',

    // Pricing Section
    pricingPre: 'Inversión Transparente y Retorno Medible',
    pricingTitle: 'Precios Claros. Cero Sorpresas.',
    pricingSubtitle: 'Sin tarifas infladas de agencias ni horas ocultas. Elige un paquete fijo, calcula el retorno de tu retención o personaliza el alcance.',
    pricingPerMonth: '/ mes',
    pricingPerCut: 'o / corte individual',
    pricingWhatsIncluded: 'Qué incluye:',
    pricingBookTier: 'Reservar Plan',

    // Form Section
    formPre: 'Empieza sin Fricción',
    formTitlePackage: 'Reserva tu Paquete de Producción de Video',
    formTitleTest: 'Solicita una Edición de Prueba de 1 Minuto Gratis',
    formTabPackage: 'Contratar Paquete de Servicio',
    formTabTest: 'Prueba Gratis de 1 Minuto',
    formFullName: 'Nombre Completo',
    formEmail: 'Correo Electrónico de Trabajo',
    formBrand: 'Canal, Tienda o Nombre de Marca',
    formPhone: 'Teléfono o WhatsApp',
    formOptional: 'Opcional',
    formRequired: 'Requerido',
    formSelectService: 'Seleccionar Servicio de Video',
    formFootageLink: 'Enlace del Metraje (Google Drive, Dropbox, WeTransfer)',
    formNotesPackage: 'Brief del Proyecto, Notas de Ritmo, Enlaces de Referencia o Fechas',
    formNotesTest: 'Instrucciones Específicas de Estilo o Canales de Referencia',
    formSubmitPackage: 'Confirmar y Reservar Paquete de Servicio',
    formSubmitTest: 'Reclamar Edición de Prueba Gratis (Sin Riesgo)',
    formNda: 'Acuerdo de Confidencialidad Garantizado',
    formResponseTime: 'Respuesta en Menos de 2 Horas',

    // Live Chat & Footer
    chatButton: 'Hablar con un Editor',
    chatTypicallyReplies: 'Responde habitualmente en ~2 min',
    chatOnline: 'En Línea'
  },
  ar: {
    // Navigation
    navChallenges: 'التحديات',
    navComparison: 'قبل وبعد',
    navPortfolio: 'أعمالنا',
    navPricing: 'الأسعار',
    navWorkflow: 'سير العمل',
    navBookTest: 'احجز تجربة مجانية',
    navLanguage: 'اللغة',
    navPhotoEditing: 'خدمات تعديل الصور',
    navMainWebsite: 'الموقع الرئيسي clippasia.com',

    // Hero
    heroBadge: 'استوديو النخبة للمونتاج السينمائي وتصحيح الألوان',
    heroTitlePart1: 'مونتاج فيديو عالي الاحتفاظ بالجمهور',
    heroTitlePart2: 'مصمم خصيصاً لزيادة وقت المشاهدة والعائد الإعلاني',
    heroSubtitle: 'نحول المقاطع الأولية إلى مقاطع فيديو متقنة تضاعف تفاعل جمهورك. تسليم فائق السرعة خلال 24–48 ساعة وتصحيح ألوان سينمائي ببرنامج DaVinci Resolve.',
    heroCtaPrimary: 'احصل على تعديل تجريبي مجاني (دقيقة واحدة)',
    heroCtaSecondary: 'استعرض معرض الأعمال',
    heroTurnaround: 'تسليم خلال 24-48 ساعة',
    heroRevision: 'تعديلات غير محدودة',
    heroRetention: '+184% متوسط زيادة المشاهدة',

    // Challenges Section
    challengesPre: 'أوقف نزيف المشاهدات',
    challengesTitle: 'عقبات إنتاجية حقيقية تكلفك الملايين في إعلاناتك',
    challengesSubtitle: 'يحكم الجمهور على جودة الفيديو خلال أقل من 3.5 ثوانٍ. اكتشف لماذا تفشل الطرق التقليدية وكيف يعيد لك Clippasia الجمهور.',
    challengesFixProblem: 'حل هذه المشكلة الآن',

    // Comparison Section
    comparePre: 'المقارنة المباشرة',
    compareTitle: 'المقاطع الأولية الخام مقابل إنتاج Clippasia المتقن',
    compareSubtitle: 'اسحب شريط المقارنة التفاعلي لمشاهدة الفرق بين ملفات الكاميرا الباهتة وتصحيح الألوان المتطور مع هندسة الصوت المتميزة.',
    compareRawLabel: 'ملف الكاميرا الخام S-Log3',
    compareGradeLabel: 'نسخة Clippasia الاحترافية 4K',

    // Portfolio Section
    portfolioPre: 'أعمال حقيقية ودراسات حالة ناجحة',
    portfolioTitle: 'فيديوهات مصممة لوقت مشاهدة أطول ومبيعات أعلى',
    portfolioSubtitle: 'تصفح أعمالنا في إعلانات التجارة الإلكترونية، والأفلام الوثائقية على YouTube، وحملات TikTok الفيروسية. مرر المؤشر للمشاهدة.',
    portfolioAll: 'جميع الأعمال',
    portfolioEcommerce: 'إعلانات المتاجر والمنتجات',
    portfolioYoutube: 'يوتيوب والمحتوى الطويل',
    portfolioShorts: 'ريلز وتيك توك UGC',
    portfolioExplainer: 'الشركات والبرمجيات SaaS',
    portfolioWatchFull: 'شاهد الفيديو كاملاً',

    // Pricing Section
    pricingPre: 'استثمار شفاف وعوائد قابلة للقياس',
    pricingTitle: 'أسعار واضحة ومحددة. بدون مفاجآت.',
    pricingSubtitle: 'لا رسوم خفية أو تكاليف إضافية غير متوقعة. اختر الباقة المناسبة أو قم بحساب العائد الاستثماري المتوقع.',
    pricingPerMonth: '/ شهرياً',
    pricingPerCut: 'أو / لكل فيديو',
    pricingWhatsIncluded: 'ما يتضمنه العرض:',
    pricingBookTier: 'حجز الباقة',

    // Form Section
    formPre: 'ابدأ بدون أي تعقيد',
    formTitlePackage: 'احجز باقة إنتاج الفيديو الاحترافية',
    formTitleTest: 'اطلب تعديل دقيقة واحدة مجاناً لتجربة جودتنا',
    formTabPackage: 'حجز باقة خدمة',
    formTabTest: 'تعديل تجريبي مجاني 1 دقيقة',
    formFullName: 'الاسم الكامل',
    formEmail: 'البريد الإلكتروني للعمل',
    formBrand: 'اسم القناة، المتجر أو العلامة التجارية',
    formPhone: 'رقم الهاتف أو واتساب',
    formOptional: 'اختياري',
    formRequired: 'مطلوب',
    formSelectService: 'اختر نوع خدمة الفيديو',
    formFootageLink: 'رابط الملفات الخام (Google Drive, Dropbox, WeTransfer)',
    formNotesPackage: 'تفاصيل المشروع، المراجع المفضلة، أو المواعيد النهائية',
    formNotesTest: 'تعليمات النمط المطلوب أو قنوات المرجع للتعديل التجريبي',
    formSubmitPackage: 'تأكيد وحجز باقة الخدمة',
    formSubmitTest: 'احصل على التعديل التجريبي المجاني (بدون أي التزام)',
    formNda: 'اتفاقية سرية وعدم إفصاح مضمونة',
    formResponseTime: 'رد فريق التحرير خلال ساعتين',

    // Live Chat & Footer
    chatButton: 'تحدث مع محرر الفيديو',
    chatTypicallyReplies: 'الرد عادةً خلال دقيقتين',
    chatOnline: 'متصل الآن'
  }
};
