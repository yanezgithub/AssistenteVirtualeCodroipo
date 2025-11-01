const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const serviceSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  office: {
    type: String,
    default: 'Ufficio Comunale'
  },
  hours: {
    type: String,
    default: 'Lunedì-Venerdì 9:00-13:00'
  },
  documents: [{
    type: String
  }],
  cost: {
    type: String,
    default: 'Gratuito'
  },
  processingTime: {
    type: String,
    default: 'Immediato'
  },
  faq: [faqSchema],
  bookingEnabled: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
serviceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
