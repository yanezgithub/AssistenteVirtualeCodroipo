const { google } = require('googleapis');

// OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Check if a time slot is available
 */
async function checkAvailability(date, time) {
  try {
    const dateTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(dateTime.getTime() + 30 * 60000); // +30 minutes
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: dateTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    return response.data.items.length === 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}

/**
 * Get available slots for a specific date
 */
async function getAvailableSlots(date) {
  try {
    const workHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
    const availableSlots = [];
    
    for (const time of workHours) {
      const isAvailable = await checkAvailability(date, time);
      if (isAvailable) {
        availableSlots.push(time);
      }
    }
    
    return availableSlots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw error;
  }
}

/**
 * Create a new calendar event
 */
async function createEvent(data) {
  try {
    const { summary, description, date, time, email } = data;
    
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // +30 minutes
    
    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Rome'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Rome'
      },
      attendees: [{ email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 30 }
        ]
      }
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });
    
    return response.data;
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
    
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);
    
    const event = {
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Rome'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Rome'
      }
    };
    
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      resource: event,
      sendUpdates: 'all'
    });
    
    return response.data;
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
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all'
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

module.exports = {
  checkAvailability,
  getAvailableSlots,
  createEvent,
  updateEvent,
  deleteEvent
};
