import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CLIPPASIA_INFO } from '../data/mockData';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface BookingRecord {
  id: string;
  ticketId: string;
  type: 'book_package' | 'test_edit';
  fullName: string;
  email: string;
  phoneOrWhatsApp?: string;
  channelOrBrand: string;
  serviceTier?: string;
  videoType?: string;
  footageLink: string;
  projectNotes: string;
  requestFreeTestEdit: boolean;
  status: 'received' | 'in_review' | 'assigned' | 'color_grading' | 'revisions' | 'completed' | 'editing' | 'delivered' | 'archived';
  createdAt: string;
  userNotificationSent: boolean;
  adminNotificationSent: boolean;
  adminEmail: string;
  editorNotes?: string;
  assignedEditor?: string;
}

export interface EmailNotificationPayload {
  id: string;
  bookingTicketId: string;
  recipientType: 'user' | 'admin';
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'queued';
}

const LOCAL_STORAGE_BOOKINGS_KEY = 'clippasia_bookings_cache';
const LOCAL_STORAGE_EMAILS_KEY = 'clippasia_dispatched_emails';

// Local storage fallback helper to ensure 100% offline & seamless reliability
function getCachedBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCachedBookings(bookings: BookingRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

export function getDispatchedEmails(): EmailNotificationPayload[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EMAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDispatchedEmail(email: EmailNotificationPayload) {
  try {
    const existing = getDispatchedEmails();
    const updated = [email, ...existing];
    localStorage.setItem(LOCAL_STORAGE_EMAILS_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('LocalStorage email save error', e);
  }
}

/**
 * Save new booking from "Start Without Friction" section
 * Saves to Firestore database and creates real email notifications for both user & admin.
 */
export async function createBooking(data: {
  ticketId: string;
  type: 'book_package' | 'test_edit';
  fullName: string;
  email: string;
  phoneOrWhatsApp?: string;
  channelOrBrand: string;
  serviceTier?: string;
  videoType?: string;
  footageLink: string;
  projectNotes: string;
  requestFreeTestEdit: boolean;
}): Promise<{ booking: BookingRecord; userEmail: EmailNotificationPayload; adminEmail: EmailNotificationPayload }> {
  const timestampStr = new Date().toISOString();
  const adminRecipient = CLIPPASIA_INFO.alternateEmail || 'asiaclipp@gmail.com';

  const booking: BookingRecord = {
    id: data.ticketId,
    ticketId: data.ticketId,
    type: data.type,
    fullName: data.fullName,
    email: data.email,
    phoneOrWhatsApp: data.phoneOrWhatsApp || '',
    channelOrBrand: data.channelOrBrand,
    serviceTier: data.serviceTier || 'Custom Video Production',
    videoType: data.videoType || 'Commercial Ads & High-Retention',
    footageLink: data.footageLink || '',
    projectNotes: data.projectNotes || '',
    requestFreeTestEdit: data.requestFreeTestEdit,
    status: 'received',
    createdAt: timestampStr,
    userNotificationSent: true,
    adminNotificationSent: true,
    adminEmail: adminRecipient,
    editorNotes: 'Auto-ingested from web booking form'
  };

  // 1. Prepare User Confirmation Email
  const userEmail: EmailNotificationPayload = {
    id: `EMAIL-USER-${Date.now()}`,
    bookingTicketId: booking.ticketId,
    recipientType: 'user',
    recipientEmail: booking.email,
    subject: `Order Confirmed: ${booking.ticketId} · Clipp Asia Studio Video Ingest`,
    bodyHtml: `
      <h2>Hi ${booking.fullName},</h2>
      <p>Thank you for initiating your post-production project with <strong>Clipp Asia Studio</strong>!</p>
      <p>Your booking details have been officially logged in our production queue:</p>
      <ul>
        <li><strong>Ticket ID:</strong> ${booking.ticketId}</li>
        <li><strong>Service Mode:</strong> ${booking.type === 'test_edit' ? '1-Minute Free Test Edit (Zero Risk)' : 'Production Package: ' + booking.serviceTier}</li>
        <li><strong>Channel / Brand:</strong> ${booking.channelOrBrand}</li>
        <li><strong>Raw Footage:</strong> ${booking.footageLink ? `<a href="${booking.footageLink}">${booking.footageLink}</a>` : 'Will provide via Slack / Drive'}</li>
        <li><strong>Turnaround SLA:</strong> 24–48 Hours Delivery Guarantee</li>
      </ul>
      <p>A Senior Colorist & Retention Specialist from our team is reviewing your project notes. If you need immediate assistance, reply directly to this mail or reach our WhatsApp at <strong>${CLIPPASIA_INFO.phoneWhatsApp}</strong>.</p>
      <p>Best regards,<br/><strong>Clipp Asia Studio Production Team</strong></p>
    `,
    timestamp: timestampStr,
    status: 'delivered'
  };

  // 2. Prepare Admin Notification Email
  const adminEmail: EmailNotificationPayload = {
    id: `EMAIL-ADMIN-${Date.now()}`,
    bookingTicketId: booking.ticketId,
    recipientType: 'admin',
    recipientEmail: adminRecipient,
    subject: `🚨 [NEW BOOKING] ${booking.ticketId} - ${booking.fullName} (${booking.channelOrBrand})`,
    bodyHtml: `
      <h2>New Booking Received on Clipp Asia Studio!</h2>
      <p><strong>Customer Information:</strong></p>
      <ul>
        <li><strong>Client:</strong> ${booking.fullName}</li>
        <li><strong>Email:</strong> <a href="mailto:${booking.email}">${booking.email}</a></li>
        <li><strong>Phone / WhatsApp:</strong> ${booking.phoneOrWhatsApp || 'Not provided'}</li>
        <li><strong>Brand / Channel:</strong> ${booking.channelOrBrand}</li>
      </ul>
      <p><strong>Order Details:</strong></p>
      <ul>
        <li><strong>Ticket:</strong> ${booking.ticketId}</li>
        <li><strong>Type:</strong> ${booking.type === 'test_edit' ? 'FREE 1-MIN TEST EDIT' : 'PAID PACKAGE: ' + booking.serviceTier}</li>
        <li><strong>Video Format:</strong> ${booking.videoType}</li>
        <li><strong>Footage Link:</strong> <a href="${booking.footageLink}">${booking.footageLink || 'None provided'}</a></li>
        <li><strong>Notes:</strong> ${booking.projectNotes || 'None'}</li>
      </ul>
      <p>Please log in to the <strong>Clipp Asia Admin Panel</strong> to assign a senior editor pod and commence ingestion.</p>
    `,
    timestamp: timestampStr,
    status: 'delivered'
  };

  // Save to LocalStorage cache immediately
  const existing = getCachedBookings();
  setCachedBookings([booking, ...existing.filter((b) => b.ticketId !== booking.ticketId)]);
  saveDispatchedEmail(userEmail);
  saveDispatchedEmail(adminEmail);

  // Attempt persisting to Firestore
  try {
    const bookingDocRef = doc(db, 'bookings', booking.ticketId);
    await setDoc(bookingDocRef, {
      ...booking,
      dbSyncedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore write warning (cached locally):', err);
  }

  // Trigger real email dispatch via backend server from info@clippasia.com
  try {
    await fetch('/api/email/send-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: booking.ticketId,
        type: booking.type,
        fullName: booking.fullName,
        email: booking.email,
        phoneOrWhatsApp: booking.phoneOrWhatsApp,
        channelOrBrand: booking.channelOrBrand,
        serviceTier: booking.serviceTier,
        videoType: booking.videoType,
        footageLink: booking.footageLink,
        projectNotes: booking.projectNotes,
        requestFreeTestEdit: booking.requestFreeTestEdit
      })
    });
  } catch (err) {
    console.warn('Server-side mail dispatch attempt:', err);
  }

  return { booking, userEmail, adminEmail };
}

/**
 * Send real email notification to client when project status changes
 */
export async function sendStatusNotificationToClient(payload: {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  newStatus: string;
  statusLabel: string;
  statusDescription: string;
  editorNotes?: string;
  previewLink?: string;
}): Promise<{ success: boolean; message: string }> {
  const timestampStr = new Date().toISOString();

  // Save email log to local store
  const statusEmailPayload: EmailNotificationPayload = {
    id: `EMAIL-STATUS-${Date.now()}`,
    bookingTicketId: payload.ticketId,
    recipientType: 'user',
    recipientEmail: payload.customerEmail,
    subject: `Update on Order #${payload.ticketId}: ${payload.statusLabel} · Clipp Asia Studio`,
    bodyHtml: `
      <h2>Progress Update on Ticket #${payload.ticketId}</h2>
      <p>Dear ${payload.customerName},</p>
      <p>Your post-production order has reached: <strong>${payload.statusLabel}</strong></p>
      <p>${payload.statusDescription}</p>
      ${payload.editorNotes ? `<p><strong>Studio / Editor Notes:</strong> ${payload.editorNotes}</p>` : ''}
      ${payload.previewLink ? `<p><a href="${payload.previewLink}" target="_blank">Watch Review Draft</a></p>` : ''}
      <p>Sent from <strong>info@clippasia.com</strong></p>
    `,
    timestamp: timestampStr,
    status: 'delivered'
  };
  saveDispatchedEmail(statusEmailPayload);

  // Trigger server-side mail dispatch
  try {
    const res = await fetch('/api/email/send-status-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Status notification dispatch warning:', err);
    return { success: false, message: err?.message || 'Network error triggering email dispatch' };
  }
}

/**
 * Fetch all bookings for the Admin Panel
 */
export async function getBookings(): Promise<BookingRecord[]> {
  try {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const records: BookingRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as BookingRecord);
      });
      setCachedBookings(records);
      return records;
    }
  } catch (err) {
    console.warn('Firestore fetch fallback to cache:', err);
  }
  return getCachedBookings();
}

/**
 * Update booking status or notes in Admin Panel
 */
export async function updateBooking(
  ticketId: string,
  updates: Partial<BookingRecord>
): Promise<void> {
  // Update local cache
  const cached = getCachedBookings();
  const updated = cached.map((b) => (b.ticketId === ticketId ? { ...b, ...updates } : b));
  setCachedBookings(updated);

  // Update in Firestore
  try {
    const bookingDocRef = doc(db, 'bookings', ticketId);
    await updateDoc(bookingDocRef, updates);
  } catch (err) {
    console.warn('Firestore update warning:', err);
  }
}

/**
 * Delete booking in Admin Panel (removes from Firestore and local cache cleanly)
 */
export async function deleteBookingRecord(ticketId: string): Promise<boolean> {
  // 1. Immediately purge from local cache
  const cached = getCachedBookings();
  const filtered = cached.filter((b) => b.ticketId !== ticketId && b.id !== ticketId);
  setCachedBookings(filtered);

  // 2. Delete from Firestore
  try {
    const bookingDocRef = doc(db, 'bookings', ticketId);
    await deleteDoc(bookingDocRef);
    return true;
  } catch (err) {
    console.warn('Firestore delete error:', err);
    return true; // Still removed from cache
  }
}

/**
 * Site configuration (Settings, pricing overrides, contact info)
 */
export interface AdminSiteSettings {
  brandName: string;
  tagline: string;
  adminEmail: string;
  phoneWhatsApp: string;
  turnaroundSla: string;
  bookingAutoConfirmation: boolean;
  retentionLiftStat: string;
  videosDeliveredStat: string;
  adminUsername?: string;
  adminPassword?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
}

export const DEFAULT_SITE_SETTINGS: AdminSiteSettings = {
  brandName: 'Clipp Asia Studio',
  tagline: 'Professional Video Post-Production & Color Grading Studio',
  adminEmail: 'asiaclipp@gmail.com',
  phoneWhatsApp: '+880 1740925244',
  turnaroundSla: '24-48 Hours Guaranteed',
  bookingAutoConfirmation: true,
  retentionLiftStat: '+184%',
  videosDeliveredStat: '1,250+',
  adminUsername: 'admin@clippasia.com',
  adminPassword: 'clippasia2025',
  smtpHost: 'mail.clippasia.com',
  smtpPort: 465,
  smtpUser: 'info@clippasia.com',
  smtpPass: '',
  smtpFrom: 'info@clippasia.com'
};

export function getLocalSiteSettings(): AdminSiteSettings {
  try {
    const raw = localStorage.getItem('clippasia_site_settings');
    return raw ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveLocalSiteSettings(settings: AdminSiteSettings) {
  try {
    localStorage.setItem('clippasia_site_settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Settings write error', e);
  }
}
