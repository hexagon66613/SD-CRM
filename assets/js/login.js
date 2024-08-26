import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('userId', user.uid);
      sessionStorage.setItem('username', username);
      window.location.href = 'index.html'; // Redirect to main menu page
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Check your username and password.');
    }
  });
});
