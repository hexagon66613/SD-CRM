import { db } from './firebase-config.js'; // Import the Firebase config
import { collection, doc, getDoc, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
  const leadsSelect = document.getElementById('leads-id');
  const perawatanSelect = document.getElementById('perawatan');

  // Populate Leads ID dropdown
  try {
    const leadsCollection = collection(db, 'leads');
    const leadsSnapshot = await getDocs(leadsCollection);
    leadsSnapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.id;
      leadsSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
  }

  // Populate Perawatan dropdown (assuming similar logic to Leads ID)
  // If "Perawatan" options are predefined, you can hard-code them or fetch them from Firestore
  const perawatanOptions = ['Option1', 'Option2', 'Option3']; // Replace with actual options
  perawatanOptions.forEach(optionText => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    perawatanSelect.appendChild(option);
  });

  // Handle Leads ID change
  leadsSelect.addEventListener('change', async (event) => {
    const selectedLeadId = event.target.value;
    if (selectedLeadId) {
      try {
        const leadsDoc = doc(db, 'leads', selectedLeadId);
        const leadData = await getDoc(leadsDoc);
        if (leadData.exists()) {
          const data = leadData.data();
          document.getElementById('nama').value = data['Nama'] || '';
          document.getElementById('no-telp').value = data['No. telp'] || '';
          document.getElementById('pic-leads').value = data['PIC Leads'] || '';
          document.getElementById('channel').value = data['Channel'] || '';
          document.getElementById('leads-from').value = data['Leads From'] || '';
          document.getElementById('perawatan').value = data['Perawatan'] || '';
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
      window.location.reload(); // Reload to clear form after submission
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add booking. Please try again.');
    }
  });
});
