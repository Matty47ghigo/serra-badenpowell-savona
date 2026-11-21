const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendReminderEmail } = require('../services/emailService');

// GET /api/cron/reminders (Invocato da Vercel Cron Jobs o scheduler giornaliero)
router.get('/reminders', async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;
    const querySecret = req.query.secret;

    // Se CRON_SECRET è impostato in produzione, verifica l'header di autorizzazione
    if (cronSecret) {
      const isAuthorized =
        (authHeader && authHeader === `Bearer ${cronSecret}`) ||
        (querySecret && querySecret === cronSecret);

      if (!isAuthorized) {
        return res.status(401).json({ error: 'Accesso Cron non autorizzato.' });
      }
    }

    // Calcola la data a 48 ore da oggi (YYYY-MM-DD)
    const targetDateObj = new Date();
    targetDateObj.setDate(targetDateObj.getDate() + 2);
    const targetDate = targetDateObj.toISOString().split('T')[0];

    console.log(`⏰ [CRON JOB] Ricerca prenotazioni per promemoria 48h (Data target: ${targetDate})...`);

    // Trova le prenotazioni confermate per quella data che non hanno ancora ricevuto il promemoria
    const bookingsToRemind = await Booking.find({
      date: targetDate,
      status: 'confermata',
      reminderSentAt: null,
    });

    console.log(`📌 Trovate ${bookingsToRemind.length} prenotazioni da notificare.`);

    const hostUrl = req.protocol + '://' + req.get('host');
    const results = [];

    for (const booking of bookingsToRemind) {
      try {
        await sendReminderEmail(booking, hostUrl);
        booking.reminderSentAt = new Date();
        await booking.save();
        results.push({ code: booking.code, email: booking.email, status: 'sent' });
      } catch (err) {
        console.error(`Errore invio promemoria a ${booking.email}:`, err);
        results.push({ code: booking.code, email: booking.email, status: 'failed', error: err.message });
      }
    }

    res.json({
      success: true,
      targetDate,
      remindersProcessed: bookingsToRemind.length,
      results,
    });
  } catch (error) {
    console.error('Errore cron reminders:', error);
    res.status(500).json({ error: 'Errore interno durante esecuzione cron reminders.' });
  }
});

module.exports = router;
