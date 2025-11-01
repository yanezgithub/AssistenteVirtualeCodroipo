const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ name: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Error fetching services' });
  }
});

// GET service by code
router.get('/:code', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      code: req.params.code.toUpperCase(),
      active: true 
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Error fetching service' });
  }
});

// POST create new service (admin only - add auth middleware in production)
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ error: 'Error creating service', details: error.message });
  }
});

// PUT update service
router.put('/:code', async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ error: 'Error updating service' });
  }
});

// DELETE service (soft delete)
router.delete('/:code', async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      { active: false },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Error deleting service' });
  }
});

module.exports = router;
