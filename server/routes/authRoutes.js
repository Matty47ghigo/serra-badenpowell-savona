const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/authMiddleware');

const SUPERADMIN_EMAIL = 'mattiaghig60@gmail.com';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e password sono obbligatori.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La password deve contenere almeno 6 caratteri.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(400).json({ error: 'Un account con questa email esiste già.' });
    }

    const isOwner = cleanEmail === SUPERADMIN_EMAIL.toLowerCase();

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: isOwner ? 'superadmin' : 'standard',
      status: isOwner ? 'active' : 'pending',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: isOwner
        ? 'Account Super-Admin inizializzato con successo!'
        : 'Registrazione effettuata con successo.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ error: 'Errore durante la registrazione.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono obbligatorie.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenziali non valide.' });
    }

    // Assicura ruolo superadmin all'Owner
    if (cleanEmail === SUPERADMIN_EMAIL.toLowerCase() && user.role !== 'superadmin') {
      user.role = 'superadmin';
      user.status = 'active';
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Accesso effettuato con successo.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ error: 'Errore durante il login.' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Dati Google mancanti.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    const isOwner = cleanEmail === SUPERADMIN_EMAIL.toLowerCase();

    if (!user) {
      user = await User.create({
        name: name || 'Utente Google',
        email: cleanEmail,
        googleId,
        avatar: avatar || null,
        role: isOwner ? 'superadmin' : 'standard',
        status: isOwner ? 'active' : 'pending',
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }
      if (isOwner) {
        user.role = 'superadmin';
        user.status = 'active';
      }
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Accesso Google completato.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Errore Google auth:', error);
    res.status(500).json({ error: 'Errore durante autenticazione Google.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
