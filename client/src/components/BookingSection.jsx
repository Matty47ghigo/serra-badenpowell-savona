import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, User, Mail, Phone, 
  CheckCircle, AlertCircle, Sparkles, Printer, Download, RefreshCw, Shield, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeBFy8uAAAAAFtH2PMtK2djjKkIoP_16Mt-7yYS';

export default function BookingSection() {
  // Calcola il prossimo giovedì disponibile
  const getNextThursday = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // minimo domani
    while (d.getDay() !== 4) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  };

  // Genera elenco dei prossimi 8 giovedì per selezione rapida e intuitiva
  const getUpcomingThursdays = () => {
    const thursdays = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() !== 4) {
      d.setDate(d.getDate() + 1);
    }
    for (let i = 0; i < 8; i++) {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + i * 7);
      thursdays.push(copy.toISOString().split('T')[0]);
    }
    return thursdays;
  };

  const upcomingThursdays = getUpcomingThursdays();

  const [date, setDate] = useState(upcomingThursdays[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('14:00 - 15:00');
  const [visitorsCount, setVisitorsCount] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Anti-bot CAPTCHA (Google reCAPTCHA v3)
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Carica slot disponibili per il giovedì selezionato
  const fetchSlots = async (selectedDate) => {
    setLoadingSlots(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/slots?date=${selectedDate}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore nel caricamento slot');
      setSlots(data.slots || []);
      
      const firstAvailable = data.slots.find(s => s.isAvailable);
      if (firstAvailable) {
        setSelectedSlot(firstAvailable.label);
      }
    } catch (err) {
      // Fallback slot giovedì 14:00 - 17:00
      const defaultSlots = [
        { id: 'thu-slot-1', label: '14:00 - 15:00', title: 'Visita Guidata - Turno 1', availableSlots: 18, isAvailable: true, maxCapacity: 20 },
        { id: 'thu-slot-2', label: '15:00 - 16:00', title: 'Visita Guidata - Turno 2', availableSlots: 16, isAvailable: true, maxCapacity: 20 },
        { id: 'thu-slot-3', label: '16:00 - 17:00', title: 'Visita Guidata - Turno 3', availableSlots: 20, isAvailable: true, maxCapacity: 20 },
      ];
      setSlots(defaultSlots);
      setSelectedSlot('14:00 - 15:00');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots(date);
  }, [date]);

  // --- Google reCAPTCHA Enterprise: inizializzazione e verifica disponibilità ---
  // Caricamento script reCAPTCHA v3
  useEffect(() => {
    const checkRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
        setRecaptchaReady(true);
        return true;
      }
      return false;
    };

    if (!checkRecaptcha()) {
      const interval = setInterval(() => {
        if (checkRecaptcha()) {
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  // Esecuzione Google reCAPTCHA v3 (invisible, score-based)
  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'BOOKING' });
            resolve(token);
          } catch (err) {
            console.error('Errore chiamata grecaptcha.execute:', err);
            reject(err);
          }
        });
      } else {
        reject(new Error('Google reCAPTCHA non ancora pronto.'));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !date || !selectedSlot) {
      setErrorMsg('Compila tutti i campi obbligatori contrassegnati con asterisco.');
      return;
    }

    setSubmitting(true);
    let token = '';

    try {
      // 1. Richiama grecaptcha.execute per l'azione di prenotazione
      token = await executeRecaptcha();
    } catch (err) {
      console.warn('Avviso esecuzione reCAPTCHA:', err.message);
      token = '';
    }

    if (!token) {
      setErrorMsg('Verifica di sicurezza reCAPTCHA non riuscita. Ricarica la pagina e riprova.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : '',
          date,
          timeSlot: selectedSlot,
          visitorsCount: Number(visitorsCount),
          notes: notes.trim(),
          captchaToken: token,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossibile completare la prenotazione.');
      }

      setConfirmedBooking(data.booking);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err) {
      setErrorMsg(err.message || 'Si è verificato un errore durante la prenotazione.');
    } finally {
      setSubmitting(false);
    }
  };

  // Creazione deep link Google Calendar
  const getGoogleCalendarUrl = () => {
    if (!confirmedBooking) return '#';
    const [startH, startM] = confirmedBooking.timeSlot.split(' - ')[0].split(':');
    const [endH, endM] = confirmedBooking.timeSlot.split(' - ')[1].split(':');
    const dStr = confirmedBooking.date.replace(/-/g, '');
    const title = encodeURIComponent(`Visita Guidata Serra Baden-Powell Savona (${confirmedBooking.code})`);
    const details = encodeURIComponent(`Visita guidata collezione cactacee. Codice: ${confirmedBooking.code}. Partecipanti: ${confirmedBooking.visitorsCount}`);
    const location = encodeURIComponent('Giardini Robert Baden-Powell, Via Pietro Amendola, Savona');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dStr}T${startH}${startM}00/${dStr}T${endH}${endM}00&details=${details}&location=${location}`;
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setVisitorsCount(2);
    setCaptchaVerified(false);
    setRecaptchaToken('');
    setCaptchaLoading(false);
    // Reset del widget reCAPTCHA (se configurato)
    if (isRecaptchaConfigured && recaptchaWidgetId.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      } catch (e) {}
    }
    fetchSlots(date);
  };

  return (
    <section id="booking" className="py-20 sm:py-28 bg-stone-900 text-white relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prenotazioni Ufficiali</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Prenota la Visita Guidata
          </h2>
          <p className="text-stone-300 text-sm sm:text-base">
            Le visite si svolgono <strong>esclusivamente il Giovedì dalle 14:00 alle 17:00</strong> con 
            accompagnatori esperti. Ingresso gratuito con prenotazione obbligatoria per preservare le specie.
          </p>
        </div>

        {/* --- SCHERMATA POST-PRENOTAZIONE (BIGLIETTO DIGITALE CON QR CODE) --- */}
        {confirmedBooking ? (
          <div className="bg-white text-stone-900 rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl border-2 sm:border-4 border-emerald-600 animate-fadeIn max-w-2xl mx-auto print:border-none print:shadow-none print:m-0 print:p-0">
            
            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800">
                Prenotazione Confermata!
              </span>
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mt-1">
                Pass d'Ingresso Digitale
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Mostra questo pass dal tuo smartphone o portalo stampato all'ingresso della serra.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-stone-50 border-2 border-dashed border-stone-300 p-4 sm:p-8 space-y-5 sm:space-y-6 mb-6">
              
              {/* Header Ticket */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Codice Pass</span>
                  <span className="font-mono font-extrabold text-2xl sm:text-3xl text-emerald-900">
                    {confirmedBooking.code}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Tipologia</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Visita Guidata
                  </span>
                </div>
              </div>

              {/* QR Code Prominente */}
              <div className="text-center py-2 bg-white rounded-2xl p-4 border border-stone-200 shadow-inner flex flex-col items-center">
                {confirmedBooking.qrCode ? (
                  <img
                    src={confirmedBooking.qrCode}
                    alt={`QR Code Pass ${confirmedBooking.code}`}
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-44 h-44 bg-stone-100 flex items-center justify-center font-mono font-bold text-stone-700">
                    {confirmedBooking.code}
                  </div>
                )}
                <span className="text-[11px] text-stone-500 font-semibold mt-2">
                  Inquadra per la convalida rapida dei volontari
                </span>
              </div>

              {/* Dati Visita */}
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase">Intestatario</span>
                  <span className="font-bold text-stone-800">{confirmedBooking.name}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase">Partecipanti</span>
                  <span className="font-bold text-stone-800">{confirmedBooking.visitorsCount} visitatori</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase">Giorno</span>
                  <span className="font-bold text-stone-800">{confirmedBooking.date} (Giovedì)</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase">Orario</span>
                  <span className="font-bold text-emerald-800 font-mono text-sm">{confirmedBooking.timeSlot}</span>
                </div>
              </div>

              <div className="text-xs text-stone-600 bg-white p-3.5 rounded-xl border border-stone-200">
                📍 <strong>Luogo d'incontro:</strong> Ingresso Serra, Giardini Robert Baden-Powell, Via Pietro Amendola, Savona (SV).
              </div>
            </div>

            {/* Action buttons (Print, Google Calendar, Apple Calendar) */}
            <div className="space-y-3 print:hidden">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Stampa Prenotazione (PC)</span>
                </button>

                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md text-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Google Calendar</span>
                </a>

                <a
                  href={`/api/bookings/${confirmedBooking.code}/calendar.ics`}
                  download
                  className="flex-1 py-3 rounded-2xl bg-white hover:bg-stone-100 text-emerald-800 border-2 border-emerald-700 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Apple Calendar (.ics)</span>
                </a>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline"
                >
                  Effettua un'altra prenotazione
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* --- FORM DI PRENOTAZIONE (SOLO GIOVEDÌ 14:00 - 17:00) --- */
          <form
            onSubmit={handleSubmit}
            className="bg-stone-800/90 backdrop-blur-xl border border-stone-700 rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl space-y-6 sm:space-y-8"
          >
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. SELEZIONE GIOVEDÌ */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>1. Scegli il Giovedì della Visita *</span>
              </label>

              {/* Quick Thursday Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                {upcomingThursdays.slice(0, 4).map((thu) => {
                  const isSelected = date === thu;
                  const dateObj = new Date(thu + 'T00:00:00');
                  const formatted = dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });

                  return (
                    <button
                      type="button"
                      key={thu}
                      onClick={() => setDate(thu)}
                      className={`p-3 rounded-2xl text-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-500/40'
                          : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-emerald-500/60'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Giovedì</div>
                      <div className="font-serif font-bold text-base text-white">{formatted}</div>
                    </button>
                  );
                })}
              </div>

              {/* Manual Date Input */}
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-2xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Le visite si tengono rigorosamente ogni Giovedì per rispettare i tempi di cura delle cactacee.
              </span>
            </div>

            {/* 2. SELEZIONE FASCIA ORARIA (14:00 - 17:00) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>2. Seleziona Fascia Oraria (14:00 – 17:00) *</span>
                </span>
                {loadingSlots && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Controllo disponibilità...
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.label;
                  return (
                    <button
                      type="button"
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot.label)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                        !slot.isAvailable
                          ? 'opacity-40 bg-stone-900/50 border-stone-800 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-950/90 border-emerald-500 ring-2 ring-emerald-500/50 text-white'
                          : 'bg-stone-900/80 border-stone-700 hover:border-emerald-600/60 text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-base text-white">{slot.label}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            slot.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {slot.isAvailable ? `${slot.availableSlots} liberi` : 'Esaurito'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {slot.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. DATI VISITA & PARTECIPANTI */}
            <div className="border-t border-stone-700/80 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>3. Recapiti del Referente</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Nome e Cognome *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mario Rossi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Email per Ricevuta Pass *</label>
                  <input
                    type="email"
                    required
                    placeholder="esempio@mail.it"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Cellulare per comunicazioni</label>
                  <input
                    type="tel"
                    placeholder="+39 340 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Numero Visitatori (max 20)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={visitorsCount}
                    onChange={(e) => setVisitorsCount(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-stone-400 mb-1">Note speciali / Accessibilità (opzionale)</label>
                  <input
                    type="text"
                    placeholder="es. Ausilio deambulazione, carrozzina, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. PROTEZIONE SICUREZZA ANTI-BOT (Google reCAPTCHA v3) */}
            <div className="border-t border-stone-700/80 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>4. Sicurezza & Protezione Anti-Bot *</span>
              </label>

              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-700/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">Google reCAPTCHA v3</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {recaptchaReady ? 'Protezione Attiva' : 'Caricamento...'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Verifica invisibile automatica. Nessuna azione richiesta.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-mono text-stone-500 block">reCAPTCHA v3 Invisible</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {recaptchaReady ? 'Verifica automatica attiva' : 'Inizializzazione...'}
                  </span>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl hover:shadow-emerald-900/50 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Verifica reCAPTCHA ed emissione Pass in corso...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Conferma Prenotazione Visita Guidata</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-stone-400 mt-2.5">
                Riceverai immediatamente il pass digitale con QR Code via email e a schermo per la stampa.
              </p>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
