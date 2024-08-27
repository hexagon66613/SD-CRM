import { db } from './firebase-config.js';  // Import the Firebase config
import { collection, doc, getDoc, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

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
      console.log('Selected Lead ID:', selectedLeadId); // Debug log
      const leadsDoc = doc(db, 'leads', selectedLeadId);
      const leadData = await getDoc(leadsDoc);
      if (leadData.exists()) {
        const data = leadData.data();
        console.log('Lead Data:', data); // Debug log

        document.getElementById('nama').value = data['leadName'] || '';
        document.getElementById('no-telp').value = data['leadPhone'] || '';
        document.getElementById('pic-leads').value = data['picLeads'] || '';
        document.getElementById('channel').value = data['channel'] || '';
        document.getElementById('leads-from').value = data['leadsFrom'] || '';
        perawatanSelect.value = data['perawatan'] || '';
      } else {
        console.log('No data found for Lead ID:', selectedLeadId); // Debug log
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
      // Optionally reset the form
      document.getElementById('booking-form').reset();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add booking. Please try again.');
    }
  });
});
