const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/authMiddleware');
const { sendVerificationEmail } = require('../services/emailService');

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

    // Genera OTP e scadenza per utenti standard
    const otp = !isOwner ? String(Math.floor(100000 + Math.random() * 900000)) : null;
    const otpExpires = !isOwner ? new Date(Date.now() + 10 * 60 * 1000) : null;

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: isOwner ? 'superadmin' : 'standard',
      status: isOwner ? 'active' : 'pending',
      verified: isOwner, // L'owner Google/Superadmin è già verificato
      verificationOtp: otp,
      verificationOtpExpires: otpExpires,
    });

    // Se non è l'owner, invia email di verifica con codice OTP e link
    if (!isOwner && otp) {
      const hostUrl = `${req.protocol}://${req.get('host')}`;
      sendVerificationEmail(user, otp, hostUrl).catch((err) =>
        console.error('Errore invio email verifica:', err.message)
      );
    }

    // Se l'owner (superadmin), emetti subito il token
    if (isOwner) {
      const token = generateToken(user._id);
      return res.status(201).json({
        message: 'Account Super-Admin inizializzato con successo!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          verified: user.verified,
        },
      });
    }

    // Utente standard: NESSUN token finché non verifica l'email
    res.status(201).json({
      requiresVerification: true,
      message: 'Registrazione effettuata. Ti abbiamo inviato un codice OTP via email per verificare il tuo account.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ error: 'Errore durante la registrazione.' });
  }
});

// POST /api/auth/verify-email  (OTP da form)
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email e codice OTP sono obbligatori.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }

    if (user.verified) {
      return res.json({ message: 'Email già verificata. Puoi effettuare il login.' });
    }

    if (!user.verifyOtp(String(otp).trim())) {
      return res.status(400).json({ error: 'Codice OTP non valido o scaduto. Richiedine uno nuovo.' });
    }

    user.verified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    if (user.status === 'pending') user.status = 'active';
    await user.save();

    res.json({ message: 'Email verificata con successo! Ora puoi effettuare il login.' });
  } catch (error) {
    console.error('Errore verifica email:', error);
    res.status(500).json({ error: 'Errore durante la verifica email.' });
  }
});

// GET /api/auth/verify-email?email=...&otp=...  (link cliccabile)
router.get('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.query;

    if (!email || !otp) {
      return res.status(400).send('Link di verifica non valido.');
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).send('Utente non trovato.');
    }

    if (user.verified) {
      return res.send(`
        <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
          <h2>Email già verificata ✅</h2>
          <p>Puoi chiudere questa pagina ed effettuare il login.</p>
        </body></html>
      `);
    }

    if (!user.verifyOtp(String(otp).trim())) {
      return res.status(400).send('Codice di verifica non valido o scaduto.');
    }

    user.verified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    if (user.status === 'pending') user.status = 'active';
    await user.save();

    res.send(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h2>Email verificata con successo! ✅</h2>
        <p>Ora puoi chiudere questa pagina ed effettuare il login.</p>
      </body></html>
    `);
  } catch (error) {
    console.error('Errore verifica email (link):', error);
    res.status(500).send('Errore durante la verifica email.');
  }
});

// POST /api/auth/resend-otp  (reinvia codice)
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email obbligatoria.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato.' });
    }

    if (user.verified) {
      return res.json({ message: 'Email già verificata.' });
    }

    const otp = user.generateVerificationOtp();
    await user.save();

    const hostUrl = `${req.protocol}://${req.get('host')}`;
    sendVerificationEmail(user, otp, hostUrl).catch((err) =>
      console.error('Errore background reinvio OTP:', err)
    );

    res.json({ message: 'Nuovo codice OTP inviato via email.' });
  } catch (error) {
    console.error('Errore reinvio OTP:', error);
    res.status(500).json({ error: 'Errore durante il reinvio del codice.' });
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

    // Blocca l'accesso finché l'email non è verificata (escluso l'Owner)
    if (!user.verified && cleanEmail !== SUPERADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: 'Email non ancora verificata. Inserisci il codice OTP inviato alla tua email per completare l\'accesso.',
        requiresVerification: true,
        email: user.email,
      });
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
        verified: user.verified,
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
