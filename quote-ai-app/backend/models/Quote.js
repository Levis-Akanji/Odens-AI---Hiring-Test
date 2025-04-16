const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, required: false },
  contact: { type: String, required: false },
  title: String,
  reference: String,
  validUntil: Date,
  specifications: String,
  communication: String,
  productData: Object,
  predictedPrice: { type: Number, required: false },
  generatedQuoteText: { type: String, required: false },
  files: [String]
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Quote', quoteSchema);
