const mongoose = require('mongoose');
const crypto = require('crypto');

const bookingSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    // Token univoco e sicuro per la pagina personale di disdetta / cambio data dell'utente
    managementToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(24).toString('hex'),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String, // Formato YYYY-MM-DD (solo Giovedì)
      required: true,
      index: true,
    },
    timeSlot: {
      type: String, // '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
      required: true,
      enum: ['14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'],
    },
    visitType: {
      type: String,
      default: 'Visita Guidata Botanica',
    },
    visitorsCount: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
      default: 2,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    qrCode: {
      type: String, // Data URL base64 dell'immagine QR
      default: '',
    },
    status: {
      type: String,
      enum: ['confermata', 'validata', 'disdetta_staff', 'disdetta_utente', 'completata'],
      default: 'confermata',
      index: true,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    validatedAt: {
      type: Date,
      default: null,
    },
    validatedBy: {
      type: String,
      default: null,
    },
    reminderSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
