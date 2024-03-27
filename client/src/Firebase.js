// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-yt.firebaseapp.com",
  projectId: "mern-blog-yt",
  storageBucket: "mern-blog-yt.appspot.com",
  messagingSenderId: "1052321694814",
  appId: "1:1052321694814:web:eb2c2af45f9785008f60cf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
