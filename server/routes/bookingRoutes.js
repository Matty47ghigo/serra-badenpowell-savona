const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/authMiddleware');
const { sendBookingConfirmation, sendStaffCancellationEmail } = require('../services/emailService');
const { generateIcsContent } = require('../services/calendarService');

// Configurazione slot del Giovedì
const THURSDAY_SLOTS = [
  { id: 'thu-slot-1', label: '14:00 - 15:00', title: 'Visita Guidata - Turno 1', maxCapacity: 20 },
  { id: 'thu-slot-2', label: '15:00 - 16:00', title: 'Visita Guidata - Turno 2', maxCapacity: 20 },
  { id: 'thu-slot-3', label: '16:00 - 17:00', title: 'Visita Guidata - Turno 3', maxCapacity: 20 },
];

// Helper per verificare se una data è un Giovedì (day 4)
const isThursday = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  return d.getDay() === 4;
};

// Verifica CAPTCHA tramite Google reCAPTCHA (siteverify REST con timeout)
const verifyCaptcha = async (token) => {
  // Il token è SEMPRE obbligatorio: nessun token = blocco immediato
  if (!token || typeof token !== 'string' || token.trim().length < 5) {
    console.warn('⚠️ Tentativo di prenotazione senza token CAPTCHA valido (bypass bloccato).');
    return false;
  }

  const cleanToken = token.trim();
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

  // Se in produzione SENZA secret key configurata: rifiuta sempre (no bypass)
  if (!recaptchaSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ RECAPTCHA_SECRET_KEY non configurata in produzione. Prenotazione rifiutata.');
      return false;
    }
    // Sviluppo/locale senza chiave: consenti solo se token presente
    console.warn('⚠️ [DEV] RECAPTCHA_SECRET_KEY non impostata: consentito solo in sviluppo.');
    return true;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', recaptchaSecret);
    params.append('response', cleanToken);

    // Timeout 8s per evitare che la richiesta si blocchi indefinitamente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await resp.json();

    if (data.success !== true) {
      console.warn('❌ reCAPTCHA fallito:', data['error-codes']);
      return false;
    }

    // reCAPTCHA v3: verifica lo score (0.0 - 1.0)
    if (typeof data.score === 'number' && data.score < 0.5) {
      console.warn(`❌ reCAPTCHA v3 score troppo basso: ${data.score}`);
      return false;
    }

    console.log('✅ reCAPTCHA verificato con successo.');
    return true;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('❌ Timeout verifica reCAPTCHA (8s superato).');
    } else {
      console.error('❌ Errore validazione Google reCAPTCHA:', err.message);
    }
    return false;
  }
};

// GET /api/slots?date=YYYY-MM-DD
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Data obbligatoria.' });
    }

    if (!isThursday(date)) {
      return res.status(400).json({
        error: 'Le visite guidate sono disponibili esclusivamente il Giovedì.',
        isThursday: false,
      });
    }

    // Conta prenotazioni attive per quella data
    const activeBookings = await Booking.find({
      date,
      status: { $in: ['confermata', 'validata'] },
    });

    const slots = THURSDAY_SLOTS.map((slot) => {
      const bookedCount = activeBookings
        .filter((b) => b.timeSlot === slot.label)
        .reduce((sum, b) => sum + (b.visitorsCount || 1), 0);

      const available = Math.max(0, slot.maxCapacity - bookedCount);

      return {
        id: slot.id,
        label: slot.label,
        title: slot.title,
        maxCapacity: slot.maxCapacity,
        bookedVisitors: bookedCount,
        availableSlots: available,
        isAvailable: available > 0,
      };
    });

    res.json({
      date,
      isThursday: true,
      slots,
    });
  } catch (error) {
    console.error('Errore recupero slot:', error);
    res.status(500).json({ error: 'Errore durante la verifica disponibilità.' });
  }
});

// POST /api/bookings (Creazione Prenotazione)
router.post('/bookings', async (req, res) => {
  try {
    const { name, email, phone, date, timeSlot, visitorsCount, notes, captchaToken } = req.body;

    // 1. Validazione campi obbligatori
    if (!name || !email || !date || !timeSlot) {
      return res.status(400).json({ error: 'Tutti i campi contrassegnati con asterisco sono obbligatori.' });
    }

    // 2. Controllo giorno: DEVE essere Giovedì
    if (!isThursday(date)) {
      return res.status(400).json({
        error: 'Le visite guidate si svolgono esclusivamente il Giovedì tra le 14:00 e le 17:00.',
      });
    }

    // 3. Controllo fascia oraria
    const validSlot = THURSDAY_SLOTS.find((s) => s.label === timeSlot);
    if (!validSlot) {
      return res.status(400).json({ error: 'Fascia oraria non valida. Scegli tra 14:00, 15:00 o 16:00.' });
    }

    // 4. Controllo CAPTCHA Anti-Bot
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ error: 'Verifica di sicurezza anti-bot non superata. Riprova.' });
    }

    const numVisitors = parseInt(visitorsCount, 10) || 1;
    if (numVisitors < 1 || numVisitors > 20) {
      return res.status(400).json({ error: 'Il numero di visitatori deve essere compreso tra 1 e 20.' });
    }

    // 5. Verifica capienza residua per lo slot
    const existingBookings = await Booking.find({
      date,
      timeSlot,
      status: { $in: ['confermata', 'validata'] },
    });
    const currentTotal = existingBookings.reduce((sum, b) => sum + (b.visitorsCount || 1), 0);

    if (currentTotal + numVisitors > validSlot.maxCapacity) {
      return res.status(409).json({
        error: `Posti insufficienti per questo slot. Rimangono disponibili solo ${Math.max(
          0,
          validSlot.maxCapacity - currentTotal
        )} posti.`,
      });
    }

    // 6. Genera Codice Univoco e QR Code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const cleanDate = date.replace(/-/g, '').slice(2);
    const code = `SBP-${cleanDate}-${randomSuffix}`;

    const qrDataUrl = await QRCode.toDataURL(code, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 250,
      color: {
        dark: '#10221c',
        light: '#ffffff',
      },
    });

    // 7. Salva nel database MongoDB
    const booking = await Booking.create({
      code,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      date,
      timeSlot,
      visitType: 'Visita Guidata Botanica',
      visitorsCount: numVisitors,
      notes: notes ? notes.trim() : '',
      qrCode: qrDataUrl,
      status: 'confermata',
    });

    // 8. Invia email HTML professionale con QR Code e pulsanti Calendar
    const hostUrl = req.protocol + '://' + req.get('host');
    sendBookingConfirmation(booking, hostUrl).catch((err) =>
      console.error('Errore background invio email conferma:', err)
    );

    res.status(201).json({
      message: 'Prenotazione confermata con successo!',
      booking: {
        id: booking._id,
        code: booking.code,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        date: booking.date,
        timeSlot: booking.timeSlot,
        visitType: booking.visitType,
        visitorsCount: booking.visitorsCount,
        notes: booking.notes,
        qrCode: booking.qrCode,
        managementToken: booking.managementToken,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error('Errore creazione prenotazione:', error);
    res.status(500).json({ error: 'Errore interno durante il salvataggio della prenotazione.' });
  }
});

// GET /api/bookings/:code/calendar.ics
router.get('/bookings/:code/calendar.ics', async (req, res) => {
  try {
    const booking = await Booking.findOne({ code: req.params.code });
    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata.' });
    }

    const icsData = generateIcsContent(booking);
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="visita_serra_${booking.code}.ics"`);
    res.send(icsData);
  } catch (error) {
    res.status(500).json({ error: 'Errore generazione file calendario.' });
  }
});

// GET /api/admin/bookings (Lista e statistiche per Dashboard Admin)
router.get('/admin/bookings', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { date, status, search } = req.query;
    let query = {};

    if (date) query.date = date;
    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { code: regex }, { phone: regex }];
    }

    const bookings = await Booking.find(query).sort({ date: -1, createdAt: -1 });

    res.json({
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Errore admin recupero prenotazioni:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle prenotazioni.' });
  }
});

// GET /api/admin/stats (Statistiche interattive)
router.get('/admin/stats', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confermata' });
    const validated = await Booking.countDocuments({ status: 'validata' });
    const cancelledStaff = await Booking.countDocuments({ status: 'disdetta_staff' });
    const cancelledUser = await Booking.countDocuments({ status: 'disdetta_utente' });

    // Calcolo visitatori totali validati / confermati
    const visitorsSum = await Booking.aggregate([
      { $match: { status: { $in: ['confermata', 'validata'] } } },
      { $group: { _id: null, total: { $sum: '$visitorsCount' } } },
    ]);

    // Visite raggruppate per slot
    const bySlot = await Booking.aggregate([
      { $match: { status: { $in: ['confermata', 'validata'] } } },
      { $group: { _id: '$timeSlot', count: { $sum: '$visitorsCount' } } },
    ]);

    res.json({
      total,
      confirmed,
      validated,
      cancelledTotal: cancelledStaff + cancelledUser,
      cancelledStaff,
      cancelledUser,
      totalVisitors: visitorsSum[0] ? visitorsSum[0].total : 0,
      bySlot,
    });
  } catch (error) {
    console.error('Errore stats:', error);
    res.status(500).json({ error: 'Errore calcolo statistiche.' });
  }
});

// PATCH /api/admin/bookings/:id/staff-cancel (Disdetta con motivazione ed email all'utente)
router.patch('/admin/bookings/:id/staff-cancel', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata.' });
    }

    booking.status = 'disdetta_staff';
    booking.cancellationReason = reason || 'Esigenze di manutenzione straordinaria delle specie';
    booking.cancelledAt = new Date();
    await booking.save();

    // Invia email di disdetta cortese all'utente
    const hostUrl = req.protocol + '://' + req.get('host');
    sendStaffCancellationEmail(booking, booking.cancellationReason, hostUrl).catch((err) =>
      console.error('Errore background invio email disdetta staff:', err)
    );

    res.json({
      message: 'Prenotazione annullata dallo staff ed email inviata con successo.',
      booking,
    });
  } catch (error) {
    console.error('Errore staff cancel:', error);
    res.status(500).json({ error: 'Errore durante la disdetta della prenotazione.' });
  }
});

// DELETE /api/admin/bookings/:id (Archiviazione o eliminazione)
router.delete('/admin/bookings/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata.' });
    }
    res.json({ message: 'Prenotazione rimossa dal database.' });
  } catch (error) {
    res.status(500).json({ error: 'Errore cancellazione prenotazione.' });
  }
});

module.exports = router;
