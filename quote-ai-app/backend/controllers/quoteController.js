const Quote = require('../models/Quote');
const Customer = require('../models/Customer');
const predictPrice = require('../ai/predictPrice');
const generateQuoteText = require('../ai/generateQuoteText');

exports.createQuote = async (req, res) => {
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

    console.log('📥 Incoming quote request:', req.body);

    let customerName = '';
    let contact = '';
    let email = ''; // ✅ get from customer

    if (customerId) {
      const customer = await Customer.findById(customerId);

      if (!customer) {
        console.warn('⚠️ Customer not found for ID:', customerId);
      } else {
        console.log('✅ Found customer:', customer);
        customerName = customer.name || '';
        contact = customer.contact || '';
        email = customer.email || ''; // ✅ capture email
      }
    }

    const predictedPrice = await predictPrice(productData);
    console.log('💰 Predicted Price:', predictedPrice);

    const generatedQuoteText = await generateQuoteText({
      title,
      customerName,
      specifications,
      communication,
      predictedPrice
    });
    console.log('📄 Generated Quote Text:', generatedQuoteText);

    const parsedValidUntil = validUntil ? new Date(validUntil) : null;

    const newQuote = new Quote({
      customerId,
      customerName,
      contact,
      email, // ✅ save to DB
      title,
      reference,
      validUntil: parsedValidUntil,
      specifications,
      communication,
      productData,
      predictedPrice,
      generatedQuoteText,
      files
    });

    const savedQuote = await newQuote.save();
    console.log('✅ Quote saved:', savedQuote);

    res.json(savedQuote);
  } catch (error) {
    console.error('❌ Error creating quote:', error);
    res.status(500).json({ error: 'Could not create quote' });
  }
  
};
