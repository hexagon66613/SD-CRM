import { db } from './firebase-config.js';  // Import your Firebase config
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

$(document).ready(function() {
  // Initialize Select2 for the dropdowns
  $('#leads-id').select2({
    placeholder: "Select Leads ID",
    allowClear: true
  });

  $('#perawatan').select2({
    placeholder: "Select Perawatan",
    allowClear: true
  });

  $('#membership').select2({
    placeholder: "Select Yes/No",
    allowClear: true
  });

  $('#klinik-tujuan').select2({
    placeholder: "Select Klinik Tujuan",
    allowClear: true
  });

  $('#asuransi').select2({
    placeholder: "Select Yes/No",
    allowClear: true
  });
});

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

  async function fetchLeads() {
    try {
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      leadsSelect.empty().append('<option value="" disabled selected>Select Leads ID</option>'); // Clear and populate dropdown
      leadsSnapshot.forEach((doc) => {
        const data = doc.data();
        const option = $('<option></option>').val(data.leadsId).text(`${data.leadsId} | ${data.leadName}`);
        leadsSelect.append(option);
      });

      // Reinitialize Select2 after populating options
      leadsSelect.select2({
        placeholder: "Select Leads ID",
        allowClear: true
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }

  await fetchLeads();

  // Handle Leads ID selection
  leadsSelect.on('change', async () => {
    const selectedLeadsId = leadsSelect.val(); // This will be just the Leads ID
    console.log('Selected Leads ID:', selectedLeadsId);  // Debugging line
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
          const perawatanOptions = [
            'Behel Gigi', 'Bleaching', 'Bundling', 'Cabut Gigi', 'Cabut Gigi Bungsu', 
            'Gigi Palsu/Tiruan', 'Implant Gigi', 'Konsultasi', 'Kontrol Behel', 'Lainnya', 
            'Lepas Behel', 'Perawatan Anak', 'PSA', 'Scalling', 'Scalling add on', 
            'Tambal Gigi', 'Veneer', 'Retainer'
          ];
          perawatanSelect.empty().append('<option value="" disabled>Select Perawatan</option>');
          perawatanOptions.forEach(optionText => {
            const option = $('<option></option>').val(optionText).text(optionText);
            perawatanSelect.append(option);
          });
          perawatanSelect.val(data.perawatan || '').trigger('change');
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
      const bookingID = await generateBookingID();
      document.getElementById('booking-id').value = bookingID;

      const formData = {
        'Booking ID': bookingID,
        'Leads ID': leadsSelect.val(), // This should be just the Leads ID
        'Nama': $('#nama').text(),
        'No. telp': $('#no-telp').text(),
        'PIC Leads': $('#pic-leads').text(),
        'Channel': $('#channel').text(),
        'Leads From': $('#leads-from').text(),
        'Perawatan': perawatanSelect.val(),
        'Membership': $('#membership').val(),
        'Klinik Tujuan': $('#klinik-tujuan').val(),
        'Nama Promo': $('#nama-promo').val(),
        'Asuransi': $('#asuransi').val(),
        'Booking Date': $('#booking-date').val(),
        'Booking Time': $('#booking-time').val(),
        'Doctor': $('#doctor').val(),
      };

      // Save booking data to Firestore using Booking ID as document name
      await setDoc(doc(db, 'bookings', bookingID), formData);
      alert('Booking added successfully!');

      // Clear all fields after submission
      document.getElementById('booking-form').reset(); // Clear input fields
      $('#nama').text('');
      $('#no-telp').text('');
      $('#pic-leads').text('');
      $('#channel').text('');
      $('#leads-from').text('');
      perawatanSelect.empty().append('<option value="" disabled>Select Perawatan</option>').val(null).trigger('change');

      // Reset dropdowns
      leadsSelect.empty().append('<option value="" disabled selected>Select Leads ID</option>');

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
