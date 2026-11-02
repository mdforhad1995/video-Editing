import React, { useState, useEffect } from 'react';
import {
  BookingRecord,
  EmailNotificationPayload,
  getBookings,
  updateBooking,
  deleteBookingRecord,
  getDispatchedEmails,
  saveDispatchedEmail,
  sendStatusNotificationToClient,
  getLocalSiteSettings,
  saveLocalSiteSettings,
  AdminSiteSettings,
  DEFAULT_SITE_SETTINGS
} from '../lib/firebase';
import { PRICING_TIERS, PORTFOLIO_DATA, CLIPPASIA_INFO } from '../data/mockData';
import { PricingTier, PortfolioItem, ProblemItem } from '../types';
import { useCms } from '../context/CmsContext';
import {
  LayoutDashboard,
  ShoppingBag,
  DollarSign,
  Film,
  Settings,
  Mail,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  Plus,
  Save,
  ArrowLeft,
  ShieldCheck,
  Eye,
  Video,
  Phone,
  User,
  Calendar,
  X,
  Send,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Sliders,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Layers,
  FileEdit,
  Globe,
  Radio,
  LogOut
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  // ----------------------------------------------------
  // AUTHENTICATION STATE (ID & Password Barrier)
  // ----------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem('clippasia_admin_session') === 'true' ||
      localStorage.getItem('clippasia_admin_session') === 'true'
    );
  });
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // ----------------------------------------------------
  // CMS STATE (Site Sections Content Manager)
  // ----------------------------------------------------
  const { cms, updateSection, isSaving: isCmsSaving } = useCms();
  const [cmsTab, setCmsTab] = useState<'challenges' | 'beforeAfter' | 'roi' | 'process' | 'faq'>('challenges');
  
  // Local edit copies for CMS sections
  const [cmsChallenges, setCmsChallenges] = useState(cms.challenges);
  const [cmsBeforeAfter, setCmsBeforeAfter] = useState(cms.beforeAfter);
  const [cmsRoi, setCmsRoi] = useState(cms.roi);
  const [cmsProcess, setCmsProcess] = useState(cms.process);
  const [cmsFaq, setCmsFaq] = useState(cms.faq);

  useEffect(() => {
    setCmsChallenges(cms.challenges);
    setCmsBeforeAfter(cms.beforeAfter);
    setCmsRoi(cms.roi);
    setCmsProcess(cms.process);
    setCmsFaq(cms.faq);
  }, [cms]);

  // ----------------------------------------------------
  // ADMIN PANEL NAVIGATION & DATA STATE
  // ----------------------------------------------------
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'cms' | 'pricing' | 'portfolio' | 'emails' | 'settings'
  >('bookings');

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Delete Confirmation Modal state (NO window.confirm!)
  const [ticketToDelete, setTicketToDelete] = useState<{ ticketId: string; clientName: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Change & Customer Email Dispatch Modal state
  const [statusModalBooking, setStatusModalBooking] = useState<BookingRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<BookingRecord['status']>('in_review');
  const [statusCustomNote, setStatusCustomNote] = useState('');
  const [statusPreviewUrl, setStatusPreviewUrl] = useState('');
  const [sendClientEmailNotification, setSendClientEmailNotification] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Email notifications state
  const [emails, setEmails] = useState<EmailNotificationPayload[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotificationPayload | null>(null);

  // Settings & SMTP state
  const [settings, setSettings] = useState<AdminSiteSettings>(getLocalSiteSettings());
  const [smtpPasswordInput, setSmtpPasswordInput] = useState(settings.smtpPass || '');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // Pricing & Portfolio states
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(() => {
    try {
      const stored = localStorage.getItem('clippasia_custom_pricing');
      return stored ? JSON.parse(stored) : PRICING_TIERS;
    } catch {
      return PRICING_TIERS;
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const stored = localStorage.getItem('clippasia_custom_portfolio');
      return stored ? JSON.parse(stored) : PORTFOLIO_DATA;
    } catch {
      return PORTFOLIO_DATA;
    }
  });

  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // ----------------------------------------------------
  // DATA FETCHING & SYNCHRONIZATION
  // ----------------------------------------------------
  const refreshData = async () => {
    setIsLoadingBookings(true);
    try {
      const list = await getBookings();
      setBookings(list);
      setEmails(getDispatchedEmails());
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // ----------------------------------------------------
  // AUTHENTICATION LOGIC
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validUsernames = ['admin@clippasia.com', 'asiaclipp@gmail.com', 'admin', 'clippasia'];
    const activeUsername = settings.adminUsername || 'admin@clippasia.com';
    const activePassword = settings.adminPassword || 'clippasia2025';

    const inputUser = loginId.trim().toLowerCase();
    const isUserValid = validUsernames.includes(inputUser) || inputUser === activeUsername.toLowerCase();
    const isPassValid = loginPassword.trim() === activePassword.trim();

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('clippasia_admin_session', 'true');
      if (rememberMe) {
        localStorage.setItem('clippasia_admin_session', 'true');
      }
      showToast('Welcome to Clipp Asia Studio Master Control Center');
    } else {
      setLoginError('Invalid Admin ID or Password. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('clippasia_admin_session');
    localStorage.removeItem('clippasia_admin_session');
    showToast('Signed out of Admin Panel', 'info');
  };

  // ----------------------------------------------------
  // BOOKINGS: SAFE DELETION (NO WINDOW.CONFIRM)
  // ----------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    setIsDeleting(true);
    const id = ticketToDelete.ticketId;
    try {
      await deleteBookingRecord(id);
      setBookings((prev) => prev.filter((b) => b.ticketId !== id && b.id !== id));
      if (selectedBooking?.ticketId === id) {
        setSelectedBooking(null);
      }
      setTicketToDelete(null);
      showToast(`Order #${id} permanently deleted from database`, 'info');
    } catch (err) {
      showToast(`Failed to delete order #${id}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // ----------------------------------------------------
  // STATUS UPDATE WITH CLIENT EMAIL PROGRESS NOTIFICATION
  // ----------------------------------------------------
  const openStatusModal = (booking: BookingRecord) => {
    setStatusModalBooking(booking);
    setTargetStatus(booking.status);
    setStatusCustomNote(booking.editorNotes || '');
    setStatusPreviewUrl('');
    setSendClientEmailNotification(true);
  };

  const handleApplyStatusChange = async () => {
    if (!statusModalBooking) return;
    setIsUpdatingStatus(true);
    const ticketId = statusModalBooking.ticketId;
    const booking = statusModalBooking;

    const statusDescriptions: Record<string, string> = {
      received: 'Raw footage received and verified in our production queue.',
      in_review: 'Footage and project brief currently undergoing lead editor storyboard triage.',
      assigned: 'Project has been assigned to a Dedicated Senior Video Editor Pod.',
      color_grading: 'Undergoing broadcast DaVinci Resolve Studio 3D LUT color grading & Foley audio design.',
      revisions: 'Video cut is in client revision fine-tuning to ensure 100% satisfaction.',
      completed: '🎉 Final deliverables ready! Master 4K renders exported and ready for distribution.'
    };

    const statusLabels: Record<string, string> = {
      received: 'Received',
      in_review: 'Footage Review',
      assigned: 'Editor Assigned',
      color_grading: 'Color Grading & Audio',
      revisions: 'Revisions & Polish',
      completed: 'Completed & Delivered'
    };

    try {
      // 1. Update in Firestore & local cache
      await updateBooking(ticketId, {
        status: targetStatus,
        editorNotes: statusCustomNote
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.ticketId === ticketId ? { ...b, status: targetStatus, editorNotes: statusCustomNote } : b
        )
      );

      // 2. Dispatch real email notification to client if enabled
      if (sendClientEmailNotification && booking.email) {
        await sendStatusNotificationToClient({
          ticketId,
          customerName: booking.fullName,
          customerEmail: booking.email,
          newStatus: targetStatus,
          statusLabel: statusLabels[targetStatus] || targetStatus,
          statusDescription: statusDescriptions[targetStatus] || 'Progress update recorded.',
          editorNotes: statusCustomNote,
          previewLink: statusPreviewUrl || undefined
        });

        setEmails(getDispatchedEmails());
        showToast(
          `Status changed to "${statusLabels[targetStatus]}". Notification email sent to ${booking.email} from info@clippasia.com!`
        );
      } else {
        showToast(`Order #${ticketId} status updated to: ${targetStatus}`);
      }

      setStatusModalBooking(null);
    } catch (err: any) {
      showToast(`Error updating status: ${err?.message || 'Server error'}`, 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ----------------------------------------------------
  // SMTP CONFIGURATION & LIVE TEST EMAIL
  // ----------------------------------------------------
  const handleSaveSmtpSettings = async () => {
    const updated = {
      ...settings,
      smtpPass: smtpPasswordInput
    };
    saveLocalSiteSettings(updated);
    setSettings(updated);

    try {
      const res = await fetch('/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: updated.smtpHost,
          port: updated.smtpPort,
          user: updated.smtpUser,
          pass: smtpPasswordInput,
          fromEmail: updated.smtpFrom || 'info@clippasia.com',
          fromName: updated.brandName || 'Clipp Asia Studio',
          adminEmail: updated.adminEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('SMTP Server settings saved & synced to email engine');
      }
    } catch {
      showToast('Settings saved to local storage');
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: settings.adminEmail || 'asiaclipp@gmail.com',
          testHost: settings.smtpHost,
          testPort: settings.smtpPort,
          testUser: settings.smtpUser,
          testPass: smtpPasswordInput
        })
      });
      const data = await res.json();
      setTestEmailResult(data);
      if (data.success) {
        showToast(`Test email successfully sent to ${settings.adminEmail}!`);
      } else {
        showToast(data.message || 'SMTP Test failed', 'error');
      }
    } catch (err: any) {
      setTestEmailResult({ success: false, message: err?.message || 'Connection failed' });
      showToast('Error connecting to mail server', 'error');
    } finally {
      setTestEmailLoading(false);
    }
  };

  // ----------------------------------------------------
  // Filtered Bookings
  // ----------------------------------------------------
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.ticketId.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.channelOrBrand.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // ====================================================
  // VIEW: AUTHENTICATION LOGIN GATE
  // ====================================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#06080F] text-slate-100 flex flex-col items-center justify-center p-4">
        {/* Ambient background styling */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#0C101A] border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Clipp Asia Studio · Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authorized post-production management & order fulfillment login
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Admin User ID / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@clippasia.com"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter studio password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-slate-500 font-mono">Default: clippasia2025</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wide shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Studio Control Center</span>
            </button>
          </form>

          {/* Back to Site Button */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // ====================================================
  return (
    <div className="fixed inset-0 z-50 bg-[#07090E] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Top Admin Navigation Header */}
      <header className="h-16 border-b border-slate-800 bg-[#0B0E17] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Site</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Studio Brand Mark */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>Clipp<span className="text-cyan-400">Asia</span> Studio</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Admin Master
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Order Pipeline · Content CMS · SMTP Engine
              </div>
            </div>
          </div>
        </div>

        {/* Status, User & Logout controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Firestore:</span>
            <span className="text-cyan-300 font-semibold">Live Connected</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>{settings.adminEmail}</span>
          </div>

          <button
            onClick={refreshData}
            disabled={isLoadingBookings}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Orders & Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingBookings ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock Panel & Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`fixed top-20 right-6 z-50 border rounded-xl px-4 py-3 shadow-2xl text-xs text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
            notificationMsg.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/80 text-rose-200'
              : 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500/60 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* Main Workspace Layout (Sidebar Navigation + Dynamic Tab Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-16 sm:w-60 border-r border-slate-800 bg-[#090C15] flex flex-col shrink-0">
          <div className="p-3 sm:p-4 space-y-1.5 flex-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-cyan-400" />
              <span className="hidden sm:inline">Orders & Ingest</span>
              {bookings.length > 0 && (
                <span className="hidden sm:inline ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-800/80 text-cyan-300">
                  {bookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <FileEdit className="w-4 h-4 shrink-0 text-purple-400" />
              <span className="hidden sm:inline">Site Content (CMS)</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <DollarSign className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="hidden sm:inline">Pricing Plans</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Film className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="hidden sm:inline">Video Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'emails'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0 text-cyan-400" />
              <span className="hidden sm:inline">Email Dispatch Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="hidden sm:inline">SMTP & Studio Settings</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#07090E]">
          {/* ====================================================
              TAB 1: ORDERS & INGEST MANAGER (WITH SAFE DELETE & STATUS NOTIFY)
              ==================================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Client Orders & Video Ingest Queue
                  </h1>
                  <p className="text-xs text-slate-400">
                    Live orders from website. Updating status dispatches automated progress emails from info@clippasia.com.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Total Bookings: <strong className="text-white">{bookings.length}</strong>
                  </span>
                </div>
              </div>

              {/* Status metric badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0D101A] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-slate-400">New Ingest Requests</div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">
                    {bookings.filter((b) => b.status === 'received').length}
                  </div>
                </div>
                <div className="bg-[#0D101A] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Under Review</div>
                  <div className="text-2xl font-bold text-amber-400 font-mono">
                    {bookings.filter((b) => b.status === 'in_review').length}
                  </div>
                </div>
                <div className="bg-[#0D101A] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Color / Revisions</div>
                  <div className="text-2xl font-bold text-blue-400 font-mono">
                    {bookings.filter((b) => b.status === 'color_grading' || b.status === 'revisions' || (b.status as any) === 'editing').length}
                  </div>
                </div>
                <div className="bg-[#0D101A] border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Completed & Delivered</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    {bookings.filter((b) => b.status === 'completed' || (b.status as any) === 'delivered').length}
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0D101A] border border-slate-800 p-3 rounded-xl">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ticket ID, client name, email, or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['all', 'received', 'in_review', 'assigned', 'color_grading', 'revisions', 'completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-medium capitalize shrink-0 transition-colors cursor-pointer ${
                        statusFilter === st
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : 'text-slate-400 hover:text-white bg-slate-900/60'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings List */}
              {isLoadingBookings ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Connecting to Firestore database...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-16 text-center bg-[#0D101A] border border-slate-800 rounded-xl space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-semibold text-slate-300">No Orders in this view</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No bookings match your search query.'
                      : 'When orders are placed, they will appear here with live client details and raw footage links.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.ticketId}
                      className="bg-[#0D101A] border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-md space-y-4"
                    >
                      {/* Top Bar: Ticket, Mode, Date, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                            #{b.ticketId}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                              b.type === 'test_edit'
                                ? 'bg-purple-950/70 text-purple-300 border border-purple-800/50'
                                : 'bg-blue-950/70 text-blue-300 border border-blue-800/50'
                            }`}
                          >
                            {b.type === 'test_edit' ? '1-Min Free Test' : 'Package Order'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(b.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Interactive Status Trigger Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openStatusModal(b)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95 ${
                              b.status === 'received'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
                                : b.status === 'in_review'
                                ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                                : b.status === 'color_grading'
                                ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                                : b.status === 'completed'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                                : 'bg-blue-950/80 text-blue-300 border-blue-800/80'
                            }`}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Status: {b.status.replace('_', ' ')}</span>
                            <span className="text-[10px] text-cyan-400 underline ml-1">Update & Notify</span>
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Client details */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-mono text-slate-500 uppercase">Client Info</div>
                          <div className="font-semibold text-white text-sm">{b.fullName}</div>
                          <div className="text-slate-300 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-cyan-400" />
                            <a href={`mailto:${b.email}`} className="hover:underline text-cyan-300">
                              {b.email}
                            </a>
                          </div>
                          {b.phoneOrWhatsApp && (
                            <div className="text-slate-300 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <a
                                href={`https://wa.me/${b.phoneOrWhatsApp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline text-emerald-400"
                              >
                                {b.phoneOrWhatsApp}
                              </a>
                            </div>
                          )}
                          <div className="text-slate-400">
                            Brand: <strong className="text-slate-200">{b.channelOrBrand}</strong>
                          </div>
                        </div>

                        {/* Package & Footage Link */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-mono text-slate-500 uppercase">Service & Footage</div>
                          <div className="text-slate-200">
                            Tier: <strong className="text-white">{b.serviceTier || 'Custom Service'}</strong>
                          </div>
                          <div className="text-slate-300">
                            Video Format: <span className="text-slate-100">{b.videoType || 'All Formats'}</span>
                          </div>
                          {b.footageLink ? (
                            <div className="pt-1">
                              <a
                                href={b.footageLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 font-mono text-[11px] transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Access Raw Footage</span>
                              </a>
                            </div>
                          ) : (
                            <div className="text-[11px] text-amber-400 font-mono">
                              No footage link provided yet
                            </div>
                          )}
                        </div>

                        {/* Order Management Actions (FIXED DELETE INLINE) */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-mono text-slate-500 uppercase">Management & Actions</div>
                          <div className="text-[11px] text-slate-400">
                            Client notification recipient: <span className="text-cyan-300">{b.email}</span>
                          </div>

                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => openStatusModal(b)}
                              className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Send className="w-3 h-3 text-cyan-400" />
                              <span>Update Progress</span>
                            </button>

                            {/* Safe Delete button opening internal modal */}
                            <button
                              onClick={() => setTicketToDelete({ ticketId: b.ticketId, clientName: b.fullName })}
                              className="px-2.5 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900/90 text-rose-300 border border-rose-800/50 text-[11px] flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                              title="Delete this order from database"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Order</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Client Brief if provided */}
                      {b.projectNotes && (
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs">
                          <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                            Client Project Brief & Directives:
                          </div>
                          <p className="text-slate-300 whitespace-pre-wrap">{b.projectNotes}</p>
                        </div>
                      )}

                      {/* Internal Editor Notes */}
                      {b.editorNotes && (
                        <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-2.5 text-xs text-cyan-300 flex items-center gap-2 font-mono">
                          <span className="text-[10px] uppercase font-bold text-cyan-400">Latest Studio Note:</span>
                          <span>{b.editorNotes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              TAB 2: SITE CONTENT CMS (EDIT ALL 5 SECTIONS)
              ==================================================== */}
          {activeTab === 'cms' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Site Sections Content CMS
                  </h1>
                  <p className="text-xs text-slate-400">
                    Live editable content for all landing page sections. Changes save to Firestore and update the website instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-cyan-400">
                    {isCmsSaving ? 'Saving to database...' : 'Synced with Website'}
                  </span>
                </div>
              </div>

              {/* CMS Section Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setCmsTab('challenges')}
                  className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
                    cmsTab === 'challenges'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Stop Losing Viewers
                </button>
                <button
                  onClick={() => setCmsTab('beforeAfter')}
                  className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
                    cmsTab === 'beforeAfter'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Side-by-Side Fidelity
                </button>
                <button
                  onClick={() => setCmsTab('roi')}
                  className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
                    cmsTab === 'roi'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revenue Recovery ROI
                </button>
                <button
                  onClick={() => setCmsTab('process')}
                  className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
                    cmsTab === 'process'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Frictionless Production
                </button>
                <button
                  onClick={() => setCmsTab('faq')}
                  className={`py-2 px-3 rounded-lg transition-colors cursor-pointer text-center ${
                    cmsTab === 'faq'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  FAQs
                </button>
              </div>

              {/* SUB-SECTION 1: STOP LOSING VIEWERS (CHALLENGES) */}
              {cmsTab === 'challenges' && (
                <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Section: &quot;Stop Losing Viewers&quot; (Customer Challenges)</span>
                    </h2>
                    <button
                      onClick={async () => {
                        await updateSection('challenges', cmsChallenges);
                        showToast('&quot;Stop Losing Viewers&quot; content updated successfully!');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Section Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Pre-title Tag</label>
                      <input
                        type="text"
                        value={cmsChallenges.preTitle}
                        onChange={(e) => setCmsChallenges({ ...cmsChallenges, preTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={cmsChallenges.title}
                        onChange={(e) => setCmsChallenges({ ...cmsChallenges, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Section Subtitle</label>
                    <textarea
                      rows={2}
                      value={cmsChallenges.subtitle}
                      onChange={(e) => setCmsChallenges({ ...cmsChallenges, subtitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  {/* Individual Problem Cards */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="font-bold text-white text-sm">4 Core Challenges & Solutions</h3>
                    {cmsChallenges.items.map((prob, idx) => (
                      <div key={prob.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-cyan-400 font-bold">Challenge 0{idx + 1}</span>
                          <span className="font-mono text-slate-500 text-[10px]">ID: {prob.id}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Problem Title</label>
                            <input
                              type="text"
                              value={prob.title}
                              onChange={(e) => {
                                const updated = [...cmsChallenges.items];
                                updated[idx].title = e.target.value;
                                setCmsChallenges({ ...cmsChallenges, items: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Pain Stat Badge</label>
                            <input
                              type="text"
                              value={prob.painStat}
                              onChange={(e) => {
                                const updated = [...cmsChallenges.items];
                                updated[idx].painStat = e.target.value;
                                setCmsChallenges({ ...cmsChallenges, items: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-rose-300 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-mono block">Pain Explanation</label>
                          <textarea
                            rows={2}
                            value={prob.painExplanation}
                            onChange={(e) => {
                              const updated = [...cmsChallenges.items];
                              updated[idx].painExplanation = e.target.value;
                              setCmsChallenges({ ...cmsChallenges, items: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Clippasia Solution Title</label>
                            <input
                              type="text"
                              value={prob.solutionTitle}
                              onChange={(e) => {
                                const updated = [...cmsChallenges.items];
                                updated[idx].solutionTitle = e.target.value;
                                setCmsChallenges({ ...cmsChallenges, items: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-cyan-300 font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Outcome Metric</label>
                            <input
                              type="text"
                              value={prob.solutionMetric}
                              onChange={(e) => {
                                const updated = [...cmsChallenges.items];
                                updated[idx].solutionMetric = e.target.value;
                                setCmsChallenges({ ...cmsChallenges, items: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-emerald-400 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-SECTION 2: SIDE-BY-SIDE FIDELITY (BEFORE/AFTER) */}
              {cmsTab === 'beforeAfter' && (
                <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>Section: &quot;Side-by-Side Fidelity&quot; (Interactive Split-Screen Player)</span>
                    </h2>
                    <button
                      onClick={async () => {
                        await updateSection('beforeAfter', cmsBeforeAfter);
                        showToast('&quot;Side-by-Side Fidelity&quot; settings saved successfully!');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Section Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Pre-title Tag</label>
                      <input
                        type="text"
                        value={cmsBeforeAfter.preTitle}
                        onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, preTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={cmsBeforeAfter.title}
                        onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Subtitle Description</label>
                    <textarea
                      rows={2}
                      value={cmsBeforeAfter.subtitle}
                      onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, subtitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Direct MP4 Video Stream URL (Dual Synchronized Player)
                    </label>
                    <input
                      type="url"
                      value={cmsBeforeAfter.videoUrl}
                      onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, videoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-cyan-300 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Must be a direct .mp4 link for HTML5 canvas/video playback.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">Overlay Hook Pill</label>
                      <input
                        type="text"
                        value={cmsBeforeAfter.hookPill}
                        onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, hookPill: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">Overlay Hook Title</label>
                      <input
                        type="text"
                        value={cmsBeforeAfter.hookTitle}
                        onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, hookTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">Overlay Subtitle</label>
                      <input
                        type="text"
                        value={cmsBeforeAfter.hookSubtitle}
                        onChange={(e) => setCmsBeforeAfter({ ...cmsBeforeAfter, hookSubtitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-cyan-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 3: REVENUE RECOVERY ROI ENGINE */}
              {cmsTab === 'roi' && (
                <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Section: &quot;Interactive Video Churn & Revenue Recovery Engine&quot;</span>
                    </h2>
                    <button
                      onClick={async () => {
                        await updateSection('roi', cmsRoi);
                        showToast('&quot;Revenue Recovery ROI&quot; settings saved successfully!');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Section Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Pre-title Tag</label>
                      <input
                        type="text"
                        value={cmsRoi.preTitle}
                        onChange={(e) => setCmsRoi({ ...cmsRoi, preTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={cmsRoi.title}
                        onChange={(e) => setCmsRoi({ ...cmsRoi, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Subtitle Description</label>
                    <textarea
                      rows={2}
                      value={cmsRoi.subtitle}
                      onChange={(e) => setCmsRoi({ ...cmsRoi, subtitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Clippasia Churn Retention Recovery Multiplier (%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={90}
                      value={cmsRoi.recoveryPercentage}
                      onChange={(e) => setCmsRoi({ ...cmsRoi, recoveryPercentage: parseInt(e.target.value, 10) || 40 })}
                      className="w-36 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Default: 40% of viewers bouncing in first 3-5s are recovered by Clippasia pattern interrupts.
                    </span>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 4: FRICTIONLESS PRODUCTION (PROCESS STEPS) */}
              {cmsTab === 'process' && (
                <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Section: &quot;Frictionless Production&quot; (4-Step Production Pipeline)</span>
                    </h2>
                    <button
                      onClick={async () => {
                        await updateSection('process', cmsProcess);
                        showToast('&quot;Frictionless Production&quot; steps saved successfully!');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Section Changes</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Pre-title Tag</label>
                      <input
                        type="text"
                        value={cmsProcess.preTitle}
                        onChange={(e) => setCmsProcess({ ...cmsProcess, preTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={cmsProcess.title}
                        onChange={(e) => setCmsProcess({ ...cmsProcess, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Section Subtitle</label>
                    <textarea
                      rows={2}
                      value={cmsProcess.subtitle}
                      onChange={(e) => setCmsProcess({ ...cmsProcess, subtitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="font-bold text-white text-sm">4 Production Steps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cmsProcess.steps.map((st, idx) => (
                        <div key={st.num} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-cyan-400 font-black text-sm">Step {st.num}</span>
                            <input
                              type="text"
                              value={st.highlight}
                              placeholder="Highlight badge"
                              onChange={(e) => {
                                const updated = [...cmsProcess.steps];
                                updated[idx].highlight = e.target.value;
                                setCmsProcess({ ...cmsProcess, steps: updated });
                              }}
                              className="w-36 text-right bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-emerald-400 font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Step Title</label>
                            <input
                              type="text"
                              value={st.title}
                              onChange={(e) => {
                                const updated = [...cmsProcess.steps];
                                updated[idx].title = e.target.value;
                                setCmsProcess({ ...cmsProcess, steps: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Step Subtitle</label>
                            <input
                              type="text"
                              value={st.subtitle}
                              onChange={(e) => {
                                const updated = [...cmsProcess.steps];
                                updated[idx].subtitle = e.target.value;
                                setCmsProcess({ ...cmsProcess, steps: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-cyan-300"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-500 font-mono block">Description</label>
                            <textarea
                              rows={2}
                              value={st.desc}
                              onChange={(e) => {
                                const updated = [...cmsProcess.steps];
                                updated[idx].desc = e.target.value;
                                setCmsProcess({ ...cmsProcess, steps: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQ) */}
              {cmsTab === 'faq' && (
                <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>Section: &quot;Frequently Asked Questions&quot; (FAQ Editor)</span>
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = [
                            ...cmsFaq.items,
                            { question: 'New Question?', answer: 'Detailed response explaining your studio policies.' }
                          ];
                          setCmsFaq({ ...cmsFaq, items: updated });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add Question</span>
                      </button>

                      <button
                        onClick={async () => {
                          await updateSection('faq', cmsFaq);
                          showToast('FAQ questions and answers saved successfully!');
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save FAQs</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Pre-title Tag</label>
                      <input
                        type="text"
                        value={cmsFaq.preTitle}
                        onChange={(e) => setCmsFaq({ ...cmsFaq, preTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={cmsFaq.title}
                        onChange={(e) => setCmsFaq({ ...cmsFaq, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Section Subtitle</label>
                    <textarea
                      rows={2}
                      value={cmsFaq.subtitle}
                      onChange={(e) => setCmsFaq({ ...cmsFaq, subtitle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h3 className="font-bold text-white text-sm">FAQ Items ({cmsFaq.items.length})</h3>
                    {cmsFaq.items.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-cyan-400 font-bold">Q{idx + 1}</span>
                          <button
                            onClick={() => {
                              const updated = cmsFaq.items.filter((_, i) => i !== idx);
                              setCmsFaq({ ...cmsFaq, items: updated });
                            }}
                            className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-mono block">Question</label>
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              const updated = [...cmsFaq.items];
                              updated[idx].question = e.target.value;
                              setCmsFaq({ ...cmsFaq, items: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-mono block">Answer</label>
                          <textarea
                            rows={3}
                            value={item.answer}
                            onChange={(e) => {
                              const updated = [...cmsFaq.items];
                              updated[idx].answer = e.target.value;
                              setCmsFaq({ ...cmsFaq, items: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              TAB 3: PRICING PLANS
              ==================================================== */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Pricing Tiers & Retainer Packages
                  </h1>
                  <p className="text-xs text-slate-400">
                    Edit tier rates, deliverables, and turnaround guarantees.
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('clippasia_custom_pricing', JSON.stringify(pricingTiers));
                    showToast('Pricing plans saved successfully!');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pricing</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingTiers.map((tier, idx) => (
                  <div key={tier.id} className="bg-[#0D101A] border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-500 block">Tier Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => {
                          const updated = [...pricingTiers];
                          updated[idx].name = e.target.value;
                          setPricingTiers(updated);
                        }}
                        className="w-full font-bold text-white text-sm bg-slate-900 border border-slate-800 rounded px-2 py-1 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-500 block">Monthly Price ($)</label>
                      <input
                        type="number"
                        value={tier.monthlyPrice ?? 0}
                        onChange={(e) => {
                          const updated = [...pricingTiers];
                          updated[idx].monthlyPrice = parseInt(e.target.value, 10) || 0;
                          setPricingTiers(updated);
                        }}
                        className="w-full font-bold text-cyan-400 text-lg bg-slate-900 border border-slate-800 rounded px-2 py-1 mt-1 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-500 block">Turnaround SLA</label>
                      <input
                        type="text"
                        value={tier.turnaround}
                        onChange={(e) => {
                          const updated = [...pricingTiers];
                          updated[idx].turnaround = e.target.value;
                          setPricingTiers(updated);
                        }}
                        className="w-full text-slate-300 font-mono bg-slate-900 border border-slate-800 rounded px-2 py-1 mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-500 block">Ideal For / Client Profile</label>
                      <input
                        type="text"
                        value={tier.idealFor}
                        onChange={(e) => {
                          const updated = [...pricingTiers];
                          updated[idx].idealFor = e.target.value;
                          setPricingTiers(updated);
                        }}
                        className="w-full text-slate-300 bg-slate-900 border border-slate-800 rounded px-2 py-1 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 4: VIDEO PORTFOLIO
              ==================================================== */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Video Portfolio Items
                  </h1>
                  <p className="text-xs text-slate-400">
                    Add or update client showcase cards, verified ROAS outcomes, and MP4 video preview links.
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('clippasia_custom_portfolio', JSON.stringify(portfolio));
                    showToast('Portfolio changes saved!');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Portfolio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.map((item, idx) => (
                  <div key={item.id} className="bg-[#0D101A] border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...portfolio];
                        updated[idx].title = e.target.value;
                        setPortfolio(updated);
                      }}
                      className="w-full font-bold text-white bg-slate-900 border border-slate-800 rounded px-2 py-1"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.client}
                        placeholder="Client name"
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[idx].client = e.target.value;
                          setPortfolio(updated);
                        }}
                        className="flex-1 text-slate-300 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px]"
                      />
                      <input
                        type="text"
                        value={item.metrics.value}
                        placeholder="+184%"
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[idx].metrics.value = e.target.value;
                          setPortfolio(updated);
                        }}
                        className="w-24 text-emerald-400 font-mono font-bold bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-mono block">Video MP4 URL</label>
                      <input
                        type="text"
                        value={item.videoUrl || ''}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[idx].videoUrl = e.target.value;
                          setPortfolio(updated);
                        }}
                        className="w-full text-slate-400 font-mono text-[10px] bg-slate-900 border border-slate-800 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB 5: DISPATCHED EMAIL LOGS
              ==================================================== */}
          {activeTab === 'emails' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Email Dispatch Audit Logs
                </h1>
                <p className="text-xs text-slate-400">
                  Every booking and progress update triggers simultaneous confirmation to the client and alert to admin ({settings.adminEmail}).
                </p>
              </div>

              {emails.length === 0 ? (
                <div className="py-16 text-center bg-[#0D101A] border border-slate-800 rounded-xl space-y-3">
                  <Mail className="w-10 h-10 text-slate-600 mx-auto" />
                  <h3 className="text-base font-semibold text-slate-300">No Dispatched Emails Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    New orders and status updates automatically log here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emails.map((em) => (
                    <div
                      key={em.id}
                      className="bg-[#0D101A] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              em.recipientType === 'admin'
                                ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                                : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50'
                            }`}
                          >
                            {em.recipientType === 'admin' ? 'Admin Alert' : 'User Progress'}
                          </span>
                          <span className="font-mono text-slate-300">{em.recipientEmail}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(em.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="font-semibold text-white text-sm">{em.subject}</div>
                      </div>

                      <button
                        onClick={() => setSelectedEmail(em)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Inspect HTML</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              TAB 6: SMTP & STUDIO CONFIGURATION
              ==================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    SMTP Mail Server & Studio Settings
                  </h1>
                  <p className="text-xs text-slate-400">
                    Configure official contact points, master admin credentials, and SMTP email delivery.
                  </p>
                </div>
                <button
                  onClick={handleSaveSmtpSettings}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>

              {/* SMTP Email Server Card */}
              <div className="bg-[#0D101A] border border-cyan-500/30 rounded-2xl p-6 space-y-4 text-xs shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h2 className="font-bold text-white text-sm">SMTP Dispatch Server (info@clippasia.com)</h2>
                      <p className="text-[11px] text-slate-400">
                        Sends live emails to clients and asiaclipp@gmail.com
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    Port {settings.smtpPort || 465} SSL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={settings.smtpHost || 'mail.clippasia.com'}
                      onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      SMTP Port (465 SSL / 587 TLS)
                    </label>
                    <input
                      type="number"
                      value={settings.smtpPort || 465}
                      onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value, 10) || 465 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      SMTP User (Sender Email)
                    </label>
                    <input
                      type="text"
                      value={settings.smtpUser || 'info@clippasia.com'}
                      onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      SMTP Password for info@clippasia.com
                    </label>
                    <input
                      type="password"
                      placeholder="Enter mailbox password"
                      value={smtpPasswordInput}
                      onChange={(e) => setSmtpPasswordInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Admin Alert Recipient
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail || 'asiaclipp@gmail.com'}
                      onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-cyan-300 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Display From Name
                    </label>
                    <input
                      type="text"
                      value={settings.brandName || 'Clipp Asia Studio'}
                      onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* SMTP Test Button & Output */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Verify live connection to mail server and deliver test message to asiaclipp@gmail.com
                  </div>

                  <button
                    onClick={handleSendTestEmail}
                    disabled={testEmailLoading}
                    className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0"
                  >
                    <Send className={`w-3.5 h-3.5 ${testEmailLoading ? 'animate-spin' : ''}`} />
                    <span>{testEmailLoading ? 'Connecting...' : 'Send Live Test Email'}</span>
                  </button>
                </div>

                {testEmailResult && (
                  <div
                    className={`p-3 rounded-lg text-xs font-mono ${
                      testEmailResult.success
                        ? 'bg-emerald-950/80 border border-emerald-800/50 text-emerald-300'
                        : 'bg-rose-950/80 border border-rose-800/50 text-rose-300'
                    }`}
                  >
                    <div>{testEmailResult.message}</div>
                  </div>
                )}
              </div>

              {/* Master Admin Credentials Card */}
              <div className="bg-[#0D101A] border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <h2 className="font-bold text-white text-sm">Admin Master Credentials</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Admin Username / ID
                    </label>
                    <input
                      type="text"
                      value={settings.adminUsername || 'admin@clippasia.com'}
                      onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                      Admin Password
                    </label>
                    <input
                      type="text"
                      value={settings.adminPassword || 'clippasia2025'}
                      onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono">
                  * Changing these credentials updates the login screen requirements immediately.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====================================================
          MODAL 1: SAFE DELETE ORDER (NO WINDOW.CONFIRM)
          ==================================================== */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C101A] border border-rose-900/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-950 border border-rose-800/80 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Order?</h3>
                <p className="text-xs text-rose-300 font-mono">Ticket #{ticketToDelete.ticketId}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete the order for <strong className="text-white">{ticketToDelete.clientName}</strong>?
              This will remove the booking permanently from Firestore and your active production queue.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setTicketToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete (Permanent)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 2: STATUS CHANGE & CLIENT EMAIL PROGRESS DISPATCH
          ==================================================== */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C101A] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Update Work Progress & Notify Client</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Ticket #{statusModalBooking.ticketId} · {statusModalBooking.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStatusModalBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Select Production Stage
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white font-semibold cursor-pointer focus:outline-none focus:border-cyan-500"
                >
                  <option value="received">1. New Ingest Received</option>
                  <option value="in_review">2. Footage & Storyboard Review</option>
                  <option value="assigned">3. Assigned to Senior Editor Pod</option>
                  <option value="color_grading">4. DaVinci Resolve Color & Sound Polish</option>
                  <option value="revisions">5. Client Revisions & Refinements</option>
                  <option value="completed">6. Deliverables Ready / Completed Cut</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Studio Progress Message (Included in Email to Client)
                </label>
                <textarea
                  rows={3}
                  value={statusCustomNote}
                  onChange={(e) => setStatusCustomNote(e.target.value)}
                  placeholder="e.g. Rough cut assembly complete. Currently color grading in DaVinci Resolve Studio. First review draft ready in 4 hours."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                  Video Review / Deliverables Link (Optional)
                </label>
                <input
                  type="url"
                  value={statusPreviewUrl}
                  onChange={(e) => setStatusPreviewUrl(e.target.value)}
                  placeholder="https://frame.io/... or https://dropbox.com/... or Google Drive URL"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Email Notification Checkbox */}
              <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl space-y-1">
                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-white">
                  <input
                    type="checkbox"
                    checked={sendClientEmailNotification}
                    onChange={(e) => setSendClientEmailNotification(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-cyan-500 bg-slate-900"
                  />
                  <span>Dispatch live email notification to client ({statusModalBooking.email})</span>
                </label>
                <p className="text-[10px] text-cyan-300/80 ml-6 font-mono">
                  Sent from official sender: info@clippasia.com
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStatusModalBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleApplyStatusChange}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isUpdatingStatus ? 'Applying & Notifying...' : 'Apply Status & Send Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL 3: EMAIL BODY INSPECTOR
          ==================================================== */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C0F18] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white text-sm">Dispatched Email Preview</span>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-400">
                To: <strong className="text-white font-mono">{selectedEmail.recipientEmail}</strong>
              </div>
              <div className="text-slate-400">
                Subject: <strong className="text-white">{selectedEmail.subject}</strong>
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Timestamp: {new Date(selectedEmail.timestamp).toLocaleString()}
              </div>
            </div>

            <div
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed max-h-80 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
            />

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
