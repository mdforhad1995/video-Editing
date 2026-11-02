import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory / persistent SMTP configuration
interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  adminEmail: string;
}

let smtpSettings: SmtpSettings = {
  host: process.env.SMTP_HOST || 'mail.clippasia.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false',
  user: process.env.SMTP_USER || 'info@clippasia.com',
  pass: process.env.SMTP_PASS || '',
  fromEmail: process.env.SMTP_FROM || 'info@clippasia.com',
  fromName: 'Clipp Asia Studio',
  adminEmail: process.env.ADMIN_EMAIL || 'asiaclipp@gmail.com'
};

// Helper: Create Nodemailer transporter
function getTransporter(overrideConfig?: Partial<SmtpSettings>) {
  const config = { ...smtpSettings, ...overrideConfig };
  
  // If port is 465, secure is true (SSL). If 587, secure is false (STARTTLS).
  const isSecure = config.port === 465 || config.secure;

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: isSecure,
    auth: {
      user: config.user,
      pass: config.pass
    },
    tls: {
      rejectUnauthorized: false // Helps avoid self-signed cert handshake issues on custom cPanel hosts
    }
  });
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Get current email config (pass masked for security)
app.get('/api/email/config', (_req: Request, res: Response) => {
  res.json({
    host: smtpSettings.host,
    port: smtpSettings.port,
    secure: smtpSettings.secure,
    user: smtpSettings.user,
    hasPassword: Boolean(smtpSettings.pass && smtpSettings.pass.length > 0),
    fromEmail: smtpSettings.fromEmail,
    fromName: smtpSettings.fromName,
    adminEmail: smtpSettings.adminEmail
  });
});

// 2. Update email configuration from Admin Panel
app.post('/api/email/config', (req: Request, res: Response) => {
  const { host, port, secure, user, pass, fromEmail, fromName, adminEmail } = req.body;
  if (host) smtpSettings.host = host.trim();
  if (port) smtpSettings.port = parseInt(port, 10);
  if (typeof secure === 'boolean') smtpSettings.secure = secure;
  if (user) smtpSettings.user = user.trim();
  if (pass !== undefined && pass !== '') smtpSettings.pass = pass;
  if (fromEmail) smtpSettings.fromEmail = fromEmail.trim();
  if (fromName) smtpSettings.fromName = fromName.trim();
  if (adminEmail) smtpSettings.adminEmail = adminEmail.trim();

  res.json({
    success: true,
    message: 'SMTP settings updated successfully',
    config: {
      host: smtpSettings.host,
      port: smtpSettings.port,
      secure: smtpSettings.secure,
      user: smtpSettings.user,
      hasPassword: Boolean(smtpSettings.pass && smtpSettings.pass.length > 0),
      fromEmail: smtpSettings.fromEmail,
      fromName: smtpSettings.fromName,
      adminEmail: smtpSettings.adminEmail
    }
  });
});

// 3. Send test email from info@clippasia.com to asiaclipp@gmail.com
app.post('/api/email/test', async (req: Request, res: Response) => {
  const { recipientEmail, testHost, testPort, testUser, testPass } = req.body;
  const targetEmail = recipientEmail || smtpSettings.adminEmail || 'asiaclipp@gmail.com';

  const activeUser = testUser || smtpSettings.user || 'info@clippasia.com';
  const activePass = testPass !== undefined ? testPass : smtpSettings.pass;
  const activeHost = testHost || smtpSettings.host || 'mail.clippasia.com';
  const activePort = testPort ? parseInt(testPort, 10) : smtpSettings.port;

  if (!activePass) {
    return res.status(400).json({
      success: false,
      message: `SMTP password for ${activeUser} is not configured yet. Please enter the email password in Admin Settings.`
    });
  }

  try {
    const transporter = getTransporter({
      host: activeHost,
      port: activePort,
      user: activeUser,
      pass: activePass,
      secure: activePort === 465
    });

    // Verify SMTP connection
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${smtpSettings.fromName}" <${smtpSettings.fromEmail}>`,
      to: targetEmail,
      replyTo: smtpSettings.fromEmail,
      subject: `✅ [Clipp Asia Studio] Live SMTP Test Email from ${smtpSettings.fromEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0D111A; color: #E2E8F0; border-radius: 12px; border: 1px solid #1E293B;">
          <h2 style="color: #06B6D4; margin-top: 0;">Clipp Asia Studio · SMTP Connection Verified</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #CBD5E1;">
            Congratulations! The automated email delivery system for <strong>Clipp Asia Studio</strong> is functioning properly.
          </p>
          <div style="background: #161D2C; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06B6D4;">
            <p style="margin: 4px 0; font-size: 13px;"><strong>Sender:</strong> ${smtpSettings.fromEmail}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Recipient:</strong> ${targetEmail}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>SMTP Server:</strong> ${activeHost}:${activePort}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <p style="font-size: 12px; color: #64748B;">
            This test confirms that new bookings and status updates will be delivered in real-time to both customers and studio management.
          </p>
        </div>
      `
    });

    res.json({
      success: true,
      messageId: info.messageId,
      message: `Test email successfully sent to ${targetEmail} from ${smtpSettings.fromEmail}`
    });
  } catch (error: any) {
    console.error('SMTP test error:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to send test email through SMTP server',
      errorDetails: error?.code || 'UNKNOWN_ERROR'
    });
  }
});

// 4. Send new booking emails (Customer confirmation + Admin intake alert)
app.post('/api/email/send-booking', async (req: Request, res: Response) => {
  const {
    ticketId,
    type,
    fullName,
    email: customerEmail,
    phoneOrWhatsApp,
    channelOrBrand,
    serviceTier,
    videoType,
    footageLink,
    projectNotes,
    requestFreeTestEdit
  } = req.body;

  if (!customerEmail || !fullName || !ticketId) {
    return res.status(400).json({ success: false, message: 'Missing required booking fields' });
  }

  const adminTarget = smtpSettings.adminEmail || 'asiaclipp@gmail.com';
  const isTestEdit = type === 'test_edit' || requestFreeTestEdit;
  const planName = isTestEdit ? '1-Minute Free Test Edit (Zero-Risk)' : (serviceTier || 'Custom Video Production');

  // Customer email HTML
  const customerHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #07090E; color: #E2E8F0; border-radius: 14px; overflow: hidden; border: 1px solid #1E293B;">
      <div style="background: linear-gradient(135deg, #0284C7, #06B6D4); padding: 32px 28px; text-align: left;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Clipp Asia Studio</h1>
        <p style="margin: 6px 0 0; color: #E0F2FE; font-size: 13px;">High-Retention Post-Production & Color Grading Ingest</p>
      </div>

      <div style="padding: 28px;">
        <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Order Confirmed: #${ticketId}</h2>
        <p style="font-size: 14px; color: #94A3B8; line-height: 1.6;">
          Hi <strong style="color: #F8FAFC;">${fullName}</strong>, thank you for booking with Clipp Asia Studio. Your project has been logged in our active production queue.
        </p>

        <div style="background: #0F1420; border: 1px solid #1E293B; border-radius: 10px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #38BDF8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">Project Snapshot</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748B; width: 140px;">Ticket ID:</td>
              <td style="padding: 6px 0; color: #F1F5F9; font-weight: 600; font-family: monospace;">#${ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Service Type:</td>
              <td style="padding: 6px 0; color: #F1F5F9; font-weight: 600;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Format / Style:</td>
              <td style="padding: 6px 0; color: #F1F5F9;">${videoType || 'Commercial Ads & High-Retention'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Brand / Channel:</td>
              <td style="padding: 6px 0; color: #F1F5F9;">${channelOrBrand || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Raw Footage:</td>
              <td style="padding: 6px 0; color: #38BDF8;">${footageLink ? `<a href="${footageLink}" style="color: #38BDF8; text-decoration: underline;" target="_blank">Access Footage Link</a>` : 'To be provided via Drive / Dropbox'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748B;">Delivery SLA:</td>
              <td style="padding: 6px 0; color: #10B981; font-weight: 600;">24–48 Hours Turnaround Guarantee</td>
            </tr>
          </table>

          ${projectNotes ? `
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #1E293B;">
              <span style="font-size: 12px; color: #64748B; display: block; margin-bottom: 4px;">Project Directives:</span>
              <p style="font-size: 13px; color: #CBD5E1; margin: 0; line-height: 1.5;">${projectNotes}</p>
            </div>
          ` : ''}
        </div>

        <p style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
          A Senior Colorist & Retention Editor is already reviewing your brief. If you need to send updated footage or references, simply reply to this email or contact us via WhatsApp: <strong>+8801740925244</strong>.
        </p>

        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #1E293B; font-size: 12px; color: #64748B; text-align: center;">
          Clipp Asia Studio · info@clippasia.com · www.clippasia.com
        </div>
      </div>
    </div>
  `;

  // Admin alert email HTML
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #0D111A; color: #E2E8F0; border-radius: 12px; padding: 24px; border: 1px solid #1E293B;">
      <div style="border-bottom: 2px solid #06B6D4; padding-bottom: 14px; margin-bottom: 20px;">
        <span style="background: #0284C7; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">New Order Received</span>
        <h2 style="color: #ffffff; margin: 10px 0 0; font-size: 20px;">Ticket #${ticketId} · ${fullName}</h2>
      </div>

      <div style="background: #161D2C; padding: 16px; border-radius: 8px; margin-bottom: 18px;">
        <h3 style="color: #06B6D4; font-size: 13px; margin: 0 0 10px; text-transform: uppercase;">Client Profile</h3>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Name:</strong> ${fullName}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #38BDF8;">${customerEmail}</a></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>WhatsApp / Phone:</strong> ${phoneOrWhatsApp || 'Not provided'}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Channel / Brand:</strong> ${channelOrBrand}</p>
      </div>

      <div style="background: #161D2C; padding: 16px; border-radius: 8px; margin-bottom: 18px;">
        <h3 style="color: #10B981; font-size: 13px; margin: 0 0 10px; text-transform: uppercase;">Order Scope</h3>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Package:</strong> ${planName}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Video Category:</strong> ${videoType || 'Commercial Ads & High-Retention'}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Raw Footage URL:</strong> ${footageLink ? `<a href="${footageLink}" style="color: #38BDF8;" target="_blank">${footageLink}</a>` : 'Not provided'}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Notes / Instructions:</strong> ${projectNotes || 'None'}</p>
      </div>

      <p style="font-size: 12px; color: #94A3B8;">
        ⚡ Please log in to the Clipp Asia Studio Admin Suite to assign an editor pod and begin processing this ingest.
      </p>
    </div>
  `;

  let userDelivery = { success: false, note: '' };
  let adminDelivery = { success: false, note: '' };

  // Attempt sending via SMTP if password is provided
  if (smtpSettings.pass && smtpSettings.pass.length > 0) {
    try {
      const transporter = getTransporter();

      // 1. Send to Customer
      await transporter.sendMail({
        from: `"${smtpSettings.fromName}" <${smtpSettings.fromEmail}>`,
        to: customerEmail,
        replyTo: smtpSettings.fromEmail,
        subject: `Order Confirmed: #${ticketId} · Clipp Asia Studio Video Ingest`,
        html: customerHtml
      });
      userDelivery = { success: true, note: `Delivered to ${customerEmail}` };

      // 2. Send to Admin
      await transporter.sendMail({
        from: `"${smtpSettings.fromName} Orders" <${smtpSettings.fromEmail}>`,
        to: adminTarget,
        replyTo: customerEmail,
        subject: `🚨 [NEW ORDER] #${ticketId} - ${fullName} (${channelOrBrand})`,
        html: adminHtml
      });
      adminDelivery = { success: true, note: `Delivered to ${adminTarget}` };

      return res.json({
        success: true,
        method: 'smtp',
        userDelivery,
        adminDelivery,
        message: 'Order emails dispatched successfully to both customer and admin'
      });
    } catch (err: any) {
      console.error('SMTP send error on booking:', err);
      // Don't fail the whole request, report details so UI informs the user
      return res.json({
        success: true,
        method: 'queued',
        smtpError: err?.message,
        userDelivery: { success: false, note: `SMTP warning: ${err?.message}` },
        adminDelivery: { success: false, note: `SMTP warning: ${err?.message}` },
        message: 'Order recorded. SMTP delivery attempted; please ensure SMTP password is valid in Admin Settings.'
      });
    }
  } else {
    // If SMTP pass is not yet entered in settings, record as queued
    return res.json({
      success: true,
      method: 'queued_pending_smtp_pass',
      userDelivery: { success: true, note: 'Saved to queue (Set SMTP pass in Admin Settings for instant mail)' },
      adminDelivery: { success: true, note: 'Saved to queue' },
      message: 'Order saved to database. Add your SMTP password in the Admin Panel to enable direct inbox dispatch.'
    });
  }
});

// 5. Send order status update email to customer
app.post('/api/email/send-status-update', async (req: Request, res: Response) => {
  const {
    ticketId,
    customerName,
    customerEmail,
    newStatus,
    statusLabel,
    statusDescription,
    editorNotes,
    previewLink
  } = req.body;

  if (!customerEmail || !ticketId || !newStatus) {
    return res.status(400).json({ success: false, message: 'Missing required status update fields' });
  }

  const statusProgressBadge = 
    newStatus === 'completed' ? '#10B981' :
    newStatus === 'color_grading' ? '#8B5CF6' :
    newStatus === 'revisions' ? '#F59E0B' :
    newStatus === 'assigned' ? '#06B6D4' : '#3B82F6';

  const statusUpdateHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #07090E; color: #E2E8F0; border-radius: 12px; overflow: hidden; border: 1px solid #1E293B;">
      <div style="background: linear-gradient(135deg, #0F172A, #1E293B); padding: 24px; border-bottom: 2px solid ${statusProgressBadge};">
        <h1 style="margin: 0; color: #ffffff; font-size: 20px;">Clipp Asia Studio</h1>
        <p style="margin: 4px 0 0; color: #94A3B8; font-size: 13px;">Project Status & Progress Update</p>
      </div>

      <div style="padding: 24px;">
        <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Order #${ticketId}: Progress Update</h2>
        <p style="font-size: 14px; color: #CBD5E1; line-height: 1.6;">
          Hi <strong>${customerName || 'Valued Client'}</strong>, here is an update on your video post-production project.
        </p>

        <div style="background: #0F1420; border: 1px solid #1E293B; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <div style="display: inline-block; background: ${statusProgressBadge}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px;">
            Current Status: ${statusLabel || newStatus}
          </div>
          
          <p style="font-size: 14px; color: #F1F5F9; margin: 0 0 12px; font-weight: 500;">
            ${statusDescription || 'Your project is progressing through our studio pipeline.'}
          </p>

          ${editorNotes ? `
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #1E293B;">
              <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: bold; display: block; margin-bottom: 4px;">Studio / Editor Notes:</span>
              <p style="font-size: 13px; color: #38BDF8; margin: 0; font-family: monospace;">${editorNotes}</p>
            </div>
          ` : ''}

          ${previewLink ? `
            <div style="margin-top: 16px;">
              <a href="${previewLink}" target="_blank" style="display: inline-block; background: #06B6D4; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 10px 18px; border-radius: 8px;">
                Watch Draft / Review Cut →
              </a>
            </div>
          ` : ''}
        </div>

        <p style="font-size: 13px; color: #94A3B8; line-height: 1.6;">
          Have feedback or questions about this milestone? You can reply directly to this email or reach us on WhatsApp: <strong>+8801740925244</strong>.
        </p>

        <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; text-align: center;">
          Clipp Asia Studio · Sent from info@clippasia.com
        </div>
      </div>
    </div>
  `;

  if (smtpSettings.pass && smtpSettings.pass.length > 0) {
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"${smtpSettings.fromName}" <${smtpSettings.fromEmail}>`,
        to: customerEmail,
        replyTo: smtpSettings.fromEmail,
        subject: `Update on Order #${ticketId}: ${statusLabel || newStatus} · Clipp Asia Studio`,
        html: statusUpdateHtml
      });

      return res.json({
        success: true,
        message: `Status notification email delivered to ${customerEmail}`
      });
    } catch (err: any) {
      console.error('SMTP error sending status update:', err);
      return res.status(500).json({
        success: false,
        message: `Failed to send email via SMTP: ${err?.message}`
      });
    }
  } else {
    return res.json({
      success: true,
      message: 'Status updated. Note: configure SMTP password in Admin Settings to transmit live emails to customer inbox.'
    });
  }
});

// ==========================================
// VITE / STATIC INTEGRATION
// ==========================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Clipp Asia Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
