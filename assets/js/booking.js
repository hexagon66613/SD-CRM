// Import Firebase config and Firestore functions
import { db } from './firebase-config.js';  // Import your Firebase config
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Function to generate a sequential Booking ID
async function generateBookingID() {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, orderBy('Booking ID', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return 'SDB000000000001'; // Start with the initial ID
  } else {
    const lastDoc = querySnapshot.docs[0];
    const lastID = lastDoc.data()['Booking ID'];

    const lastIDNumber = parseInt(lastID.replace('SDB', ''), 10);
    if (isNaN(lastIDNumber)) {
      throw new Error(`Failed to parse Booking ID: ${lastID}`);
    }

    const newIDNumber = lastIDNumber + 1;
    const newID = `SDB${newIDNumber.toString().padStart(12, '0')}`;
    return newID;
  }
}

// Function to fetch leads and populate the dropdown
async function fetchLeads() {
  const leadsSelect = document.getElementById('leads-id');
  try {
    const leadsSnapshot = await getDocs(collection(db, 'leads'));
    leadsSelect.innerHTML = '<option value="" disabled selected>Select Leads ID</option>';
    leadsSnapshot.forEach((doc) => {
      const data = doc.data();
      const option = document.createElement('option');
      option.value = data.leadsId; // The value used for processing
      option.textContent = `${data.leadsId} | ${data.leadName}`; // Display text in dropdown
      leadsSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
  }
}

// Update form fields with selected lead data
async function updateFormFields(selectedLeadsId) {
  if (selectedLeadsId) {
    try {
      const leadDoc = doc(db, 'leads', selectedLeadsId);
      const leadData = await getDoc(leadDoc);

      if (leadData.exists()) {
        const data = leadData.data();

        // Update the form with lead data
        document.getElementById('nama').value = data.leadName || '';
        document.getElementById('no-telp').value = data.leadPhone || '';
        document.getElementById('pic-leads').value = data.picLeads || '';
        document.getElementById('channel').value = data.channel || '';
        document.getElementById('leads-from').value = data.leadsFrom || '';

        // Update perawatan dropdown
        const perawatanSelect = document.getElementById('perawatan');
        perawatanSelect.innerHTML = '<option value="" disabled>Select Perawatan</option>'; // Clear previous options
        const perawatanOptions = [
          'Behel Gigi', 'Bleaching', 'Bundling', 'Cabut Gigi', 'Cabut Gigi Bungsu', 
          'Gigi Palsu/Tiruan', 'Implant Gigi', 'Konsultasi', 'Kontrol Behel', 'Lainnya', 
          'Lepas Behel', 'Perawatan Anak', 'PSA', 'Scalling', 'Scalling add on', 
          'Tambal Gigi', 'Veneer', 'Retainer'
        ];
        perawatanOptions.forEach(optionText => {
          const option = document.createElement('option');
          option.value = optionText;
          option.textContent = optionText;
          perawatanSelect.appendChild(option);
        });
        perawatanSelect.value = data.perawatan || '';
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const leadsSelect = document.getElementById('leads-id');

  // Fetch leads to populate the dropdown on page load
  await fetchLeads();

  // Handle Leads ID selection
  leadsSelect.addEventListener('change', (event) => {
    const selectedLeadsId = event.target.value;
    updateFormFields(selectedLeadsId);
  });

  // Handle form submission
  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const bookingID = await generateBookingID();
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
        'Membership': document.getElementById('membership').value,
        'Klinik Tujuan': document.getElementById('klinik-tujuan').value,
        'Nama Promo': document.getElementById('nama-promo').value,
        'Asuransi': document.getElementById('asuransi').value,
        'Booking Date': document.getElementById('booking-date').value,
        'Booking Time': document.getElementById('booking-time').value,
        'Doctor': document.getElementById('doctor').value,
      };
      // Save booking data to Firestore using Booking ID as document name
      await setDoc(doc(db, 'bookings', bookingID), formData);
      alert('Booking added successfully!');

      // Clear all fields after submission
      document.getElementById('booking-form').reset(); // Clear input fields
      document.getElementById('nama').value = '';
      document.getElementById('no-telp').value = '';
      document.getElementById('pic-leads').value = '';
      document.getElementById('channel').value = '';
      document.getElementById('leads-from').value = '';

      // Reset dropdowns
      leadsSelect.innerHTML = '<option value="" disabled selected>Select Leads ID</option>';
      const perawatanSelect = document.getElementById('perawatan');
      perawatanSelect.innerHTML = '<option value="" disabled>Select Perawatan</option>';

      // Fetch updated leads to repopulate dropdown
      await fetchLeads();

      // Set a new Booking ID for the next entry
      document.getElementById('booking-id').value = await generateBookingID();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add booking. Please try again.');
    }
  });

  // Set initial Booking ID
  document.getElementById('booking-id').value = await generateBookingID();
});
