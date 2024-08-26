import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    const profileButton = document.getElementById('profileButton');
    profileButton.style.display = 'block'; // Show profile button
    
    // Fetch username from Firestore
    try {
      const userDoc = doc(db, 'users', user.uid); // Adjust the collection name if necessary
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        document.getElementById('userName').textContent = `Username: ${userData.username || 'Unknown'}`;
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
