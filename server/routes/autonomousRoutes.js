const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendRescheduleConfirmationEmail, sendUserCancellationEmail } = require('../services/emailService');

// Verifica giovedì
const isThursday = (dateString) => {
  const d = new Date(dateString + 'T00:00:00');
  return d.getDay() === 4;
};

// GET /api/manage/:token (Dettagli prenotazione per pagina personale utente)
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const booking = await Booking.findOne({ managementToken: token });

    if (!booking) {
      return res.status(404).json({ error: 'Link di gestione non valido o prenotazione non trovata.' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Errore caricamento prenotazione.' });
  }
});

// PATCH /api/manage/:token/reschedule (Cambio data per altro giovedì)
router.patch('/:token/reschedule', async (req, res) => {
  try {
    const { token } = req.params;
    const { newDate, newTimeSlot } = req.body;

    if (!newDate || !newTimeSlot) {
      return res.status(400).json({ error: 'Nuova data e fascia oraria obbligatorie.' });
    }

    if (!isThursday(newDate)) {
      return res.status(400).json({ error: 'È possibile selezionare esclusivamente un Giovedì.' });
    }

    const booking = await Booking.findOne({ managementToken: token });
    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata.' });
    }

    if (booking.status === 'disdetta_utente' || booking.status === 'disdetta_staff') {
      return res.status(400).json({ error: 'Questa prenotazione è già stata annullata.' });
    }

    // Controlla capienza per il nuovo slot
    const existing = await Booking.find({
      date: newDate,
      timeSlot: newTimeSlot,
      status: { $in: ['confermata', 'validata'] },
    });
    const bookedCount = existing.reduce((sum, b) => sum + (b.visitorsCount || 1), 0);

    if (bookedCount + booking.visitorsCount > 20) {
      return res.status(409).json({ error: 'Posti esauriti per la fascia oraria selezionata.' });
    }

    booking.date = newDate;
    booking.timeSlot = newTimeSlot;
    booking.status = 'confermata';
    await booking.save();

    // Invia email di conferma aggiornamento
    const hostUrl = req.protocol + '://' + req.get('host');
    sendRescheduleConfirmationEmail(booking, hostUrl).catch((err) =>
      console.error('Errore email reschedule:', err)
    );

    res.json({
      message: 'Data aggiornata con successo! Ti abbiamo inviato una nuova email di conferma.',
      booking,
    });
  } catch (error) {
    console.error('Errore riprogrammazione:', error);
    res.status(500).json({ error: 'Errore durante la modifica della data.' });
  }
});

// POST /api/manage/:token/cancel (Disdetta autonoma da parte dell'utente)
router.post('/:token/cancel', async (req, res) => {
  try {
    const { token } = req.params;
    const booking = await Booking.findOne({ managementToken: token });

    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata.' });
    }

    if (booking.status === 'disdetta_utente') {
      return res.status(400).json({ error: 'La prenotazione risulta già disdetta.' });
    }

    booking.status = 'disdetta_utente';
    booking.cancelledAt = new Date();
    await booking.save();

    // Invia email di conferma disdetta
    const hostUrl = req.protocol + '://' + req.get('host');
    sendUserCancellationEmail(booking, hostUrl).catch((err) =>
      console.error('Errore email cancellation:', err)
    );

    res.json({
      message: 'Prenotazione annullata con successo. Grazie per averci avvisato.',
      booking,
    });
  } catch (error) {
    console.error('Errore cancellazione autonoma:', error);
    res.status(500).json({ error: 'Errore durante la disdetta della visita.' });
  }
});

module.exports = router;
