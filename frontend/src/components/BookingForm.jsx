import React, { useState, useEffect } from 'react';
import api from '../services/api';

function BookingForm() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceCode: '',
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (formData.date) {
      loadAvailableSlots();
    }
  }, [formData.date]);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data.filter(s => s.bookingEnabled));
    } catch (err) {
      console.error('Error loading services:', err);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const slots = await api.getAvailableSlots(formData.date);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error loading slots:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedService = services.find(s => s.code === formData.serviceCode);
      const bookingData = {
        ...formData,
        service: selectedService.name
      };

      await api.createBooking(bookingData);
      setSuccess(true);
      setFormData({
        serviceCode: '',
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nella creazione della prenotazione');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <h2>✅ Prenotazione Confermata!</h2>
        <p>Riceverai una email di conferma e un promemoria 24 ore prima.</p>
        <button onClick={() => setSuccess(false)} className="btn btn-primary">
          Nuova Prenotazione
        </button>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h2>Prenota un Appuntamento</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Servizio *</label>
          <select name="serviceCode" value={formData.serviceCode} onChange={handleChange} required>
            <option value="">Seleziona un servizio</option>
            {services.map(service => (
              <option key={service._id} value={service.code}>{service.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nome e Cognome *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Telefono</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Data *</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
        </div>

        {availableSlots.length > 0 && (
          <div className="form-group">
            <label>Orario *</label>
            <select name="time" value={formData.time} onChange={handleChange} required>
              <option value="">Seleziona un orario</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Note</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          {loading ? 'Prenotazione in corso...' : 'Prenota Appuntamento'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
