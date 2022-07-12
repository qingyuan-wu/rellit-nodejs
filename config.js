// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsknKugSsMKOZ83vMort57gjbXxODYlt8",
  authDomain: "summer22-sps-52.firebaseapp.com",
  projectId: "summer22-sps-52",
  storageBucket: "summer22-sps-52.appspot.com",
  messagingSenderId: "859550291312",
  appId: "1:859550291312:web:4f50dec2c0681d827f2bb5",
  measurementId: "G-M40FEV37T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);