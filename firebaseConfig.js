import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';


// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm0rPOe0XC_cYy0hfYYemCTLmHhg_tQ4A",
  authDomain: "pure-47708.firebaseapp.com",
  databaseURL: "https://pure-47708-default-rtdb.firebaseio.com",
  projectId: "pure-47708",
  storageBucket: "pure-47708.firebasestorage.app",
  messagingSenderId: "1064028614844",
  appId: "1:1064028614844:web:09ab13abf3fe4a6e4720b9",
  measurementId: "G-8NKQN8CBDQ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize Firebase authentication and realtime database
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getDatabase(app);
export {app, db, auth };
