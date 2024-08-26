import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

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
const firestore = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
  const authenticated = sessionStorage.getItem('authenticated');
  const profileButton = document.getElementById('profileButton');
  const profileModal = document.getElementById('profileModal');
  const closeModal = profileModal.querySelector('.close');
  const userNameDisplay = profileModal.querySelector('#userName');
  const logoutButton = profileModal.querySelector('#logoutButton');

  if (!authenticated) {
    window.location.href = 'login.html'; // Redirect to login page if not authenticated
    return;
  }

  profileButton.addEventListener('click', () => {
    profileModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    window.location.href = 'login.html'; // Redirect to login page after logout
  });

  // Display username in the modal
  const username = sessionStorage.getItem('username');
  if (username) {
    userNameDisplay.textContent = `Username: ${username}`;
  } else {
    userNameDisplay.textContent = 'Not logged in';
  }
});
