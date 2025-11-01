# 🚀 Quickstart - Assistente Virtuale Codroipo

## Setup Rapido (5 minuti)

### 1. Estrai i file
```bash
tar -xzf assistente-virtuale-codroipo.tar.gz
cd assistente-virtuale-codroipo
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

**Modifica `.env` con le tue chiavi:**
```
MONGODB_URI=mongodb://localhost:27017/assistente-codroipo
VAPI_API_KEY=your_vapi_private_key
# ... altre configurazioni
```

**Avvia MongoDB e il server:**
```bash
# In un terminale
mongod

# In altro terminale
cd backend
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

**Modifica `.env`:**
```
REACT_APP_VAPI_PUBLIC_KEY=your_vapi_public_key
REACT_APP_VAPI_ASSISTANT_ID=your_assistant_id
```

**Avvia l'app:**
```bash
npm start
```

### 4. Inizializza Database

```bash
cd backend
node src/utils/seed-database.js
```

## 🎯 Test Veloce

1. Apri http://localhost:3000
2. Clicca "Parla con l'Assistente"
3. Chiedi: "A che ora apre l'ufficio anagrafe?"
4. Prova a prenotare un appuntamento

## 📚 Struttura Progetto

```
├── backend/          # API Node.js
│   ├── src/
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   └── server.js
│
├── frontend/         # React App
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   └── styles/       # CSS
│   └── public/
│
├── scraper/          # Web scraping
├── knowledge-base/   # Services data
└── docs/             # Documentation
```

## 🔑 Chiavi API Necessarie

### Vapi.ai
1. Registrati su https://vapi.ai
2. Dashboard → Create Assistant
3. Copia Public Key e Private Key

### Google Calendar
1. https://console.cloud.google.com
2. Enable Calendar API
3. Create OAuth credentials
4. Ottieni refresh token visitando: http://localhost:5000/auth/google/url

## ⚙️ Configurazione Vapi

**System Prompt:**
```
Sei un assistente virtuale del Comune di Codroipo.
Rispondi in italiano in modo cortese e professionale.
Puoi fornire informazioni sui servizi comunali e
aiutare a prenotare appuntamenti.
```

**Functions da configurare:**
- `checkAvailability`: Verifica disponibilità slot
- `createBooking`: Crea prenotazione

## 🐛 Troubleshooting

**MongoDB non si connette?**
- Assicurati che `mongod` sia in esecuzione
- Verifica MONGODB_URI in .env

**Vapi non risponde?**
- Controlla le API keys in .env
- Verifica che l'assistente sia attivo su Vapi

**Errori di build frontend?**
- Cancella node_modules e reinstalla: `rm -rf node_modules && npm install`

## 📖 Documentazione Completa

- `docs/SETUP.md` - Setup dettagliato
- `docs/VAPI-SETUP.md` - Configurazione Vapi
- `README.md` - Overview progetto

## 🎉 Pronto!

Ora hai l'assistente virtuale funzionante!

Visita http://localhost:3000 e inizia a testare.

Per domande o problemi, consulta la documentazione in `docs/`.
