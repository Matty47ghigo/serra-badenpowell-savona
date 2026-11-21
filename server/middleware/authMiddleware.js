const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'serra_baden_powell_secret_jwt_key_2026';
const SUPERADMIN_EMAIL = 'mattiaghig60@gmail.com';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Accesso non autorizzato. Token mancante.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Utente non trovato.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account sospeso. Contatta un amministratore.' });
    }

    // Assicura che l'Owner abbia sempre superadmin
    if (user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      user.role = 'superadmin';
      user.status = 'active';
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token non valido o scaduto.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non autenticato.' });
    }

    // Il SuperAdmin ha sempre accesso a tutte le rotte
    if (req.user.role === 'superadmin' || req.user.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Accesso negato. Il tuo ruolo (${req.user.role}) non dispone delle autorizzazioni necessarie.`
      });
    }

    next();
  };
};

module.exports = { protect, authorize, JWT_SECRET };
