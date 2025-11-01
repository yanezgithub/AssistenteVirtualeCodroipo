import React, { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(process.env.REACT_APP_VAPI_PUBLIC_KEY);

function VoiceAssistant() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Listen for Vapi events
    vapi.on('call-start', () => {
      console.log('Call started');
      setIsCallActive(true);
      setIsConnecting(false);
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setIsCallActive(false);
      setIsConnecting(false);
    });

    vapi.on('speech-start', () => {
      console.log('User started speaking');
    });

    vapi.on('speech-end', () => {
      console.log('User stopped speaking');
    });

    vapi.on('message', (message) => {
      console.log('Message:', message);
      
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript(message.transcript);
        setMessages(prev => [...prev, {
          type: 'user',
          text: message.transcript,
          timestamp: new Date()
        }]);
      }
      
      if (message.type === 'function-call') {
        console.log('Function call:', message);
      }
    });

    vapi.on('error', (error) => {
      console.error('Vapi error:', error);
      setIsCallActive(false);
      setIsConnecting(false);
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const startCall = async () => {
    try {
      setIsConnecting(true);
      await vapi.start(process.env.REACT_APP_VAPI_ASSISTANT_ID);
    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    vapi.stop();
  };

  return (
    <div className="voice-assistant">
      <div className="assistant-card">
        <h3>🎤 Assistente Vocale</h3>
        
        <div className="assistant-controls">
          {!isCallActive && !isConnecting && (
            <button onClick={startCall} className="btn btn-primary btn-large">
              🎤 Parla con l'Assistente
            </button>
          )}
          
          {isConnecting && (
            <button className="btn btn-secondary btn-large" disabled>
              ⏳ Connessione in corso...
            </button>
          )}
          
          {isCallActive && (
            <>
              <div className="call-active">
                <div className="pulse-indicator"></div>
                <span>Chiamata attiva - Sto ascoltando...</span>
              </div>
              <button onClick={endCall} className="btn btn-danger">
                ⏹️ Termina Chiamata
              </button>
            </>
          )}
        </div>

        {transcript && (
          <div className="transcript">
            <p><strong>Ultima domanda:</strong> {transcript}</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="messages-container">
            <h4>Cronologia conversazione</h4>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message message-${msg.type}`}>
                  <p>{msg.text}</p>
                  <small>{msg.timestamp.toLocaleTimeString('it-IT')}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="assistant-help">
        <h4>📝 Cosa puoi chiedere:</h4>
        <ul>
          <li>Informazioni sugli orari degli uffici</li>
          <li>Come richiedere certificati e documenti</li>
          <li>Prenotare un appuntamento</li>
          <li>Informazioni sulla TARI e altri tributi</li>
          <li>Servizi sociali e assistenza</li>
        </ul>
      </div>
    </div>
  );
}

export default VoiceAssistant;
