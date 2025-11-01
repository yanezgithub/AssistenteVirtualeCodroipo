# Setup Completo - Guida Passo-Passo

## 1. Prerequisiti

Assicurati di avere installato:
- Node.js 18+ (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/try/download/community)
- Git (https://git-scm.com/)

## 2. Clonazione Progetto

```bash
git clone <repository-url>
cd assistente-virtuale-codroipo
```

## 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configura il file `.env` con le tue chiavi API:
- Ottieni VAPI_API_KEY da https://vapi.ai
- Configura Google Calendar API su https://console.cloud.google.com
- Setup MongoDB locale o MongoDB Atlas

Avvia il server:
```bash
npm run dev
```

Il backend sarà disponibile su http://localhost:5000

## 4. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Configura `.env` con le chiavi Vapi pubbliche.

Avvia l'app:
```bash
npm start
```

Il frontend sarà disponibile su http://localhost:3000

## 5. Inizializzazione Database

Carica i servizi nel database:
```bash
cd ../backend
node src/utils/seed-database.js
```

## 6. Test

Visita http://localhost:3000 e prova:
1. Cliccare su "Parla con l'Assistente"
2. Chiedere informazioni sui servizi
3. Prenotare un appuntamento

## Troubleshooting

### MongoDB non si connette
- Verifica che MongoDB sia in esecuzione
- Controlla la stringa di connessione in .env

### Errore Vapi
- Verifica le chiavi API in .env
- Controlla di aver creato un assistente su Vapi

### Google Calendar non funziona
- Completa l'OAuth flow visitando /auth/google/url
- Aggiungi il refresh token in .env
