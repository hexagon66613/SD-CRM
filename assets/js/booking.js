import { db } from './firebase-config.js';  // Import the Firebase config
import { collection, doc, getDoc, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
  const leadsSelect = document.getElementById('leads-id');
  const perawatanSelect = document.getElementById('perawatan');

  // Populate Leads ID dropdown
  try {
    const leadsCollectionRef = collection(db, 'leads');
    const leadsSnapshot = await getDocs(leadsCollectionRef);
    leadsSnapshot.forEach((doc) => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.id;
      leadsSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
  }

  // Handle Leads ID change
  leadsSelect.addEventListener('change', async (event) => {
    const selectedLeadId = event.target.value;
    if (selectedLeadId) {
      console.log('Selected Lead ID:', selectedLeadId); // Debug log
      try {
        const leadDocRef = doc(db, 'leads', selectedLeadId);
        const leadDoc = await getDoc(leadDocRef);
        if (leadDoc.exists()) {
          const data = leadDoc.data();
          console.log('Lead Data:', data); // Debug log

          // Update label fields
          document.getElementById('nama').textContent = data.leadName || '';
          document.getElementById('no-telp').textContent = data.leadPhone || '';
          document.getElementById('pic-leads').textContent = data.picLeads || '';
          document.getElementById('channel').textContent = data.channel || '';
          document.getElementById('leads-from').textContent = data.leadsFrom || '';

          // Update perawatan dropdown
          perawatanSelect.innerHTML = ''; // Clear previous options
          const perawatanOptions = ['Cabut Gigi Bungsu', 'Bundling', 'Scaling', 'Perawatan Gigi Lainnya'];
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
