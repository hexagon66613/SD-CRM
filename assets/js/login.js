import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, query, collection, where, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Enable Firebase debug logging
import { setLogLevel } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
setLogLevel('debug');

// Initialize Firebase
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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const userQuery = query(collection(db, 'users'), where('username', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      sessionStorage.setItem('authenticated', 'true');
      sessionStorage.setItem('userId', userDoc.id); // Store user ID
      sessionStorage.setItem('username', userDoc.data().username); // Store username
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    alert('An error occurred. Please try again.');
  }
});
