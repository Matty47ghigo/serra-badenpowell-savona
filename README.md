# 🌵 Serra Baden-Powell Savona — Piattaforma Prenotazioni

> Sito one-page professionale + sistema gestionale per la **Serra dei Giardini Robert Baden-Powell** di Savona (Quartiere Villetta). Progetto di rigenerazione urbana — *Patto di Collaborazione Civica "Giardinetti 365"*

---

## 🏗️ Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS v3 |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas (Mongoose) |
| **Auth** | JWT + Google OAuth |
| **Email** | Nodemailer (Gmail SMTP) |
| **QR Code** | qrcode (Node) + html5-qrcode (browser scanner) |
| **Deploy** | Vercel (serverless) + Docker (self-hosted) |
| **Cron** | Vercel Cron Jobs (promemoria 48h) |

---

## 📁 Struttura Progetto

```
sito premontazioni serra/
├── client/                    # Frontend React
│   ├── public/                # Assets statici (logo, favicon)
│   ├── src/
│   │   ├── components/        # Componenti React
│   │   ├── data/              # Dati (piante, gallery, partner)
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
├── server/                    # Backend Express
│   ├── config/db.js           # Connessione MongoDB
│   ├── middleware/            # Auth middleware (JWT + RBAC)
│   ├── models/                # Schemi Mongoose (User, Booking)
│   ├── routes/                # Route API
│   ├── services/              # Email + Calendar services
│   ├── templates/             # Template HTML email
│   └── server.js
├── api/index.js               # Entry point Vercel serverless
├── vercel.json                # Config deploy + cron
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## ⚙️ Configurazione `.env`

Copia `.env.example` in `.env` e compila le variabili:

```bash
cp .env.example .env
```

| Variabile | Descrizione |
|---|---|
| `MONGODB_URI` | URI MongoDB Atlas |
| `JWT_SECRET` | Chiave segreta per JWT |
| `BASE_URL` | URL base del sito (es. `https://tuo-dominio.vercel.app`) |
| `EMAIL_FROM` | Mittente email (`business.matty47ghigo@gmail.com`) |
| `GMAIL_APP_PASSWORD` | App Password Gmail (non la password normale!) |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth |
| `CAPTCHA_SECRET_KEY` | Chiave segreta Cloudflare Turnstile |
| `CRON_SECRET` | Token segreto per proteggere la route cron |

---

## 🚀 Avvio Locale

### Con Node.js

```bash
# Installa dipendenze
npm --prefix server install
npm --prefix client install

# Avvia backend (porta 5000)
node server/server.js

# Avvia frontend dev (porta 5173, in altro terminale)
cd client && npm run dev
```

### Con Docker

```bash
docker compose up -d --build
```

Visita `http://localhost:3000`

---

## 📅 Regole di Prenotazione

- ✅ Solo **Giovedì** (il backend valida `getDay() === 4`)
- ✅ Fascia oraria: **14:00 – 17:00** (3 slot da 1h)
- ✅ Massimo **20 visitatori per slot**
- ✅ QR Code generato automaticamente come pass d'ingresso
- ✅ Email conferma con QR + link Google Calendar + file `.ics` Apple Calendar

---

## 👤 Ruoli RBAC

| Ruolo | Permessi |
|---|---|
| **Standard** | Si registra → stato "in attesa" |
| **Volontario** | Calendario giornaliero + scanner QR fotocamera |
| **Amministratore** | Gestione prenotazioni, statistiche, disdette con email |
| **Super-Admin** | Tutti i permessi + gestione utenti e ruoli |

> `mattiaghig60@gmail.com` viene assegnato automaticamente come Super-Admin.

---

## 📧 Email Automatiche

| Trigger | Template |
|---|---|
| Nuova prenotazione | Conferma con QR Code + Google/Apple Calendar |
| 48h prima visita | Promemoria con link gestione autonoma |
| Disdetta da staff | Email cortese con motivo |
| Modifica data visitatore | Conferma aggiornamento |
| Annullamento da visitatore | Conferma disdetta |

---

## 🌐 Deploy su Vercel

1. Crea repo GitHub e fai push del codice
2. Importa su [vercel.com](https://vercel.com)
3. Imposta le variabili d'ambiente dalla dashboard Vercel
4. Il deploy avviene automaticamente ad ogni push su `main`
5. Il cron job per i promemoria gira ogni giorno alle **08:00 UTC**

---

## 🔗 Link Ufficiali Serra

- **Instagram:** [@serrabadenpowell](https://www.instagram.com/serrabadenpowell)
- **Facebook:** [Serra Baden-Powell](https://www.facebook.com/share/1DtFrn6KFS/?mibextid=wwXIfr)
- **RAI Linea Verde:** [Episodio](https://www.raiplay.it/programmi/lineaverdeitalia)

---

*Progetto sviluppato con ❤️ per la comunità savonese — 2026*
