const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET /api/volunteer/bookings (Vista mobile calendario prenotazioni per Volontari e Admin)
router.get('/bookings', protect, authorize('volunteer', 'admin', 'superadmin'), async (req, res) => {
  try {
    const { date } = req.query;
    // Se non specificata, usa la data odierna in formato YYYY-MM-DD
    const targetDate = date || new Date().toISOString().split('T')[0];

    const bookings = await Booking.find({ date: targetDate }).sort({ timeSlot: 1 });

    res.json({
      date: targetDate,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Errore volontari get bookings:', error);
    res.status(500).json({ error: 'Errore recupero prenotazioni giornaliere.' });
  }
});

// POST /api/volunteer/validate (Convalida da Scanner QR Code o Input Manuale)
router.post('/validate', protect, authorize('volunteer', 'admin', 'superadmin'), async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Codice prenotazione obbligatorio.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const booking = await Booking.findOne({ code: cleanCode });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Nessuna prenotazione trovata con il codice "${cleanCode}".`,
      });
    }

    if (booking.status === 'validata') {
      return res.status(400).json({
        success: false,
        alreadyValidated: true,
        message: `Attenzione: La prenotazione ${cleanCode} (${booking.name}) risulta già validata in precedenza.`,
        booking,
      });
    }

    if (['disdetta_staff', 'disdetta_utente'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        isCancelled: true,
        message: `Attenzione: Questa prenotazione è stata annullata (${booking.status}).`,
        booking,
      });
    }

    booking.status = 'validata';
    booking.validatedAt = new Date();
    booking.validatedBy = req.user.name || req.user.email;
    await booking.save();

    res.json({
      success: true,
      message: `Pass validato con successo per ${booking.name}!`,
      booking,
    });
  } catch (error) {
    console.error('Errore validazione pass:', error);
    res.status(500).json({ error: 'Errore durante la convalida del pass.' });
  }
});

module.exports = router;
