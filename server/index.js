const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables FIRST
dotenv.config();

// Import database AFTER environment variables are loaded
const db = require('./config/database');
const fileStorageService = require('./services/fileStorageService');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase Admin SDK
let firebaseApp;
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY && process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== '{"type":"service_account","project_id":"your-project-id",...}') {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    console.log('Firebase features will be disabled.');
  }
} else {
  console.log('Firebase service account key not configured. Firebase features will be disabled.');
}

// Make database and file storage available globally for routes
app.locals.db = db;
app.locals.fileStorage = fileStorageService;

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected',
    firebase: firebaseApp ? 'Initialized' : 'Not initialized'
  });
});

// Import and use routes
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const billingRoutes = require('./routes/billing');
const driversRoutes = require('./routes/drivers');
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/drivers', driversRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize file storage and start server
async function startServer() {
  try {
    await fileStorageService.initializeBuckets();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

startServer();
