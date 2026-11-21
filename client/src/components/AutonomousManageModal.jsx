import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, ArrowRight, RefreshCw, X } from 'lucide-react';

export default function AutonomousManageModal() {
  const [token, setToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Form reschedule state
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('14:00 - 15:00');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Prossimi giovedì per riprogrammazione
  const getUpcomingThursdays = () => {
    const thursdays = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() !== 4) {
      d.setDate(d.getDate() + 1);
    }
    for (let i = 0; i < 6; i++) {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + i * 7);
      thursdays.push(copy.toISOString().split('T')[0]);
    }
    return thursdays;
  };
  const thursdays = getUpcomingThursdays();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
      setIsOpen(true);
      fetchBooking(urlToken);
    }
  }, []);

  const fetchBooking = async (manageToken) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/manage/${manageToken}`);
      const data = await res.json();
      if (res.ok && data.booking) {
        setBooking(data.booking);
        // default a giovedì successivo a quello attuale
        const nextThu = thursdays.find(t => t !== data.booking.date) || thursdays[0];
        setNewDate(nextThu);
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Prenotazione non trovata.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Impossibile caricare i dati della prenotazione.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    setRescheduleLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/manage/${token}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDate, newTimeSlot })
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
        setActionMessage({ type: 'success', text: 'Data della visita aggiornata con successo! Ti abbiamo inviato una nuova email di conferma.' });
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Errore modifica data.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Errore di connessione durante la modifica.' });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Sei sicuro di voler disdire definitivamente la tua visita guidata?')) return;
    setCancelLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/manage/${token}/cancel`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
        setActionMessage({ type: 'success', text: 'Visita disdetta con successo. Ti ringraziamo per aver liberato il posto per altri visitatori.' });
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Errore disdetta.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Errore di connessione durante la cancellazione.' });
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">Gestione Prenotazione</h3>
              <p className="text-xs text-stone-400">Serra dei Giardini Baden-Powell</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {loading ? (
            <div className="text-center py-12 text-stone-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs">Caricamento prenotazione...</p>
            </div>
          ) : !booking ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              Link non valido o scaduto.
            </div>
          ) : (
            <>
              {/* Feedback Alert */}
              {actionMessage && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                    actionMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {actionMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <span>{actionMessage.text}</span>
                </div>
              )}

              {/* Booking Info Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-mono font-bold text-emerald-800 text-sm">{booking.code}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    booking.status === 'confermata' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'validata' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="text-stone-700">
                  Intestatario: <strong>{booking.name}</strong> ({booking.visitorsCount} visitatori)
                </div>
                <div className="text-stone-700">
                  Data Attuale: <strong>{booking.date} (Giovedì)</strong> • Orario: <strong>{booking.timeSlot}</strong>
                </div>
              </div>

              {booking.status === 'disdetta_utente' || booking.status === 'disdetta_staff' ? (
                <div className="text-center py-4 text-xs text-stone-500">
                  Questa visita risulta già annullata.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {/* Opzione 1: Cambia Giorno */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      1. Desideri cambiare giorno?
                    </h4>
                    <p className="text-xs text-stone-500">
                      Scegli un altro giovedì disponibile (fascia 14:00 - 17:00):
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="text-xs p-2 rounded-xl border border-stone-300 bg-white"
                      >
                        {thursdays.map((thu) => (
                          <option key={thu} value={thu}>{thu} (Giovedì)</option>
                        ))}
                      </select>

                      <select
                        value={newTimeSlot}
                        onChange={(e) => setNewTimeSlot(e.target.value)}
                        className="text-xs p-2 rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="14:00 - 15:00">14:00 - 15:00</option>
                        <option value="15:00 - 16:00">15:00 - 16:00</option>
                        <option value="16:00 - 17:00">16:00 - 17:00</option>
                      </select>
                    </div>

                    <button
                      onClick={handleReschedule}
                      disabled={rescheduleLoading}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      {rescheduleLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                      <span>Conferma Nuovo Giovedì</span>
                    </button>
                  </div>

                  {/* Opzione 2: Disdici Definitivamente */}
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                    <h4 className="font-serif font-bold text-sm text-rose-950">
                      2. Non puoi più partecipare?
                    </h4>
                    <p className="text-xs text-stone-600">
                      Disdicendo la prenotazione libererai il posto per altri appassionati di botanica.
                    </p>
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelLoading}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      {cancelLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      <span>Disdici Definitivamente la Visita</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
