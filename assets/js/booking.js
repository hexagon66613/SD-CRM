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

  fetchLeads();

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
          document.getElementById('nama').textContent = data.leadName || '';
          document.getElementById('no-telp').textContent = data.leadPhone || '';
          document.getElementById('pic-leads').textContent = data.picLeads || '';
          document.getElementById('channel').textContent = data.channel || '';
          document.getElementById('leads-from').textContent = data.leadsFrom || '';
          
          // Update perawatan dropdown
          const perawatanSelect = document.getElementById('perawatan');
          perawatanSelect.innerHTML = '<option value="" disabled>Select Perawatan</option>';
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
          $(perawatanSelect).select2({
            placeholder: 'Select Perawatan',
            allowClear: true
          });
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
        'Leads ID': document.getElementById('leads-id').value,
        'Nama': document.getElementById('nama').textContent,
        'No. telp': document.getElementById('no-telp').textContent,
        'PIC Leads': document.getElementById('pic-leads').textContent,
        'Channel': document.getElementById('channel').textContent,
        'Leads From': document.getElementById('leads-from').textContent,
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
      document.getElementById('booking-form').reset();
      document.getElementById('nama').textContent = '';
      document.getElementById('no-telp').textContent = '';
      document.getElementById('pic-leads').textContent = '';
      document.getElementById('channel').textContent = '';
      document.getElementById('leads-from').textContent = '';

      // Reset dropdowns
      leadsSelect.val(null).trigger('change');
      const perawatanSelect = document.getElementById('perawatan');
      perawatanSelect.innerHTML = '<option value="" disabled>Select Perawatan</option>';
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
      $(perawatanSelect).select2({
        placeholder: 'Select Perawatan',
        allowClear: true
      });

      // Set a new Booking ID for the next entry
      document.getElementById('booking-id').value = await generateBookingID();
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add booking. Please try again.');
    }
  });
