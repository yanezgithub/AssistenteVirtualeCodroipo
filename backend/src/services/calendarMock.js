// Mock calendar service (senza Google Calendar per MVP)
// Memorizza gli slot prenotati in memoria

// Mock calendar service con DEBUG
const bookedSlots = new Map();

/**
 * Check if a time slot is available
 */
async function checkAvailability(date, time) {
  try {
    console.log(`\n🔍 DEBUG checkAvailability:`);
    console.log(`   Data ricevuta: ${date}`);
    console.log(`   Ora ricevuta: ${time}`);
    
    const slotKey = `${date}-${time}`;
    console.log(`   Slot key: ${slotKey}`);
    
    // Verifica se lo slot è già prenotato
    if (bookedSlots.has(slotKey)) {
      console.log(`   ❌ Slot già prenotato`);
      return false;
    }
    console.log(`   ✅ Slot non prenotato`);
    
    // Verifica orari lavorativi (9:00-13:00)
    const [hours, minutes] = time.split(':').map(Number);
    console.log(`   Ore: ${hours}, Minuti: ${minutes}`);
    
    const totalMinutes = hours * 60 + minutes;
    const minTime = 9 * 60; // 9:00
    const maxTime = 13 * 60; // 13:00
    
    console.log(`   Minuti totali: ${totalMinutes} (range: ${minTime}-${maxTime})`);
    
    if (totalMinutes < minTime || totalMinutes >= maxTime) {
      console.log(`   ❌ Fuori orario lavorativo (9:00-13:00)`);
      return false;
    }
    console.log(`   ✅ Orario valido`);
    
    // Verifica che non sia weekend
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    console.log(`   Giorno settimana: ${dayOfWeek} (0=Dom, 6=Sab)`);
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      console.log(`   ❌ Weekend non disponibile`);
      return false;
    }
    console.log(`   ✅ Giorno lavorativo`);
    
    console.log(`   ✅✅✅ DISPONIBILE!\n`);
    return true;
    
  } catch (error) {
    console.error('❌ Error checking availability:', error);
    return false;
  }
}

/**
 * Get available slots for a specific date
 */
async function getAvailableSlots(date) {
  try {
    console.log(`\n📅 Getting slots per: ${date}`);
    const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
    const availableSlots = [];
    
    for (const time of workHours) {
      const isAvailable = await checkAvailability(date, time);
      if (isAvailable) {
        availableSlots.push(time);
      }
    }
    
    console.log(`✅ Slot disponibili: ${availableSlots.join(', ')}\n`);
    return availableSlots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    return [];
  }
}

/**
 * Create a new calendar event
 */
async function createEvent(data) {
  try {
    const { date, time } = data;
    const slotKey = `${date}-${time}`;
    
    bookedSlots.set(slotKey, true);
    console.log(`✅ Slot prenotato: ${slotKey}`);
    console.log(`   Totale prenotazioni: ${bookedSlots.size}`);
    
    return {
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      summary: data.summary,
      start: { dateTime: `${date}T${time}:00` },
      end: { dateTime: `${date}T${time}:30` }
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

/**
 * Update an existing calendar event
 */
async function updateEvent(eventId, data) {
  try {
    const { date, time } = data;
    console.log(`✅ Event aggiornato: ${eventId} -> ${date} ${time}`);
    
    return {
      id: eventId,
      start: { dateTime: `${date}T${time}:00` },
      end: { dateTime: `${date}T${time}:30` }
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

/**
 * Delete a calendar event
 */
async function deleteEvent(eventId) {
  try {
    console.log(`✅ Event cancellato: ${eventId}`);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Clear all bookings
 */
function clearAllBookings() {
  bookedSlots.clear();
  console.log('✅ Tutte le prenotazioni cancellate');
}

module.exports = {
  checkAvailability,
  getAvailableSlots,
  createEvent,
  updateEvent,
  deleteEvent,
  clearAllBookings
};