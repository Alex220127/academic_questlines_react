// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF4c-BZgKgpGOl6vWRzPtsC3eNBnf-esQ",
  authDomain: "projetoalan-3e501.firebaseapp.com",
  projectId: "projetoalan-3e501",
  storageBucket: "projetoalan-3e501.firebasestorage.app",
  messagingSenderId: "521259884550",
  appId: "1:521259884550:web:5357be307f08d401762387"
};

// Initialize Firebase
export const initializeFirebase = () => {
  initializeApp(firebaseConfig)
}
