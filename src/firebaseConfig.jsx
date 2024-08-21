// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "posting-mechanism.firebaseapp.com",
  projectId: "posting-mechanism",
  storageBucket: "posting-mechanism.appspot.com",
  messagingSenderId: "355601691711",
  appId: "1:355601691711:web:af338498abf0507cb2f48a",
  measurementId: "G-9JH931FVW6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
