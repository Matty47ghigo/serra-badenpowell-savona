const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SUPERADMIN_EMAIL = 'mattiaghig60@gmail.com';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Opzionale se l'utente accede esclusivamente con Google OAuth
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['standard', 'volunteer', 'admin', 'superadmin'],
      default: 'standard',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending',
    },
    // Verifica email (OTP / link)
    verified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
      default: null,
    },
    verificationOtpExpires: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Assegna automaticamente superadmin e stato attivo all'Owner mattiaghig60@gmail.com
userSchema.pre('save', async function () {
  if (this.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
    this.role = 'superadmin';
    this.status = 'active';
  }

  // Hash password solo se modificata o nuova
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Metodo per verificare la password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Genera un OTP a 6 cifre con scadenza (10 minuti)
userSchema.methods.generateVerificationOtp = function () {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  this.verificationOtp = otp;
  this.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minuti
  return otp;
};

// Verifica l'OTP fornito (case-insensitive per email già normalizzata)
userSchema.methods.verifyOtp = function (otp) {
  if (!this.verificationOtp || !this.verificationOtpExpires) return false;
  if (new Date() > this.verificationOtpExpires) return false;
  return String(otp).trim() === String(this.verificationOtp);
};

// Escludi hash password e OTP dai json ritornati
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationOtp;
  delete obj.verificationOtpExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
