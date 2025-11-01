import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';
import VoiceAssistant from './components/VoiceAssistant';
import ServiceList from './components/ServiceList';
import BookingForm from './components/BookingForm';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h1>🏛️ Comune di Codroipo</h1>
            <p>Assistente Virtuale</p>
          </div>
        </header>

        <nav className="App-nav">
          <div className="container">
            <Link to="/">Home</Link>
            <Link to="/services">Servizi</Link>
            <Link to="/booking">Prenota</Link>
          </div>
        </nav>

        <main className="App-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/booking" element={<BookingForm />} />
            </Routes>
          </div>
        </main>

        <footer className="App-footer">
          <div className="container">
            <p>© 2025 Comune di Codroipo - Tutti i diritti riservati</p>
            <p>Piazza Garibaldi, 1 - 33033 Codroipo (UD) | Tel: 0432-123456</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h2>Benvenuto nell'Assistente Virtuale</h2>
        <p>Puoi chiedermi informazioni sui servizi comunali e prenotare appuntamenti</p>
      </div>
      
      <VoiceAssistant />
      
      <div className="info-cards">
        <div className="card">
          <h3>💬 Assistente Vocale</h3>
          <p>Parla con l'assistente per ottenere informazioni sui servizi comunali</p>
        </div>
        <div className="card">
          <h3>📅 Prenota Appuntamenti</h3>
          <p>Prenota facilmente appuntamenti presso gli uffici comunali</p>
        </div>
        <div className="card">
          <h3>📧 Notifiche Email</h3>
          <p>Ricevi conferme e promemoria automatici via email</p>
        </div>
      </div>
    </div>
  );
}

export default App;
