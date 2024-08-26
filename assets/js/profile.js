// assets/js/profile.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

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

const profileButton = document.getElementById('profileButton');
const profileModal = document.getElementById('profileModal');
const closeButton = document.querySelector('.close');
const userNameDisplay = document.getElementById('userName');
const logoutButton = document.getElementById('logoutButton');

// Show profile modal
profileButton.addEventListener('click', async () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      userNameDisplay.textContent = `Welcome, ${userData.username}`;
    } else {
      userNameDisplay.textContent = 'User not found';
    }
  } else {
    userNameDisplay.textContent = 'No user ID found';
  }

  profileModal.style.display = 'block';
});

// Hide profile modal
closeButton.addEventListener('click', () => {
  profileModal.style.display = 'none';
});

// Log out
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('authenticated');
  localStorage.removeItem('userId');
  window.location.href = 'login.html';
});

// Close modal if user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    profileModal.style.display = 'none';
  }
});
