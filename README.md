# Assistente Virtuale - Comune di Codroipo

Prototipo MVP di assistente virtuale intelligente per i servizi comunali.

## Stack Tecnologico

- **Backend**: Node.js + Express
- **Frontend**: React
- **AI Platform**: Vapi.ai
- **Database**: MongoDB
- **Calendar**: Google Calendar API
- **Notifications**: Nodemailer

## Struttura Progetto

```
assistente-virtuale-codroipo/
├── backend/              # Server Node.js
├── frontend/             # App React
├── scraper/              # Script web scraping
├── knowledge-base/       # Dati servizi comunali
└── docs/                 # Documentazione
```

## Setup Rapido

### Prerequisiti
- Node.js 18+
- MongoDB
- Account Vapi.ai
- Google Cloud Console (Calendar API)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configura le variabili in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Scraper
```bash
cd scraper
npm install
node scraper.js
```

## Configurazione

1. Crea account su [Vapi.ai](https://vapi.ai) e ottieni API key
2. Configura Google Calendar API su Google Cloud Console
3. Crea database MongoDB (locale o Atlas)
4. Copia `.env.example` in `.env` e configura le variabili

## Funzionalità MVP

- ✅ Informazioni sui servizi comunali
- ✅ Interazione vocale con assistente AI
- ✅ Prenotazione appuntamenti
- ✅ Integrazione Google Calendar
- ✅ Notifiche email automatiche
- ✅ Promemoria 24h prima

## Sviluppo

### Backend API Endpoints
- `GET /api/services` - Lista servizi
- `GET /api/services/:code` - Dettaglio servizio
- `POST /api/bookings` - Crea prenotazione
- `GET /api/bookings/:id` - Dettaglio prenotazione
- `POST /api/calendar/check` - Verifica disponibilità
- `POST /api/calendar/create` - Crea evento

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

### Backend (Render/Railway)
```bash
git push origin main
# Configura auto-deploy su piattaforma scelta
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy su piattaforma scelta
```

## Documentazione

Vedi cartella `docs/` per:
- Guida setup dettagliata
- Documentazione API
- Configurazione Vapi
- Tutorial Google Calendar

## Supporto

Per problemi o domande, consulta la documentazione o apri una issue.

## Licenza

Proprietario - Comune di Codroipo

## 🔧 Environment Variables Setup

1. Copy the example environment file:
```bash
   cp .env.example .env
```

2. Fill in your credentials in `.env`:

   ### Required:
   - `MONGODB_URI` - Your MongoDB connection string
   - `VAPI_API_KEY` - From https://dashboard.vapi.ai/account
   - `VAPI_ASSISTANT_ID` - From your Vapi assistant dashboard
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `GOOGLE_REFRESH_TOKEN` - Obtain via `/auth/google/url` endpoint
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` - Your SMTP credentials

   ### Optional:
   - `VAPI_PHONE_NUMBER` - Only if using phone calls
   - `PORT` - Default 5000
   - `FRONTEND_URL` - Default http://localhost:3000

3. See [Setup Guide](docs/SETUP.md) for detailed instructions on obtaining credentials.
