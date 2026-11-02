import React, { useState, useEffect } from 'react';
import { InquiryFormData } from '../types';
import { CLIPPASIA_INFO } from '../data/mockData';
import { createBooking, EmailNotificationPayload } from '../lib/firebase';
import {
  Sparkles,
  Send,
  CheckCircle2,
  ShieldCheck,
  Link2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Tag,
  PackageCheck,
  Film,
  ChevronDown,
  Eye,
  Database,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InquirySectionProps {
  initialServiceTier?: string;
  initialVideoType?: string;
  initialNotes?: string;
  forceFreeTestEdit?: boolean;
  onOpenAdmin?: () => void;
}

export const WATCH_TIME_SERVICES = [
  { id: 'ecommerce', label: 'eCommerce & Product Ads' },
  { id: 'youtube', label: 'YouTube & Long-form' },
  { id: 'shortform', label: 'Shorts & TikTok UGC' },
  { id: 'explainer', label: 'SaaS & Corporate' },
  { id: 'dedicated_pod', label: 'Dedicated Video Editor Pod (All Formats)' }
];

export const InquirySection: React.FC<InquirySectionProps> = ({
  initialServiceTier,
  initialVideoType,
  initialNotes,
  forceFreeTestEdit = false,
  onOpenAdmin
}) => {
  const { t } = useLanguage();

  // Mode: 'book_package' vs 'test_edit'
  const [activeTab, setActiveTab] = useState<'book_package' | 'test_edit'>(
    forceFreeTestEdit ? 'test_edit' : 'book_package'
  );

  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phoneOrWhatsApp: '',
    channelOrBrand: '',
    serviceTier: initialServiceTier || 'Growth eCommerce & YouTube',
    videoType: initialVideoType || 'eCommerce & Product Ads',
    footageLink: '',
    projectNotes: initialNotes || '',
    requestFreeTestEdit: forceFreeTestEdit
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [dispatchedEmails, setDispatchedEmails] = useState<{
    user: EmailNotificationPayload;
    admin: EmailNotificationPayload;
  } | null>(null);
  const [previewEmail, setPreviewEmail] = useState<EmailNotificationPayload | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync if initial props change (e.g. user clicked a pricing tier, hero CTA, or portfolio style)
  useEffect(() => {
    if (forceFreeTestEdit) {
      setActiveTab('test_edit');
      setFormData((prev) => ({ ...prev, requestFreeTestEdit: true }));
    } else if (initialServiceTier) {
      setActiveTab('book_package');
      setFormData((prev) => ({
        ...prev,
        serviceTier: initialServiceTier,
        requestFreeTestEdit: false
      }));
    }
    if (initialVideoType) {
      setFormData((prev) => ({ ...prev, videoType: initialVideoType }));
    }
    if (initialNotes) {
      setFormData((prev) => ({ ...prev, projectNotes: initialNotes }));
    }
  }, [initialServiceTier, initialVideoType, initialNotes, forceFreeTestEdit]);

  const handleTabChange = (tab: 'book_package' | 'test_edit') => {
    setActiveTab(tab);
    setFormData((prev) => ({
      ...prev,
      requestFreeTestEdit: tab === 'test_edit'
    }));
    setErrors({});
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.channelOrBrand.trim()) {
      errs.channelOrBrand = 'Please enter your channel or brand name';
    }
    if (activeTab === 'test_edit' && !formData.footageLink.trim()) {
      errs.footageLink = 'Please provide a raw footage link (Drive/Dropbox) so we can cut your test';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const newTicket = `CLIPP-${Math.floor(100000 + Math.random() * 900000)}`;
      const result = await createBooking({
        ticketId: newTicket,
        type: activeTab,
        fullName: formData.fullName,
        email: formData.email,
        phoneOrWhatsApp: formData.phoneOrWhatsApp,
        channelOrBrand: formData.channelOrBrand,
        serviceTier: activeTab === 'book_package' ? formData.serviceTier : '1-Minute Free Test Edit',
        videoType: formData.videoType,
        footageLink: formData.footageLink,
        projectNotes: formData.projectNotes,
        requestFreeTestEdit: activeTab === 'test_edit'
      });

      setTicketId(newTicket);
      setDispatchedEmails({ user: result.userEmail, admin: result.adminEmail });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-24 bg-gradient-to-b from-[#06070B] via-[#090C16] to-[#06070B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            {t('formPre')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {activeTab === 'book_package'
              ? t('formTitlePackage')
              : t('formTitleTest')}
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            {activeTab === 'book_package'
              ? 'Reserve your dedicated post-production slot with Clippasia. Fast 24-48h turnaround, unlimited revisions, and broadcast color grading.'
              : 'Test our quality before you commit a single dollar. If you are not blown away by our first cut, you owe us nothing.'}
          </p>
        </div>

        {/* Main Form Container */}
        <div className="max-w-3xl mx-auto bg-[#0C0F18] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-10">
          
          {/* Top Two-Option Mode Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => handleTabChange('book_package')}
              className={`py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'book_package'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>{t('formTabPackage')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('test_edit')}
              className={`py-2.5 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'test_edit'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{t('formTabTest')}</span>
            </button>
          </div>

          {isSubmitted ? (
            /* Success Receipt Confirmation Screen with Firestore & Email Audit */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-[11px] font-mono text-emerald-300">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved to Database · Ticket #{ticketId}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {activeTab === 'test_edit'
                    ? 'Your Free 1-Minute Test Edit Request is Queued!'
                    : `Your Booking for "${formData.serviceTier || 'Video Production'}" is Confirmed!`}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your project has been recorded in the studio database and assigned to Clippasia&apos;s senior post-production team.
                </p>
                {activeTab === 'book_package' && formData.videoType && (
                  <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg inline-block">
                    Selected Service: {formData.videoType}
                  </div>
                )}
              </div>

              {/* Automated Email Notifications Audit Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 text-left max-w-lg mx-auto space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Automated Email Notifications Dispatched</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                    Delivered
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* User confirmation row */}
                  <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Client Confirmation Receipt</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Sent to: <span className="text-cyan-300">{formData.email}</span>
                      </div>
                    </div>
                    {dispatchedEmails?.user && (
                      <button
                        type="button"
                        onClick={() => setPreviewEmail(dispatchedEmails.user)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono shrink-0 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    )}
                  </div>

                  {/* Admin alert row */}
                  <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Studio Admin Intake Alert</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Sent to: <span className="text-amber-300">{CLIPPASIA_INFO.alternateEmail || 'asiaclipp@gmail.com'}</span>
                      </div>
                    </div>
                    {dispatchedEmails?.admin && (
                      <button
                        type="button"
                        onClick={() => setPreviewEmail(dispatchedEmails.admin)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono shrink-0 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  * Live email payloads generated and stored in Firestore database. Turnaround SLA: 24–48 hours.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData((prev) => ({
                      ...prev,
                      projectNotes: '',
                      footageLink: ''
                    }));
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Project
                </button>

                <a
                  href={`https://wa.me/8801740925244?text=Hi%20Clipp%20Asia%20Studio%2C%20I%20just%20submitted%20project%20ticket%20%23${ticketId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-lg transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Instant WhatsApp Support</span>
                </a>
              </div>
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Context Banner */}
              {activeTab === 'book_package' ? (
                /* Book Service Package Banner */
                <div className="px-4 py-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <Tag className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Selected Plan: <strong>{formData.serviceTier || 'Growth eCommerce & YouTube'}</strong></span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">24-48h Turnaround SLA · Revisions Included</span>
                </div>
              ) : (
                /* 1-Min Free Test Edit Banner */
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900 border border-cyan-800/50 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Zero-Risk 1-Minute Test Edit</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      No upfront payment. We cut a 1-minute sample of your raw footage so you can experience our retention-first editing.
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-1 rounded shrink-0 hidden sm:block">
                    100% Free
                  </span>
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    {t('formFullName')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-lg text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  {errors.fullName && (
                    <div className="text-[11px] text-rose-400">{errors.fullName}</div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    {t('formEmail')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@brand.com"
                    className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-lg text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  {errors.email && (
                    <div className="text-[11px] text-rose-400">{errors.email}</div>
                  )}
                </div>
              </div>

              {/* Row 2: Brand/Channel URL and Phone/WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    {t('formBrand')} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.channelOrBrand}
                    onChange={(e) =>
                      setFormData({ ...formData, channelOrBrand: e.target.value })
                    }
                    placeholder="youtube.com/@channel or brand.com"
                    className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-lg text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  {errors.channelOrBrand && (
                    <div className="text-[11px] text-rose-400">{errors.channelOrBrand}</div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span>{t('formPhone')}</span>
                    <span className="text-[10px] font-mono text-slate-500">{t('formOptional')}</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneOrWhatsApp || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneOrWhatsApp: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000 or WhatsApp"
                    className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-lg text-white placeholder-slate-600 focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Dropdown Button for Video Services from "Videos Built for Watch-Time & Conversions" (Only in Book Service Package) */}
              {activeTab === 'book_package' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t('formSelectService')}</span>
                      <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 hidden xs:inline">
                      Videos Built for Watch-Time
                    </span>
                  </label>
                  
                  <div className="relative">
                    <select
                      value={formData.videoType}
                      onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                      className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-lg text-white focus:outline-none transition-colors cursor-pointer appearance-none pr-10"
                    >
                      {WATCH_TIME_SERVICES.map((s) => (
                        <option key={s.id} value={s.label} className="bg-slate-900 text-white py-1">
                          {s.label}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Row 4: Raw Footage Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {t('formFootageLink')}
                      {activeTab === 'test_edit' && <span className="text-rose-400 ml-1">*</span>}
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {activeTab === 'test_edit' ? t('formRequired') : t('formOptional')}
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.footageLink}
                  onChange={(e) => setFormData({ ...formData, footageLink: e.target.value })}
                  placeholder="https://drive.google.com/drive/... or Dropbox"
                  className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-lg text-white placeholder-slate-600 focus:outline-none transition-colors font-mono"
                />
                {errors.footageLink && (
                  <div className="text-[11px] text-rose-400">{errors.footageLink}</div>
                )}
              </div>

              {/* Row 5: Project Notes & References */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  {activeTab === 'book_package'
                    ? t('formNotesPackage')
                    : t('formNotesTest')}
                </label>
                <textarea
                  rows={3}
                  value={formData.projectNotes}
                  onChange={(e) => setFormData({ ...formData, projectNotes: e.target.value })}
                  placeholder={
                    activeTab === 'book_package'
                      ? 'Tell us about the desired pacing, reference channels you admire, or turnaround dates...'
                      : 'Tell us how you want this 1-minute test styled (e.g. fast TikTok hooks, Ali Abdaal style subtitles, cinema grade)...'
                  }
                  className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-xs bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-lg text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : activeTab === 'book_package' ? (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('formSubmitPackage')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t('formSubmitTest')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 font-mono text-center">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  {t('formNda')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {t('formResponseTime')}
                </span>
              </div>

            </form>
          )}

        </div>

        {/* Real Direct Communication Cards below Form */}
        <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <a
            href={`https://wa.me/8801911862115`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center gap-3 text-slate-300"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">WhatsApp / Direct Line</div>
              <div className="text-white font-semibold">{CLIPPASIA_INFO.phoneWhatsApp}</div>
            </div>
          </a>

          <a
            href={`mailto:${CLIPPASIA_INFO.primaryEmail}`}
            className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center gap-3 text-slate-300"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Production Support</div>
              <div className="text-white font-semibold">{CLIPPASIA_INFO.primaryEmail}</div>
            </div>
          </a>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-3 text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Global Hub</div>
              <div className="text-white font-semibold">Irving, TX · Dubai · BD</div>
            </div>
          </div>
        </div>

      </div>

      {/* Dispatched Email Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0F18] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white text-sm">Dispatched Email Audit</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewEmail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-400">
                Recipient: <strong className="text-white font-mono">{previewEmail.recipientEmail}</strong>
              </div>
              <div className="text-slate-400">
                Subject: <strong className="text-white">{previewEmail.subject}</strong>
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Status: <span className="text-emerald-400 font-semibold uppercase">{previewEmail.status}</span> · {new Date(previewEmail.timestamp).toLocaleTimeString()}
              </div>
            </div>

            <div
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed max-h-72 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: previewEmail.bodyHtml }}
            />

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewEmail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
