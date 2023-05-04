// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEhJAp2nWa_cNugoT1vh3ntUMM-qGxN7A",
  authDomain: "webcrawling-81bbb.firebaseapp.com",
  databaseURL: "https://webcrawling-81bbb-default-rtdb.firebaseio.com",
  projectId: "webcrawling-81bbb",
  storageBucket: "webcrawling-81bbb.appspot.com",
  messagingSenderId: "335923959824",
  appId: "1:335923959824:web:cd6803f39dfe6c3ccc9295",
  measurementId: "G-NTNF9HFF76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app)

export {
    db
}

const analytics = getAnalytics(app);