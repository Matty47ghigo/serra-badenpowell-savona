require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Connessione a MongoDB
connectDB();

// Middleware globali
app.use(cors());
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

// Servire frontend React statico se presente (Produzione / Vercel / Docker)
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint API non trovato.' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Avvio server solo se eseguito direttamente (non come serverless function Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌿 Server Serra Baden-Powell Savona attivo sulla porta ${PORT}`);
    console.log(`📡 URL API: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
