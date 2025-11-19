// Firebase configuration for direct connection
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBMxT3v0H5Q8J7YZH8d_2g5RxTxKmUH_wE",
  authDomain: "rover-6126b.firebaseapp.com",
  databaseURL: "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rover-6126b",
  storageBucket: "rover-6126b.firebasestorage.app",
  messagingSenderId: "874927384264",
  appId: "1:874927384264:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
