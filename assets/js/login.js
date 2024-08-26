// assets/js/login.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getFirestore, query, where, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCidslTYtvEynEeZ9p46UuV5phZ8sliHk",
  authDomain: "sd-crm-4e151.firebaseapp.com",
  projectId: "sd-crm-4e151",
  storageBucket: "sd-crm-4e151.appspot.com",
  messagingSenderId: "346515488213",
  appId: "1:346515488213:web:e77b36da1732be1fb3515c",
  measurementId: "G-5XTC1W70QF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Query Firestore for user credentials
    const userQuery = query(collection(db, 'users'), where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      // User found
      localStorage.setItem('authenticated', 'true');
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    alert('An error occurred. Please try again.');
  }
});
