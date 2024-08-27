// Import Firebase config and Firestore functions
import { db } from './firebase-config.js';  // Import the Firebase config
import { collection, doc, setDoc, getDocs, query, orderBy, limit, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Generate a sequential Booking ID
async function generateBookingID() {
  const bookingsRef = collection(db, 'bookings');
  const q = query(bookingsRef, orderBy('bookingId', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return 'SDB000000000001'; // Start with the initial ID
  } else {
    const lastDoc = querySnapshot.docs[0];
    const lastID = lastDoc.data().bookingId; // Fetching Booking ID from document data

    const lastIDNumber = parseInt(lastID.replace('SDB', ''), 10);
    if (isNaN(lastIDNumber)) {
      throw new Error(`Failed to parse Booking ID: ${lastID}`);
    }

    const newIDNumber = lastIDNumber + 1;
    const newID = `SDB${newIDNumber.toString().padStart(12, '0')}`;
    return newID;
  }
}

// Populate dropdowns with users or any other data
async function populateDropdowns() {
  const picLeadsSelect = document.getElementById('pic-leads');
  const perawatanSelect = document.getElementById('perawatan');
  const leadsIdSelect = document.getElementById('leads-id'); // Dropdown for Leads ID
  
  // Example users dropdown
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);

  // Clear previous options
  picLeadsSelect.innerHTML = '<option value="Unassigned">Unassigned</option>';

  // Populate options for PIC Leads dropdown
  querySnapshot.forEach(doc => {
    const username = doc.data().username;
    const option = document.createElement('option');
    option.value = username;
    option.textContent = username;
    picLeadsSelect.appendChild(option);
  });

  // Example options for Perawatan dropdown
  const perawatanOptions = [
    "Behel Gigi", "Bleaching", "Bundling", "Cabut Gigi", "Cabut Gigi Bungsu",
    "Gigi Palsu/Tiruan", "Implant Gigi", "Konsultasi", "Kontrol Behel", "Lainnya",
    "Lepas Behel", "Perawatan Anak", "PSA", "Scalling", "Scalling add on",
    "Tambal Gigi", "Veneer", "Retainer"
  ];

  // Clear previous options
  perawatanSelect.innerHTML = '<option value="" disabled selected>Select Perawatan</option>';

  // Populate options for Perawatan dropdown
  perawatanOptions.forEach(optionText => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    perawatanSelect.appendChild(option);
  });

  // Populate Leads ID dropdown
  const leadsRef = collection(db, 'leads');
  const leadsQuery = query(leadsRef, orderBy('leadsId'));
  const leadsSnapshot = await getDocs(leadsQuery);

  // Clear previous options
  leadsIdSelect.innerHTML = '<option value="" disabled selected>Select Leads ID</option>';

  // Populate options for Leads ID dropdown
  leadsSnapshot.forEach(doc => {
    const leadsId = doc.data().leadsId;
    const option = document.createElement('option');
    option.value = leadsId;
    option.textContent = leadsId;
    leadsIdSelect.appendChild(option);
  });
}

// Save booking form data to Firestore
async function saveBookingFormData(event) {
  event.preventDefault();

  const bookingId = document.getElementById('booking-id').value;
  const leadsId = document.getElementById('leads-id').value;
  const nama = document.getElementById('nama').innerText || ''; // Using innerText for display-only fields
  const noTelp = document.getElementById('no-telp').innerText || ''; // Using innerText for display-only fields
  const picLeads = document.getElementById('pic-leads').value || 'Unassigned'; // Default to Unassigned
  const channel = document.getElementById('channel').innerText || ''; // Using innerText for display-only fields
  const leadsFrom = document.getElementById('leads-from').innerText || ''; // Using innerText for display-only fields
  const perawatan = document.getElementById('perawatan').value || ''; // From dropdown
  const membership = document.getElementById('membership').value || ''; // Dropdown value
  const klinikTujuan = document.getElementById('klinik-tujuan').value || ''; // Dropdown value
  const namaPromo = document.getElementById('nama-promo').value || ''; // Text input
  const asuransi = document.getElementById('asuransi').value || ''; // Dropdown value
  const bookingDate = document.getElementById('booking-date').value; // Date input
  const bookingTime = document.getElementById('booking-time').value; // Time input
  const doctor = document.getElementById('doctor').value || ''; // Text input

  const bookingRef = doc(db, 'bookings', bookingId); // Use Booking ID as the document ID
  const docSnapshot = await getDoc(bookingRef);

  if (docSnapshot.exists()) {
    alert('Booking ID already exists. Please submit the form again to create a new booking.');
  } else {
    await setDoc(bookingRef, {
      bookingId,
      leadsId,
      nama,
      noTelp,
      picLeads,
      channel,
      leadsFrom,
      perawatan,
      membership,
      klinikTujuan,
      namaPromo,
      asuransi,
      bookingDate,
      bookingTime,
      doctor,
    });

    alert('Booking data saved successfully!');

    // Reset form and reload the page
    document.getElementById('booking-form').reset();
    document.getElementById('booking-id').value = await generateBookingID(); // Generate new ID
    document.getElementById('leads-id').value = ''; // Reset Leads ID dropdown
  }
}

// Initialize form and populate dropdowns
document.addEventListener('DOMContentLoaded', async () => {
  const bookingId = await generateBookingID();
  document.getElementById('booking-id').value = bookingId;
  populateDropdowns();
  document.getElementById('booking-form').addEventListener('submit', saveBookingFormData);
});
