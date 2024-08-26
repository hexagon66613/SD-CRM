import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const profileButton = document.getElementById('profileButton');
  const profileModal = document.getElementById('profileModal');
  const closeModal = profileModal?.querySelector('.close');
  const userNameDisplay = profileModal?.querySelector('#userName');
  const logoutButton = profileModal?.querySelector('#logoutButton');

  // Check authentication state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const username = userDoc.data().username;
        profileButton.textContent = `Profile (${username})`;
        
        profileButton.addEventListener('click', () => {
          profileModal.style.display = 'block';
        });
        closeModal.addEventListener('click', () => {
          profileModal.style.display = 'none';
        });
        logoutButton.addEventListener('click', () => {
          signOut(auth).then(() => {
            window.location.href = 'login.html'; // Redirect to login page
          }).catch((error) => {
            console.error('Error signing out:', error);
          });
        });
        userNameDisplay.textContent = `Username: ${username}`;
      } else {
        console.error('No user document found');
        window.location.href = 'login.html'; // Redirect if no user document
      }
    } else {
      // No user is signed in
      window.location.href = 'login.html';
    }
  });
});
