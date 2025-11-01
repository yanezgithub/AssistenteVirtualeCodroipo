const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const calendarService = require('../services/calendar');
//const calendarService = require('../services/calendarMock');
const emailService = require('../services/email');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const { status, date, email } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (email) query.email = email.toLowerCase();
    
    const bookings = await Booking.find(query).sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

// GET booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Error fetching booking' });
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  try {
    const { service, serviceCode, name, email, phone, date, time, notes } = req.body;
    
    // Validate required fields
    if (!service || !serviceCode || !name || !email || !date || !time) {
      return res.status(400).json({ 
        error: 'Campi mancanti. Servono: service, serviceCode, name, email, date, time',
        success: false
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Email non valida',
        success: false
      });
    }
    
    // Check availability first
    const isAvailable = await calendarService.checkAvailability(date, time);
    if (!isAvailable) {
      return res.status(409).json({ 
        error: 'Orario non disponibile',
        success: false,
        message: `L'orario ${time} del ${date} non è disponibile`
      });
    }
    
    // Create Google Calendar event (SOLO se hai configurato Google Calendar)
    let googleEventId = null;
    try {
      const event = await calendarService.createEvent({
        summary: `${service} - ${name}`,
        description: `Prenotazione: ${service}\nCliente: ${name}\nEmail: ${email}\nTelefono: ${phone || 'N/A'}\nNote: ${notes || 'N/A'}`,
        date,
        time,
        email
      });
      googleEventId = event.id;
    } catch (calError) {
      console.error('Google Calendar error (continuando comunque):', calError);
    }
    
    // Create booking in database
    const booking = new Booking({
      service,
      serviceCode,
      name,
      email,
      phone,
      date,
      time,
      notes,
      googleEventId,
      status: 'confirmed'
    });
    
    await booking.save();
    
    // Send confirmation email (SOLO se hai configurato email)
    try {
      await emailService.sendConfirmation(booking);
    } catch (emailError) {
      console.error('Email error (continuando comunque):', emailError);
    }
    
    // IMPORTANTE: Risposta per Vapi
    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        service: booking.service,
        name: booking.name,
        date: booking.date,
        time: booking.time
      },
      message: `Perfetto! Ho prenotato l'appuntamento per ${service} il giorno ${date} alle ore ${time}. Riceverà una email di conferma all'indirizzo ${email} e un promemoria 24 ore prima. Il codice prenotazione è ${booking._id}.`
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Errore nella creazione della prenotazione',
      success: false,
      message: 'Mi dispiace, si è verificato un errore. Riprova o contatta il numero 0432-123456.'
    });
  }
});

// PUT update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update Google Calendar event if date/time changed
    if (req.body.date || req.body.time) {
      await calendarService.updateEvent(
        booking.googleEventId,
        {
          date: req.body.date || booking.date,
          time: req.body.time || booking.time
        }
      );
    }
    
    // Update booking
    Object.assign(booking, req.body);
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Error updating booking' });
  }
});

// DELETE cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Delete from Google Calendar
    if (booking.googleEventId) {
      await calendarService.deleteEvent(booking.googleEventId);
    }
    
    // Update status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    // Send cancellation email
    await emailService.sendCancellation(booking);
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Error cancelling booking' });
  }
});

module.exports = router;
