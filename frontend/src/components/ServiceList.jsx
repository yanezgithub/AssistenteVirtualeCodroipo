import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
      setLoading(false);
    } catch (err) {
      setError('Errore nel caricamento dei servizi');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Caricamento servizi...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="service-list">
      <h2>Servizi Comunali</h2>
      <div className="services-grid">
        {services.map(service => (
          <div key={service._id} className="service-card">
            <h3>{service.name}</h3>
            <p className="description">{service.description}</p>
            <div className="service-info">
              <p><strong>Ufficio:</strong> {service.office}</p>
              <p><strong>Orari:</strong> {service.hours}</p>
              <p><strong>Costo:</strong> {service.cost}</p>
            </div>
            {service.documents && service.documents.length > 0 && (
              <div className="documents">
                <p><strong>Documenti necessari:</strong></p>
                <ul>
                  {service.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceList;
