// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Import getAuth from firebase/auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAKQKu9-FJeT-17d9TYkt5VjTtn7-8qkK0',
  authDomain: 'ahliexpo-f19d0.firebaseapp.com',
  projectId: 'ahliexpo-f19d0',
  storageBucket: 'ahliexpo-f19d0.appspot.com',
  messagingSenderId: '592883602181',
  appId: '1:592883602181:web:dd997418e17047e43cdd6c'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
