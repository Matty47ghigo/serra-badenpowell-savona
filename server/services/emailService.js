const nodemailer = require('nodemailer');
const {
  getBookingConfirmationTemplate,
  getReminderTemplate,
  getStaffCancellationTemplate,
  getRescheduleConfirmationTemplate,
  getUserCancellationTemplate,
} = require('../templates/emailTemplates');
const { createGoogleCalendarUrl, generateIcsContent } = require('./calendarService');

const SYSTEM_SENDER = process.env.EMAIL_FROM || 'business.matty47ghigo@gmail.com';
const INTERNAL_NOTIFICATION_EMAIL = 'business.matty47ghigo@gmail.com';

// Configura transporter Nodemailer
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Supporto fallback Gmail standard
  if (process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SYSTEM_SENDER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return null;
};

const sendMailSafely = async (options) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n📨 [MOCK EMAIL SERVICE] Email simulata (configura SMTP in .env per l'invio reale):`);
    console.log(`Destinatario: ${options.to}`);
    console.log(`Oggetto: ${options.subject}`);
    console.log(`Mittente: ${options.from || SYSTEM_SENDER}\n`);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Serra Baden-Powell Savona" <${SYSTEM_SENDER}>`,
      ...options,
    });
    console.log(`📧 Email inviata con successo a ${options.to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Errore durante l'invio dell'email a ${options.to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Invia email di conferma prenotazione all'utente + notifica interna
 */
const sendBookingConfirmation = async (booking, hostUrl = '') => {
  const baseUrl = hostUrl || process.env.BASE_URL || 'http://localhost:5000';
  const googleCalUrl = createGoogleCalendarUrl(booking);
  const appleCalUrl = `${baseUrl}/api/bookings/${booking.code}/calendar.ics`;
  const icsFile = generateIcsContent(booking);

  const html = getBookingConfirmationTemplate({
    booking,
    googleCalUrl,
    appleCalUrl,
  });

  // Email al visitatore
  await sendMailSafely({
    to: booking.email,
    subject: `Conferma Prenotazione Visita Guidata: ${booking.code} - Serra Baden-Powell`,
    html,
    attachments: [
      {
        filename: `visita_serra_${booking.code}.ics`,
        content: icsFile,
        contentType: 'text/calendar',
      },
    ],
  });

  // Notifica interna per il team operativo
  await sendMailSafely({
    to: INTERNAL_NOTIFICATION_EMAIL,
    subject: `[NUOVA PRENOTAZIONE] ${booking.date} (${booking.timeSlot}) - ${booking.name} (${booking.visitorsCount}p)`,
    html: `
      <div style="font-family: sans-serif; padding: 16px;">
        <h3>Nuova prenotazione ricevuta!</h3>
        <p><strong>Codice:</strong> ${booking.code}</p>
        <p><strong>Nominativo:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Telefono:</strong> ${booking.phone || 'Non specificato'}</p>
        <p><strong>Data:</strong> ${booking.date} (Giovedì)</p>
        <p><strong>Fascia Oraria:</strong> ${booking.timeSlot}</p>
        <p><strong>Partecipanti:</strong> ${booking.visitorsCount}</p>
        <p><strong>Note:</strong> ${booking.notes || 'Nessuna'}</p>
      </div>
    `,
  });
};

/**
 * Invia email di promemoria 48h prima con link di gestione autonoma
 */
const sendReminderEmail = async (booking, hostUrl = '') => {
  const baseUrl = hostUrl || process.env.BASE_URL || 'http://localhost:5000';
  const manageUrl = `${baseUrl}/gestisci-prenotazione?token=${booking.managementToken}`;

  const html = getReminderTemplate({ booking, manageUrl });

  return sendMailSafely({
    to: booking.email,
    subject: `Promemoria: Ci vediamo questo Giovedì alla Serra Baden-Powell! (${booking.code})`,
    html,
  });
};

/**
 * Invia email di disdetta da parte dello staff con motivazione
 */
const sendStaffCancellationEmail = async (booking, reason, hostUrl = '') => {
  const baseUrl = hostUrl || process.env.BASE_URL || 'http://localhost:5000';
  const rescheduleUrl = `${baseUrl}#booking`;

  const html = getStaffCancellationTemplate({ booking, reason, rescheduleUrl });

  return sendMailSafely({
    to: booking.email,
    subject: `Importante: Aggiornamento sulla tua visita alla Serra Baden-Powell (${booking.code})`,
    html,
  });
};

/**
 * Invia conferma avvenuta modifica data
 */
const sendRescheduleConfirmationEmail = async (booking, hostUrl = '') => {
  const baseUrl = hostUrl || process.env.BASE_URL || 'http://localhost:5000';
  const googleCalUrl = createGoogleCalendarUrl(booking);
  const appleCalUrl = `${baseUrl}/api/bookings/${booking.code}/calendar.ics`;

  const html = getRescheduleConfirmationTemplate({
    booking,
    googleCalUrl,
    appleCalUrl,
  });

  return sendMailSafely({
    to: booking.email,
    subject: `Nuova data confermata: Visita Serra Baden-Powell (${booking.code})`,
    html,
  });
};

/**
 * Invia conferma cancellazione richiesta dall'utente
 */
const sendUserCancellationEmail = async (booking, hostUrl = '') => {
  const baseUrl = hostUrl || process.env.BASE_URL || 'http://localhost:5000';
  const siteUrl = baseUrl;

  const html = getUserCancellationTemplate({ booking, siteUrl });

  // Email all'utente
  await sendMailSafely({
    to: booking.email,
    subject: `Conferma avvenuta disdetta visita (${booking.code})`,
    html,
  });

  // Notifica interna
  await sendMailSafely({
    to: INTERNAL_NOTIFICATION_EMAIL,
    subject: `[DISDETTA UTENTE] Prenotazione ${booking.code} annullata dal visitatore`,
    html: `<p>L'utente <strong>${booking.name}</strong> ha annullato la visita del <strong>${booking.date} (${booking.timeSlot})</strong>.</p>`,
  });
};

module.exports = {
  sendBookingConfirmation,
  sendReminderEmail,
  sendStaffCancellationEmail,
  sendRescheduleConfirmationEmail,
  sendUserCancellationEmail,
};
