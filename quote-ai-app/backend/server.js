// backend/server.js
require('dotenv').config(); // ✅ Only call this ONCE, at the VERY TOP!

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const quoteRoutes = require('./routes/quoteRoutes');
const emailRoutes = require('./routes/emailRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/email', emailRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/customers', customerRoutes);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ file: req.file.filename });
});

// Test route
app.get('/', (req, res) => res.send('Quote Automation System API Running'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
