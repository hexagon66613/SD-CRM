// Initialize Firebase (replace with your Firebase configuration)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

// Handle form submission for Leads
document.getElementById('leads-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('lead-name').value;
  const email = document.getElementById('lead-email').value;

  try {
    await addDoc(collection(db, 'leads'), { name, email });
    alert('Lead added successfully!');
    event.target.reset();
  } catch (e) {
    console.error('Error adding document: ', e);
    alert('Error adding lead.');
  }
});

// Handle form submission for Booking
document.getElementById('booking-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const leadId = document.getElementById('booking-id').value;
  const date = document.getElementById('booking-date').value;

  try {
    await addDoc(collection(db, 'bookings'), { leadId, date });
    alert('Booking added successfully!');
    event.target.reset();
  } catch (e) {
    console.error('Error adding document: ', e);
    alert('Error adding booking.');
  }
});

// Handle form submission for Visit
document.getElementById('visit-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const bookingId = document.getElementById('visit-id').value;
  const date = document.getElementById('visit-date').value;

  try {
    await addDoc(collection(db, 'visits'), { bookingId, date });
    alert('Visit added successfully!');
    event.target.reset();
  } catch (e) {
    console.error('Error adding document: ', e);
    alert('Error adding visit.');
  }
});
