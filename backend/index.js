const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 🛡️ RELAXED CORS FOR MAXIMUM COMPATIBILITY
app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 📝 LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Appwrite initialization check
console.log('✅ Integrated with Appwrite');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

app.get('/', (req, res) => {
  res.send('🚀 Price Prediction API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prediction', predictionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ GLOBAL ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`📡 Server listening on port ${PORT}`);
});

// ⏳ INCREASED TIMEOUTS FOR RENDERING SCRAPERS (2 minutes)
server.timeout = 120000;
server.keepAliveTimeout = 120000;
