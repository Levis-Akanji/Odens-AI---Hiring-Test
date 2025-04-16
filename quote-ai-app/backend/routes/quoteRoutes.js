const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const quoteController = require('../controllers/quoteController');

// ✅ GET all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    console.error('❌ Error fetching quotes:', err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// ✅ GET one quote by ID
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    console.error('❌ Error fetching quote:', err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// ✅ POST create quote (🛠️ uses real logic!)
router.post('/create', quoteController.createQuote);

// 🗑️ DELETE quote
router.delete('/:id', async (req, res) => {
  try {
    const result = await Quote.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting quote:', err);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// ✏️ Update quote text
router.put('/:id/update-text', async (req, res) => {
  try {
    const { generatedQuoteText } = req.body;
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { generatedQuoteText },
      { new: true }
    );
    res.json(updatedQuote);
  } catch (err) {
    console.error('❌ Error updating quote text:', err);
    res.status(500).json({ error: 'Failed to update quote text' });
  }
});

module.exports = router;
