import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Firebase configuration
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

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      // Query Firestore to find the user with the provided username and password
      const q = query(
        collection(db, 'users'),
        where('username', '==', username),
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User found
        const userDoc = querySnapshot.docs[0].data();
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('userId', querySnapshot.docs[0].id);
        sessionStorage.setItem('username', userDoc.username); // Store the real username
        sessionStorage.setItem('name', userDoc.name); // Store the name if needed

        window.location.href = 'index.html'; // Redirect to main menu page
      } else {
        alert('Invalid username or password.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Check your username and password.');
    }
  });
});
