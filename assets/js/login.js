// assets/js/login.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getFirestore, query, where, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
