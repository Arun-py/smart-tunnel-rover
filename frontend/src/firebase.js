// Firebase configuration for direct connection
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAbsngu27x5C2Nv_wzoD2WeZmNF4eW84V0",
  authDomain: "rover-6126b.firebaseapp.com",
  databaseURL: "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rover-6126b",
  storageBucket: "rover-6126b.firebasestorage.app",
  messagingSenderId: "874927384264",
  appId: "1:874927384264:web:c2163701362b63dbeea7fd",
  measurementId: "G-8BT7GD38TN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
