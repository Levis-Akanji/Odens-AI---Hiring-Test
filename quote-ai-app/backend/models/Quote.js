const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  customerName: String,
  contact: String,
  email: String,
  title: String,
  reference: String,
  validUntil: Date,
  specifications: String,
  communication: String,
  files: [String],
  predictedPrice: Number,
  generatedQuoteText: String
});

module.exports = mongoose.model('Quote', quoteSchema);
