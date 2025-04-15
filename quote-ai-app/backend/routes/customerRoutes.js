const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create a new customer
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received body:', req.body);
    
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error('❌ Error creating customer:', err);
    res.status(400).json({ error: 'Could not create customer' });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch customers' });
  }
});

module.exports = router;
