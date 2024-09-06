// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-Kvmv5HbHZtY5UQvb8OlO_D8Ipg8zm6E",
  authDomain: "web-shop-model.firebaseapp.com",
  projectId: "web-shop-model",
  storageBucket: "web-shop-model.appspot.com",
  messagingSenderId: "232308404854",
  appId: "1:232308404854:web:237a1f6547c4ea2687e557",
  measurementId: "G-8W6X5KLJD0"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
