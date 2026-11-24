require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDbStatus } = require('./config/db');

// Route modules
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const autonomousRoutes = require('./routes/autonomousRoutes');
const cronRoutes = require('./routes/cronRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Connessione a MongoDB
connectDB();

// Middleware globali
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// API Health Check & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Serra Baden-Powell Savona API (MongoDB & RBAC)',
    db: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Registrazione Rotte API
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/manage', autonomousRoutes);
app.use('/api/cron', cronRoutes);

// 404 per API non trovate
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint API non trovato.' });
});

// Avvio server solo se eseguito direttamente (non come serverless function Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌿 Server Serra Baden-Powell Savona attivo sulla porta ${PORT}`);
    console.log(`📡 URL API: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  });
}

module.exports = app;
