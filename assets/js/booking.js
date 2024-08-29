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
  const leadsSelect = $('#leads-id');
  const perawatanSelect = $('#perawatan');
  const klinikSelect = $('#klinik-tujuan');

  // Fetch leads IDs and populate the dropdown
  async function fetchLeads() {
    try {
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      const leadsOptions = [];
      leadsSnapshot.forEach((doc) => {
        const data = doc.data();
        leadsOptions.push({
          id: data.leadsId,
          text: `${data.leadsId} | ${data.leadName}`
        });
      });
      leadsSelect.select2({
        data: leadsOptions,
        placeholder: 'Select Leads ID',
        allowClear: true
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }

  // Fetch perawatan options and initialize Select2
  async function initializePerawatanSelect() {
    const perawatanOptions = [
      'Behel Gigi', 'Bleaching', 'Bundling', 'Cabut Gigi', 'Cabut Gigi Bungsu',
      'Gigi Palsu/Tiruan', 'Implant Gigi', 'Konsultasi', 'Kontrol Behel', 'Lainnya',
      'Lepas Behel', 'Perawatan Anak', 'PSA', 'Scalling', 'Scalling add on',
      'Tambal Gigi', 'Veneer', 'Retainer'
    ];
    const formattedOptions = perawatanOptions.map(option => ({ id: option, text: option }));
    perawatanSelect.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan',
      allowClear: true
    });
  }

  // Fetch klinik options and initialize Select2
  async function initializeKlinikSelect() {
    const klinikOptions = [
      'Klinik A', 'Klinik B', 'Klinik C' // Replace these with actual clinic names
    ];
    const formattedOptions = klinikOptions.map(option => ({ id: option, text: option }));
    klinikSelect.select2({
      data: formattedOptions,
      placeholder: 'Select Klinik Tujuan',
      allowClear: true
    });
  }

  // Fetch data for dropdowns
  fetchLeads();
  await initializePerawatanSelect();
  await initializeKlinikSelect(); // Initialize Klinik Tujuan

  // Handle Leads ID selection
  leadsSelect.on('change', async function () {
    const selectedLeadsId = $(this).val();
    if (selectedLeadsId) {
      try {
        const leadDoc = doc(db, 'leads', selectedLeadsId);
        const leadData = await getDoc(leadDoc);
        if (leadData.exists()) {
          const data = leadData.data();
          // Update the form with lead data
          $('#nama').text(data.leadName || '');
          $('#no-telp').text(data.leadPhone || '');
          $('#pic-leads').text(data.picLeads || '');
          $('#channel').text(data.channel || '');
          $('#leads-from').text(data.leadsFrom || '');

          // Update perawatan dropdown
          const perawatanValue = data.perawatan || ''; // Ensure 'perawatan' field exists
          perawatanSelect.val(perawatanValue).trigger('change'); // Set the value and trigger change
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching lead data:', error);
      }
    }
  });

  // Handle form submission
  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      // Generate new Booking ID upon form submission
      const bookingID = await generateBookingID();
      
      const formData = {
        'Booking ID': bookingID,
        'Leads ID': leadsSelect.val(),
        'Nama': $('#nama').text(),
        'No. telp': $('#no-telp').text(),
        'PIC Leads': $('#pic-leads').text(),
        'Channel': $('#channel').text(),
        'Leads From': $('#leads-from').text(),
        'Perawatan': perawatanSelect.val(),
        'Membership': $('#membership').val(),
        'Klinik Tujuan': klinikSelect.val(),
        'Nama Promo': $('#nama-promo').val(),
        'Asuransi': $('#asuransi').val(),
        'Booking Date': $('#booking-date').val(),
        'Booking Time': $('#booking-time').val(),
        'Doctor': $('#doctor').val(),
      };
      
      await setDoc(doc(db, 'bookings', bookingID), formData);
      alert('Booking added successfully!');
      
      // Reset form and fields
      document.getElementById('booking-form').reset();
      $('#nama').text('');
      $('#no-telp').text('');
      $('#pic-leads').text('');
      $('#channel').text('');
      $('#leads-from').text('');

      // Reset dropdowns
      leadsSelect.val(null).trigger('change');
      perawatanSelect.val(null).trigger('change');
      klinikSelect.val(null).trigger('change'); // Reset Klinik Tujuan
      
      // Set a new Booking ID for the next entry
      document.getElementById('booking-id').value = await generateBookingID();
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add booking. Please try again.');
    }
  });
});
