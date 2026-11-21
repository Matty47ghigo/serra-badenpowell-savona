import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Shield, User, Lock, Mail, Users, Calendar, Clock, Search, 
  CheckCircle, AlertCircle, Trash2, Camera, CameraOff, RefreshCw, 
  PieChart, BarChart3, LogOut, ChevronRight, Check, XCircle, ArrowRight
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function DashboardModal({ isOpen, onClose }) {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('serra_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Form credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active dashboard tab (admin, volunteer, users)
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings & stats state
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Staff cancellation modal
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Manutenzione straordinaria delle specie cactacee');
  const [cancellingLoading, setCancellingLoading] = useState(false);

  // Users state (SuperAdmin)
  const [usersList, setUsersList] = useState([]);

  // Volunteer scanner state
  const [selectedVolunteerDate, setSelectedVolunteerDate] = useState(new Date().toISOString().split('T')[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMessage, setScannerMessage] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeInstance = useRef(null);

  // Carica utente da token
  const fetchMe = async (jwtToken) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        if (data.user.role === 'volunteer') {
          setActiveTab('volunteer');
        } else if (data.user.role === 'superadmin' || data.user.role === 'admin') {
          setActiveTab('bookings');
        }
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe(token);
    }
  }, [token]);

  // Carica dati admin
  const loadAdminData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      // 1. Stats
      const resStats = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData);
      }

      // 2. Bookings
      let url = '/api/admin/bookings?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const resBookings = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resBookings.ok) {
        const bookingsData = await resBookings.json();
        setBookings(bookingsData.bookings || []);
      }

      // 3. Users se superadmin
      if (currentUser?.role === 'superadmin') {
        const resUsers = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resUsers.ok) {
          const usersData = await resUsers.json();
          setUsersList(usersData.users || []);
        }
      }
    } catch (err) {
      console.error('Errore caricamento dati dashboard:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin')) {
      loadAdminData();
    }
    if (isOpen && currentUser && currentUser.role === 'volunteer') {
      loadVolunteerBookings();
    }
  }, [isOpen, currentUser, statusFilter, search, activeTab]);

  // Carica prenotazioni volontario del giorno
  const loadVolunteerBookings = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const res = await fetch(`/api/volunteer/bookings?date=${selectedVolunteerDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  // Login / Registrazione
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authMode === 'login' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore autenticazione');

      localStorage.setItem('serra_token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleMockLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mattiaghig60@gmail.com', // Default Owner account
          name: 'Mattia Ghigo (Owner)',
          googleId: 'google-oauth-owner-12345',
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore Google login');

      localStorage.setItem('serra_token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('serra_token');
    setToken('');
    setCurrentUser(null);
    setBookings([]);
    setStats(null);
    stopScanner();
  };

  // Modifica Ruolo Utente (SuperAdmin)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Disdetta da parte dello staff con motivazione ed email
  const handleStaffCancel = async () => {
    if (!cancellingBooking) return;
    setCancellingLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${cancellingBooking._id}/staff-cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (res.ok) {
        setCancellingBooking(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingLoading(false);
    }
  };

  // Convalida Pass da Volontario
  const validatePassCode = async (codeToValidate) => {
    setScannerMessage(null);
    try {
      const res = await fetch('/api/volunteer/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: codeToValidate })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScannerMessage({ type: 'success', text: `VALIDATO: ${data.booking.name} (${data.booking.code})` });
        stopScanner();
        loadVolunteerBookings();
      } else {
        setScannerMessage({ type: 'error', text: data.message || data.error || 'Codice non valido.' });
      }
    } catch (err) {
      setScannerMessage({ type: 'error', text: 'Errore di connessione durante la validazione.' });
    }
  };

  // Avvio / Chiusura Scanner Fotocamera
  const startScanner = async () => {
    setIsScanning(true);
    setScannerMessage(null);
    setTimeout(() => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeInstance.current = html5QrCode;
        html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            validatePassCode(decodedText);
          },
          (errorMessage) => {}
        ).catch((err) => {
          console.error("Errore avvio fotocamera:", err);
          setIsScanning(false);
          setScannerMessage({ type: 'error', text: 'Impossibile accedere alla fotocamera. Verifica i permessi del browser.' });
        });
      } catch (e) {
        console.error(e);
      }
    }, 300);
  };

  const stopScanner = () => {
    if (html5QrCodeInstance.current && html5QrCodeInstance.current.isScanning) {
      html5QrCodeInstance.current.stop().then(() => {
        html5QrCodeInstance.current.clear();
      }).catch(err => console.error(err));
    }
    setIsScanning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl">
                Area Riservata & Gestione Serra
              </h3>
              <p className="text-xs text-stone-400">
                Piattaforma Ufficiale Giardini Robert Baden-Powell
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-stone-200 font-semibold">{currentUser.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {currentUser.role}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="ml-2 text-stone-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => { stopScanner(); onClose(); }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- SCHERMATA LOGIN / REGISTRAZIONE SE NON AUTENTICATO --- */}
        {!currentUser ? (
          <div className="p-6 sm:p-12 overflow-y-auto max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-stone-900">
                {authMode === 'login' ? 'Accedi al Sistema' : 'Crea il tuo Account Staff'}
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Accesso riservato a Volontari, Guide Botaniche e Amministratori
              </p>
            </div>

            {authError && (
              <div className="p-3.5 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleMockLogin}
              className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300 flex items-center justify-center gap-2.5 mb-5 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Accedi con Google (mattiaghig60@gmail.com)</span>
            </button>

            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink mx-4 text-[11px] text-stone-400 font-semibold uppercase">oppure con email</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="es. Mario Rossi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="mattiaghig60@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{authMode === 'login' ? 'Accedi' : 'Registrati'}</span>
              </button>
            </form>

            <div className="text-center mt-6 text-xs text-stone-500">
              {authMode === 'login' ? (
                <span>Non hai un account? <button onClick={() => setAuthMode('register')} className="font-bold text-emerald-700 underline">Registrati</button></span>
              ) : (
                <span>Hai già un account? <button onClick={() => setAuthMode('login')} className="font-bold text-emerald-700 underline">Accedi</button></span>
              )}
            </div>
          </div>
        ) : (
          /* --- UTENTE AUTENTICATO --- */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Ruolo 1: UTENTE STANDARD (In attesa di approvazione) */}
            {currentUser.role === 'standard' ? (
              <div className="p-8 sm:p-16 text-center max-w-lg mx-auto my-auto animate-fadeIn">
                <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <Clock className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  Richiesta in Attesa di Approvazione
                </h4>
                <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                  Ciao <strong>{currentUser.name}</strong>, il tuo account è stato registrato nel database di Serra Baden-Powell Savona.
                </p>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-4 text-left">
                  🛡️ <strong>Permessi necessari:</strong> Al momento non disponi dei permessi necessari per accedere alla dashboard. L'Owner del sistema (<code>mattiaghig60@gmail.com</code>) o un Amministratore verificherà la tua richiesta e ti assegnerà il ruolo di <strong>Volontario</strong> o <strong>Amministratore</strong>.
                </div>
                <div className="mt-8 flex justify-center gap-3">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors"
                  >
                    Esci dall'Account
                  </button>
                </div>
              </div>
            ) : (
              /* --- RUOLI PRIVILEGIATI: ADMIN, SUPERADMIN, VOLUNTEER --- */
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Dashboard Tabs Bar */}
                <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
                      <>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'bookings' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          📋 Gestione Prenotazioni
                        </button>
                        <button
                          onClick={() => setActiveTab('stats')}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === 'stats' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          📊 Statistiche & Report
                        </button>
                      </>
                    )}

                    {/* Scheda Volontari (visibile anche agli admin) */}
                    <button
                      onClick={() => setActiveTab('volunteer')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'volunteer' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      📱 Scanner Volontari (Mobile)
                    </button>

                    {/* Scheda Ruoli Utenti (Solo SuperAdmin) */}
                    {currentUser.role === 'superadmin' && (
                      <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          activeTab === 'users' ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        👑 Gestione Ruoli (Owner)
                      </button>
                    )}
                  </div>

                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-white border border-stone-300 text-stone-600 hover:text-emerald-700 hover:bg-stone-50 text-xs"
                    title="Aggiorna Dati"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Tab Content Display */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  
                  {/* --- TAB 1: GESTIONE PRENOTAZIONI (ADMIN) --- */}
                  {activeTab === 'bookings' && (
                    <div className="space-y-4">
                      {/* Search & Filter Toolbar */}
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200">
                        <div className="relative w-full sm:w-80">
                          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Cerca nome, email o codice pass..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                          />
                        </div>

                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="text-xs border border-stone-300 rounded-xl px-3 py-2 bg-white w-full sm:w-auto"
                        >
                          <option value="">Tutti gli stati</option>
                          <option value="confermata">Confermata</option>
                          <option value="validata">Validata</option>
                          <option value="disdetta_staff">Disdetta dallo Staff</option>
                          <option value="disdetta_utente">Disdetta dall'Utente</option>
                        </select>
                      </div>

                      {/* Bookings List */}
                      <div className="space-y-3">
                        {bookings.map((b) => (
                          <div
                            key={b._id || b.code}
                            className="p-4 rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-400 transition-colors"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  {b.code}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    b.status === 'validata'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.status === 'confermata'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </div>

                              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                <span>{b.name}</span>
                                <span className="text-xs text-stone-500 font-normal">({b.visitorsCount} visitatori)</span>
                              </div>

                              <div className="text-xs text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                                <span>📧 {b.email}</span>
                                {b.phone && <span>📞 {b.phone}</span>}
                              </div>

                              <div className="text-xs text-stone-700 font-medium pt-1">
                                📅 <strong>{b.date}</strong> (Giovedì) • ⏰ <strong>{b.timeSlot}</strong>
                              </div>

                              {b.cancellationReason && (
                                <div className="text-[11px] text-rose-700 italic bg-rose-50 p-2 rounded-xl mt-1 border border-rose-200">
                                  Motivazione disdetta: {b.cancellationReason}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end md:self-center">
                              {b.status === 'confermata' && (
                                <button
                                  onClick={() => setCancellingBooking(b)}
                                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                                >
                                  Disdici da Staff
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {bookings.length === 0 && (
                          <div className="text-center py-12 text-stone-400">
                            Nessuna prenotazione trovata.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- TAB 2: STATISTICHE INTERATTIVE --- */}
                  {activeTab === 'stats' && stats && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-400 uppercase">Totale Prenotazioni</span>
                          <div className="font-serif text-3xl font-bold text-stone-900 mt-1">{stats.total}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                          <span className="text-[11px] font-bold text-emerald-800 uppercase">Visite Confermate</span>
                          <div className="font-serif text-3xl font-bold text-emerald-900 mt-1">{stats.confirmed}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">
                          <span className="text-[11px] font-bold text-teal-800 uppercase">Visite Validate</span>
                          <div className="font-serif text-3xl font-bold text-teal-900 mt-1">{stats.validated}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                          <span className="text-[11px] font-bold text-rose-800 uppercase">Disdette Totali</span>
                          <div className="font-serif text-3xl font-bold text-rose-900 mt-1">{stats.cancelledTotal}</div>
                        </div>
                      </div>

                      {/* Interactive Slot Distribution Bar Chart */}
                      <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
                        <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-emerald-600" />
                          <span>Distribuzione Visitatori per Fascia Oraria (Giovedì 14-17)</span>
                        </h4>

                        <div className="space-y-3">
                          {['14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'].map((slotLabel) => {
                            const found = stats.bySlot.find(s => s._id === slotLabel);
                            const count = found ? found.count : 0;
                            const max = 60; // scala
                            const pct = Math.min(100, Math.round((count / max) * 100));

                            return (
                              <div key={slotLabel} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold text-stone-700">
                                  <span>{slotLabel}</span>
                                  <span className="text-emerald-800">{count} visitatori</span>
                                </div>
                                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(5, pct)}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB 3: SCANNER VOLONTARI (MOBILE-FIRST) --- */}
                  {activeTab === 'volunteer' && (
                    <div className="space-y-6 max-w-xl mx-auto">
                      
                      {/* Scanner Camera Box */}
                      <div className="p-6 rounded-3xl bg-stone-900 text-white text-center shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                          <h4 className="font-serif font-bold text-lg text-white">Scanner Pass QR Code</h4>
                          <span className="text-xs text-emerald-400 font-mono">Camera Live</span>
                        </div>

                        {/* Scanner Video Mount */}
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center border border-stone-700">
                          {isScanning ? (
                            <div id="qr-reader" className="w-full h-full"></div>
                          ) : (
                            <div className="p-8 text-center text-stone-400">
                              <Camera className="w-12 h-12 mx-auto mb-2 text-stone-500" />
                              <p className="text-xs">Fotocamera non attiva. Clicca sul pulsante sottostante per iniziare la scansione.</p>
                            </div>
                          )}
                        </div>

                        {/* Scanner Feedback Message */}
                        {scannerMessage && (
                          <div
                            className={`p-3.5 rounded-2xl text-xs font-bold animate-fadeIn flex items-center justify-center gap-2 ${
                              scannerMessage.type === 'success'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {scannerMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span>{scannerMessage.text}</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {!isScanning ? (
                            <button
                              onClick={startScanner}
                              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <Camera className="w-4 h-4" />
                              <span>Attiva Fotocamera Scanner</span>
                            </button>
                          ) : (
                            <button
                              onClick={stopScanner}
                              className="w-full py-3.5 rounded-2xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                            >
                              <CameraOff className="w-4 h-4" />
                              <span>Chiudi Fotocamera</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Manual Code Fallback */}
                      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="block text-xs font-bold uppercase text-stone-700">
                          Convalida Manuale (Se il QR non è leggibile)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="es. SBP-261128-4821"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                            className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-xs uppercase"
                          />
                          <button
                            onClick={() => { validatePassCode(manualCode); setManualCode(''); }}
                            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
                          >
                            Valida
                          </button>
                        </div>
                      </div>

                      {/* Lista Ingressi del Giorno */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-base text-stone-900">
                            Visitatori Attesi Oggi ({bookings.length})
                          </h4>
                          <input
                            type="date"
                            value={selectedVolunteerDate}
                            onChange={(e) => setSelectedVolunteerDate(e.target.value)}
                            className="text-xs border border-stone-300 rounded-xl px-2 py-1 bg-white"
                          />
                        </div>

                        {bookings.map((b) => (
                          <div
                            key={b.code}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                              b.status === 'validata'
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-white border-stone-200'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-stone-900">{b.name} ({b.visitorsCount}p)</div>
                              <div className="text-stone-500 font-mono">{b.code} • {b.timeSlot}</div>
                            </div>
                            <div>
                              {b.status === 'validata' ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                                  <Check className="w-3.5 h-3.5" /> Validato
                                </span>
                              ) : (
                                <button
                                  onClick={() => validatePassCode(b.code)}
                                  className="px-3 py-1 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                                >
                                  Valida
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* --- TAB 4: GESTIONE RUOLI (SUPERADMIN OWNER) --- */}
                  {activeTab === 'users' && currentUser.role === 'superadmin' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
                        👑 <strong>Pannello Owner Super-Admin:</strong> Puoi promuovere gli utenti registrati al ruolo di <strong>Amministratore</strong> (accesso statistiche e disdetta con email) o <strong>Volontario</strong> (scanner mobile QR pass).
                      </div>

                      <div className="space-y-3">
                        {usersList.map((u) => (
                          <div
                            key={u._id}
                            className="p-4 rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                                <span>{u.name}</span>
                                {u.email.toLowerCase() === 'mattiaghig60@gmail.com' && (
                                  <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-stone-500">{u.email}</div>
                              <div className="text-[11px] text-stone-400 mt-1">
                                Ruolo attuale: <strong className="uppercase text-stone-700">{u.role}</strong> ({u.status})
                              </div>
                            </div>

                            {u.email.toLowerCase() !== 'mattiaghig60@gmail.com' && (
                              <div className="flex items-center gap-2">
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  className="text-xs border border-stone-300 rounded-xl px-3 py-1.5 bg-white font-semibold"
                                >
                                  <option value="standard">Standard (In attesa)</option>
                                  <option value="volunteer">Volontario (Scanner)</option>
                                  <option value="admin">Amministratore (Pieno)</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- MODALE DISDETTA STAFF CON MOTIVAZIONE ED EMAIL --- */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <h4 className="font-serif font-bold text-lg text-stone-900">
              Disdici Prenotazione da Staff
            </h4>
            <p className="text-xs text-stone-600">
              Stai per annullare la visita di <strong>{cancellingBooking.name}</strong> per giovedì {cancellingBooking.date} ({cancellingBooking.timeSlot}).
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                Motivazione Ufficiale (Inviata all'utente via email):
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="Manutenzione straordinaria delle specie cactacee">Manutenzione straordinaria delle specie cactacee</option>
                <option value="Impossibilità di ricevere visite in questa fascia oraria">Impossibilità di ricevere visite in questa fascia oraria</option>
                <option value="Condizioni meteorologiche avverse per la serra">Condizioni meteorologiche avverse per la serra</option>
                <option value="Chiusura straordinaria dei Giardini Baden-Powell">Chiusura straordinaria dei Giardini Baden-Powell</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
              >
                Annulla
              </button>
              <button
                onClick={handleStaffCancel}
                disabled={cancellingLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                {cancellingLoading ? 'Invio in corso...' : 'Conferma Disdetta ed Invia Email'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
