// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";


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
const analytics = getAnalytics(app);
export const db = getDatabase(app);
