const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

const SUPERADMIN_EMAIL = 'mattiaghig60@gmail.com';

// GET /api/admin/users (Solo Super-Admin Owner o Admin per lettura)
router.get('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Errore recupero utenti.' });
  }
});

// PATCH /api/admin/users/:id/role (Solo Super-Admin può assegnare/revocare ruoli)
router.patch('/:id/role', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }

    // Impedisci di degradare l'Owner
    if (user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      return res.status(400).json({ error: 'Non è possibile modificare il ruolo dell\'Owner Super-Admin.' });
    }

    if (role && ['standard', 'volunteer', 'admin'].includes(role)) {
      user.role = role;
    }

    if (status && ['pending', 'active', 'suspended'].includes(status)) {
      user.status = status;
    }

    // Se viene promosso ad admin o volunteer, attiva automaticamente lo stato
    if (user.role !== 'standard' && user.status === 'pending') {
      user.status = 'active';
    }

    user.approvedBy = req.user.email;
    user.approvedAt = new Date();
    await user.save();

    res.json({
      message: `Ruolo utente aggiornato a: ${user.role}`,
      user,
    });
  } catch (error) {
    console.error('Errore assegnazione ruolo:', error);
    res.status(500).json({ error: 'Errore aggiornamento ruolo.' });
  }
});

module.exports = router;
