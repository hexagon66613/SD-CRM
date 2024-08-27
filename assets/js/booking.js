import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

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

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', async () => {
  const leadsSelect = document.getElementById('leads-id');
  const perawatanSelect = document.getElementById('perawatan');

  // Populate Leads ID dropdown
  const leadsCollection = collection(db, 'leads');
  const leadsSnapshot = await getDocs(leadsCollection);
  leadsSnapshot.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.id;
    leadsSelect.appendChild(option);
  });

  // Handle Leads ID change
  leadsSelect.addEventListener('change', async (event) => {
    const selectedLeadId = event.target.value;
    if (selectedLeadId) {
      const leadsDoc = doc(db, 'leads', selectedLeadId);
      const leadData = await getDoc(leadsDoc);
      if (leadData.exists()) {
        const data = leadData.data();
        document.getElementById('nama').value = data['Nama'] || '';
        document.getElementById('no-telp').value = data['No. telp'] || '';
        document.getElementById('pic-leads').value = data['PIC Leads'] || '';
        document.getElementById('channel').value = data['Channel'] || '';
        document.getElementById('leads-from').value = data['Leads From'] || '';
        perawatanSelect.value = data['Perawatan'] || '';
      }
    }
  });

  // Handle form submission
  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const bookingID = `SDB${Date.now()}`;
    document.getElementById('booking-id').value = bookingID;

    const formData = {
      'Booking ID': bookingID,
      'Leads ID': document.getElementById('leads-id').value,
      'Nama': document.getElementById('nama').value,
      'No. telp': document.getElementById('no-telp').value,
      'PIC Leads': document.getElementById('pic-leads').value,
      'Channel': document.getElementById('channel').value,
      'Leads From': document.getElementById('leads-from').value,
      'Perawatan': document.getElementById('perawatan').value,
      '7R Membership': document.getElementById('membership').value,
      'Klinik Tujuan': document.getElementById('klinik-tujuan').value,
      'Nama Promo': document.getElementById('nama-promo').value,
      'Asuransi': document.getElementById('asuransi').value,
      'Booking Date': document.getElementById('booking-date').value,
      'Booking Time': document.getElementById('booking-time').value,
      'Doctor': document.getElementById('doctor').value,
    };

    try {
      await addDoc(collection(db, 'bookings'), formData);
      alert('Booking added successfully!');
      // Redirect to create a new booking form
      window.location.reload();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add booking. Please try again.');
    }
  });
});
