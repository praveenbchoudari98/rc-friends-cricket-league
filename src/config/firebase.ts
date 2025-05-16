// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUkqrg-qAxMZuhx8b8jacoeumyJ3hqQEs",
  authDomain: "rc-friends-cricket-league.firebaseapp.com",
  databaseURL: "https://rc-friends-cricket-league-default-rtdb.firebaseio.com",
  projectId: "rc-friends-cricket-league",
  storageBucket: "rc-friends-cricket-league.firebasestorage.app",
  messagingSenderId: "4089791268",
  appId: "1:4089791268:web:d5521d8279bc0cbeade9b1",
  measurementId: "G-LFNK4VC488"
};

console.log('Initializing Firebase with project ID:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with detailed error logging
export const db = getFirestore(app);

// Test Firestore connection
console.log('Testing Firestore connection...');
getDocs(collection(db, 'tournaments'))
  .then(() => {
    console.log('✅ Firestore connection successful');
  })
  .catch((error) => {
    console.error('❌ Firestore connection failed:', error);
    if (error.code === 'permission-denied') {
      console.error('Please check Firestore security rules in the Firebase Console');
    }
  });

// Initialize Analytics only if supported
const initAnalytics = async () => {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  } catch (err) {
    console.warn('Analytics not supported:', err);
    return null;
  }
};

// Initialize analytics in the background
initAnalytics();

// Export the app instance
export default app;