import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

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
const db = getFirestore(app);

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    document.getElementById('profileButton').style.display = 'block'; // Show profile button
    document.getElementById('userName').textContent = `Username: ${user.displayName || 'Unknown'}`;
  } else {
    // No user is signed in
    document.getElementById('profileButton').style.display = 'none'; // Hide profile button
    window.location.href = 'login.html'; // Redirect to login page
  }
});

// Profile Modal Management
document.addEventListener('DOMContentLoaded', () => {
  const profileButton = document.getElementById('profileButton');
  const profileModal = document.getElementById('profileModal');
  const closeModal = profileModal.querySelector('.close');
  const logoutButton = profileModal.querySelector('#logoutButton');

  profileButton.addEventListener('click', () => {
    profileModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      window.location.href = 'login.html'; // Redirect to login page
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  });
});
