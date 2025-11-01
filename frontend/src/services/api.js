import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Services
  async getServices() {
    const response = await api.get('/services');
    return response.data;
  },

  async getService(code) {
    const response = await api.get(`/services/${code}`);
    return response.data;
  },

  // Bookings
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getBookings(params = {}) {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  async getBooking(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Calendar
  async checkAvailability(date, time) {
    const response = await api.post('/calendar/check', { date, time });
    return response.data;
  },

  async getAvailableSlots(date) {
    const response = await api.get(`/calendar/slots/${date}`);
    return response.data.slots;
  }
};
