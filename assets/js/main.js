import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Check if user is authenticated
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, display the profile button with username
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const username = userDoc.data().username;
      document.getElementById('profileButton').textContent = `Profile (${username})`;
    }
  } else {
    // No user is signed in, redirect to login page
    window.location.href = 'login.html';
  }
});

// Handle profile button click
document.getElementById('profileButton').addEventListener('click', () => {
  signOut(auth).then(() => {
    // Sign-out successful, redirect to login page
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
});
