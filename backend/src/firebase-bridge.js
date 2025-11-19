/**
 * Firebase to MongoDB Data Bridge
 * Fetches sensor data from Firebase Realtime Database and stores in MongoDB
 */

require('dotenv').config();
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const { SensorData } = require('./models');

// ==================== Firebase Admin Setup ====================
// Download your serviceAccountKey.json from Firebase Console
// Place it in: backend/firebase-service-account.json

const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://your-project.firebaseio.com"
});

const database = admin.database();

// ==================== MongoDB Connection ====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roadscan', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// ==================== Listen to Firebase Data ====================
const listenToFirebase = () => {
  console.log('\n=================================');
  console.log('Firebase → MongoDB Data Bridge');
  console.log('=================================');
  console.log('Listening for sensor data...\n');
  
  // Listen to the latest sensor data
  const ref = database.ref('/sensorData/latest');
  
  ref.on('value', async (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
      console.log('📡 New data received from Firebase:');
      console.log(JSON.stringify(data, null, 2));
      
      try {
        // Save to MongoDB
        const sensorData = new SensorData({
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
          gasLevel: data.gasLevel || 0,
          distance: data.distance || 0,
          timestamp: new Date()
        });
        
        await sensorData.save();
        console.log('✓ Data saved to MongoDB\n');
        
        // Check for gas alerts
        if (data.gasLevel > 300) {
          console.warn('⚠️  GAS ALERT! Level:', data.gasLevel, 'ppm\n');
        }
        
        // Check for obstacles
        if (data.distance < 20) {
          console.warn('⚠️  OBSTACLE DETECTED! Distance:', data.distance, 'cm\n');
        }
        
      } catch (error) {
        console.error('✗ Error saving to MongoDB:', error.message);
      }
    }
  }, (error) => {
    console.error('✗ Firebase read error:', error);
  });
};

// ==================== Start Service ====================
const start = async () => {
  await connectDB();
  listenToFirebase();
  
  console.log('Service is running...');
  console.log('Press Ctrl+C to stop.\n');
};

start();

// ==================== Graceful Shutdown ====================
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  database.goOffline();
  mongoose.connection.close();
  process.exit(0);
});
