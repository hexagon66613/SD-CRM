import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      // Query Firestore for the user document
      const userDoc = doc(db, 'users', username); // Assuming username is the document ID
      const docSnapshot = await getDoc(userDoc);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        // Check the password (assuming passwords are stored as plain text; otherwise, hash comparison is needed)
        if (userData.password === password) {
          // Generate a custom token for the user (needs to be implemented in backend)
          const customToken = await generateCustomToken(username); // Implement this function in your backend
          
          await signInWithCustomToken(auth, customToken);
          sessionStorage.setItem('authenticated', 'true');
          sessionStorage.setItem('username', username);
          window.location.href = 'index.html'; // Redirect to main menu
        } else {
          alert('Incorrect password.');
        }
      } else {
        alert('Username not found.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Failed to sign in. Please try again.');
    }
  });
});
