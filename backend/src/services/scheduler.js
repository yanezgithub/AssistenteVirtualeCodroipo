const cron = require('node-cron');
const Booking = require('../models/Booking');
const emailService = require('./email');

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running reminder check...');
  
  try {
    // Get tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    
    // Find bookings for tomorrow that haven't received reminder
    const bookings = await Booking.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfter
      },
      status: { $in: ['pending', 'confirmed'] },
      reminderSent: false
    });
    
    console.log(`Found ${bookings.length} bookings needing reminders`);
    
    // Send reminders
    for (const booking of bookings) {
      try {
        await emailService.sendReminder(booking);
        booking.reminderSent = true;
        await booking.save();
        console.log(`Reminder sent for booking ${booking._id}`);
      } catch (error) {
        console.error(`Error sending reminder for booking ${booking._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in reminder scheduler:', error);
  }
});

console.log('📧 Reminder scheduler initialized');

module.exports = {};
