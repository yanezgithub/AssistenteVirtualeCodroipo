# Configurazione Vapi

## 1. Creazione Account

1. Vai su https://vapi.ai
2. Crea un account
3. Accedi alla dashboard

## 2. Creazione Assistente

1. Click su "Create Assistant"
2. Scegli voce italiana
3. Configura il system prompt:

```
Sei un assistente virtuale del Comune di Codroipo.
Rispondi in italiano in modo cortese e professionale.
Puoi fornire informazioni sui servizi comunali e aiutare
a prenotare appuntamenti.

Servizi disponibili:
- Certificato di Residenza
- Carta d'Identità
- TARI (Tassa Rifiuti)
- Pratiche Edilizie
- Servizi Sociali

Se non conosci una risposta, chiedi chiarimenti o suggerisci
di contattare direttamente l'ufficio competente.
```

## 3. Knowledge Base

1. Vai su "Knowledge Base"
2. Upload file `knowledge-base/services.json`
3. Configura embedding settings

## 4. Functions Setup

Aggiungi le seguenti functions:

### checkAvailability
```json
{
  "name": "checkAvailability",
  "description": "Verifica disponibilità per un appuntamento",
  "parameters": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string",
        "format": "date",
        "description": "Data appuntamento (YYYY-MM-DD)"
      },
      "time": {
        "type": "string",
        "description": "Orario (HH:MM)"
      }
    },
    "required": ["date", "time"]
  },
  "url": "https://your-backend.com/api/calendar/check"
}
```

### createBooking
```json
{
  "name": "createBooking",
  "description": "Crea una prenotazione",
  "parameters": {
    "type": "object",
    "properties": {
      "service": { "type": "string" },
      "serviceCode": { "type": "string" },
      "name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "phone": { "type": "string" },
      "date": { "type": "string", "format": "date" },
      "time": { "type": "string" }
    },
    "required": ["service", "serviceCode", "name", "email", "date", "time"]
  },
  "url": "https://your-backend.com/api/bookings"
}
```

## 5. API Keys

1. Vai su Settings -> API Keys
2. Copia Public Key e Private Key
3. Aggiungi in .env:
   - Backend: VAPI_API_KEY=private_key
   - Frontend: REACT_APP_VAPI_PUBLIC_KEY=public_key

## 6. Testing

Testa l'assistente dalla dashboard Vapi prima di integrarlo.
