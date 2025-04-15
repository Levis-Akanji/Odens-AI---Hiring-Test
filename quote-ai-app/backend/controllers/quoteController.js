const Quote = require('../models/Quote');
const Customer = require('../models/Customer');
const predictPrice = require('../ai/predictPrice');
const generateQuoteText = require('../ai/generateQuoteText');

async function createQuote(req, res) {
  try {
    const {
      customerId,
      title,
      reference,
      validUntil,
      specifications,
      communication,
      productData,
      files
    } = req.body;

    // ✅ Fetch customer info
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // ✅ Predict price using AI
    const predictedPrice = await predictPrice(productData);

    // ✅ Generate quote text using GPT
    const generatedQuoteText = await generateQuoteText({
      customerName: customer.name,
      contact: customer.contact,
      title,
      reference,
      validUntil,
      specifications,
      communication,
      predictedPrice
    });

    // ✅ Create and save the quote
    const quote = new Quote({
      customerId,
      customerName: customer.name,
      contact: customer.contact,
      email: customer.email,
      title,
      reference,
      validUntil,
      specifications,
      communication,
      predictedPrice,
      generatedQuoteText,
      files
    });

    await quote.save();

    res.status(201).json(quote);

  } catch (err) {
    console.error('❌ Error creating quote:', err);
    res.status(500).json({ error: 'Failed to create quote' });
  }
}

module.exports = {
  createQuote
};
