const express = require('express');
const router = express.Router();
//const calendarService = require('../services/calendar');
const calendarService = require('../services/calendarMock');

// POST check availability for a time slot
router.post('/check', async (req, res) => {
  try {
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ 
        error: 'Date and time are required',
        available: false 
      });
    }
    
    const isAvailable = await calendarService.checkAvailability(date, time);
    
    // IMPORTANTE: Formato risposta per Vapi
    res.json({ 
      available: isAvailable,
      date: date,
      time: time,
      message: isAvailable 
        ? `Lo slot del ${date} alle ${time} è disponibile`
        : `Lo slot del ${date} alle ${time} NON è disponibile. Proponi un altro orario.`
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      error: 'Error checking availability',
      available: false,
      message: 'Errore nel verificare la disponibilità. Riprova.'
    });
  }
});

// GET available slots for a date
router.get('/slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const slots = await calendarService.getAvailableSlots(date);
    res.json({ 
      date, 
      slots,
      message: `Slot disponibili per il ${date}: ${slots.join(', ')}`
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ 
      error: 'Error fetching available slots',
      slots: []
    });
  }
});

module.exports = router;