import { db } from './firebase-config.js';  // Import your Firebase config
import { doc, getDoc, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const leadsSelect = document.getElementById('leads-id');
  const perawatanSelect = document.getElementById('perawatan');
  // Fetch leads IDs and populate the dropdown
  async function fetchLeads() {
    try {
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      leadsSelect.innerHTML = '<option value="" disabled selected>Select Leads ID</option>';
      leadsSnapshot.forEach((doc) => {
        const data = doc.data();
        const option = document.createElement('option');
        option.value = data.leadsId;
        option.textContent = data.leadsId;
        leadsSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }
  fetchLeads();
  // Handle Leads ID selection
  leadsSelect.addEventListener('change', async () => {
    const selectedLeadsId = leadsSelect.value;
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
  });
  // Handle form submission
  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const bookingID = `SDB${Date.now()}`;
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
    try {
      await addDoc(collection(db, 'bookings'), formData);
      alert('Booking added successfully!');
      // Optionally reset the form
      document.getElementById('booking-form').reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add booking. Please try again.');
    }
  });
});
