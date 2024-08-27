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

document.addEventListener('DOMContentLoaded', async () => {
  const leadsSelect = document.getElementById('leads-id');
  const perawatanSelect = document.getElementById('perawatan');

  // Store all leads data for filtering
  let allLeads = [];

  // Fetch leads IDs and populate the dropdown
  async function fetchLeads() {
    try {
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      leadsSelect.innerHTML = '<option value="" disabled selected>Select Leads ID</option>';
      allLeads = []; // Clear previous leads data
      leadsSnapshot.forEach((doc) => {
        const data = doc.data();
        allLeads.push(data); // Store lead data
        const option = document.createElement('option');
        option.value = data.leadsId; // The value used for processing
        option.textContent = `${data.leadsId} | ${data.leadName}`; // Display text in dropdown
        leadsSelect.appendChild(option);
      });

      // Initialize Select2 for leads dropdown
      $(leadsSelect).select2({
        placeholder: "Select Leads ID",
        allowClear: true,
        width: '100%'
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }

  // Fetch perawatan options
  async function fetchPerawatanOptions() {
    try {
      const perawatanSnapshot = await getDocs(collection(db, 'perawatan'));
      perawatanSelect.innerHTML = '<option value="" disabled selected>Select Perawatan</option>';
      perawatanSnapshot.forEach((doc) => {
        const data = doc.data();
        const option = document.createElement('option');
        option.value = data.perawatanName; // The value used for processing
        option.textContent = data.perawatanName; // Display text in dropdown
        perawatanSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching perawatan options:', error);
    }
  }

  // Function to handle lead selection
  async function handleLeadChange() {
    const selectedLeadId = leadsSelect.value;
    const selectedLead = allLeads.find(lead => lead.leadsId === selectedLeadId);

    if (selectedLead) {
      document.getElementById('nama').textContent = selectedLead.leadName;
      document.getElementById('no-telp').textContent = selectedLead.phoneNumber;
      document.getElementById('pic-leads').textContent = selectedLead.pic;
      document.getElementById('channel').textContent = selectedLead.channel;
      document.getElementById('leads-from').textContent = selectedLead.source;
    }
  }

  // Initialize form fields
  document.getElementById('booking-id').value = await generateBookingID();
  await fetchLeads();
  await fetchPerawatanOptions();

  // Event listener for lead selection
  leadsSelect.addEventListener('change', handleLeadChange);

  // Handle form submission
  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const bookingData = Object.fromEntries(formData.entries());

    try {
      await setDoc(doc(db, 'bookings', bookingData['booking-id']), bookingData);
      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking.');
    }
  });
});
