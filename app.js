// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

// Handle form submissions
document.getElementById('lead-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('lead-name').value;
  const email = document.getElementById('lead-email').value;
  const phone = document.getElementById('lead-phone').value;
  try {
    const docRef = await addDoc(collection(db, 'leads'), { name, email, phone });
    alert('Lead added with ID: ' + docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
});

document.getElementById('booking-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const leadId = document.getElementById('booking-lead-id').value;
  const date = document.getElementById('booking-date').value;
  const details = document.getElementById('booking-details').value;
  try {
    const docRef = await addDoc(collection(db, 'bookings'), { leadId, date, details });
    alert('Booking added with ID: ' + docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
});

document.getElementById('visit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const bookingId = document.getElementById('visit-booking-id').value;
  const visitDate = document.getElementById('visit-date').value;
  const notes = document.getElementById('visit-notes').value;
  try {
    const docRef = await addDoc(collection(db, 'visits'), { bookingId, visitDate, notes });
    alert('Visit added with ID: ' + docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
});
