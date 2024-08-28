// Import Firebase config and Firestore functions
import { db } from './firebase-config.js';  // Import your Firebase config
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

$(document).ready(function() {
  // Initialize Select2 for Leads ID, Perawatan, and Klinik Tujuan fields
  const leadsSelect = $('#leads-id');
  const perawatanSelect = $('#perawatan');
  const klinikSelect = $('#klinik-tujuan');

  // Function to fetch and populate Leads ID dropdown
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

  // Populate Perawatan options
  function populatePerawatan() {
    const perawatanOptions = [
      'Behel Gigi', 'Bleaching', 'Bundling', 'Cabut Gigi', 'Cabut Gigi Bungsu', 
      'Gigi Palsu/Tiruan', 'Implant Gigi', 'Konsultasi', 'Kontrol Behel', 'Lainnya', 
      'Lepas Behel', 'Perawatan Anak', 'PSA', 'Scalling', 'Scalling add on', 
      'Tambal Gigi', 'Veneer', 'Retainer'
    ];
    const perawatanData = perawatanOptions.map(optionText => ({
      id: optionText,
      text: optionText
    }));
    perawatanSelect.select2({
      data: perawatanData,
      placeholder: 'Select Perawatan',
      allowClear: true
    });
  }

  // Populate Klinik Tujuan options
  function populateKlinik() {
    const klinikOptions = [
      'Pondok Bambu', 'Tanjung Duren', 'Bekasi', 'Semarang', 'Tiktok Leads', 
      'All', 'Bintaro', 'Website Retargeting', 'Kelapa Gading', 'Arteri', 
      'Kemang', 'BSD', 'Depok', 'Puri Indah', 'PIK', 'Gading Serpong', 
      'Sozo Kids', 'Mahasiswa', 'New', 'Behel Premium', 'Asuransi', 'Self Ligating'
    ];
    const klinikData = klinikOptions.map(optionText => ({
      id: optionText,
      text: optionText
    }));
    klinikSelect.select2({
      data: klinikData,
      placeholder: 'Select Klinik Tujuan',
      allowClear: true
    });
  }

  // Fetch Leads and populate dropdowns on document ready
  fetchLeads();
  populatePerawatan();
  populateKlinik();

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
          // Set Perawatan and Klinik values
          perawatanSelect.val(data.perawatan || '').trigger('change');
          klinikSelect.val(data.klinik || '').trigger('change');
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
        'Leads ID': $('#leads-id').val(), // Use Select2 value
        'Nama': document.getElementById('nama').textContent,
        'No. telp': document.getElementById('no-telp').textContent,
        'PIC Leads': document.getElementById('pic-leads').textContent,
        'Channel': document.getElementById('channel').textContent,
        'Leads From': document.getElementById('leads-from').textContent,
        'Perawatan': $('#perawatan').val(), // Use Select2 value
        'Membership': document.getElementById('membership').value,
        'Klinik Tujuan': $('#klinik-tujuan').val(), // Use Select2 value
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
      // Clear non-input fields
      document.getElementById('nama').textContent = '';
      document.getElementById('no-telp').textContent = '';
      document.getElementById('pic-leads').textContent = '';
      document.getElementById('channel').textContent = '';
      document.getElementById('leads-from').textContent = '';

      // Reset dropdowns
      leadsSelect.val(null).trigger('change'); // Reset Leads ID dropdown
      perawatanSelect.val(null).trigger('change'); // Reset Perawatan dropdown
      klinikSelect.val(null).trigger('change'); // Reset Klinik Tujuan dropdown

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
