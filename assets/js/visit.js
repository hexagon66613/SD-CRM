// Import Firebase config and Firestore functions
import { db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// Function to generate a sequential Visit ID
async function generateVisitID() {
  const visitsRef = collection(db, 'visits');
  const q = query(visitsRef, orderBy('Visit ID', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return 'SDV000000000001'; // Start with the initial ID
  } else {
    const lastDoc = querySnapshot.docs[0];
    const lastID = lastDoc.data()['Visit ID'];
    const lastIDNumber = parseInt(lastID.replace('SDV', ''), 10);
    if (isNaN(lastIDNumber)) {
      throw new Error(`Failed to parse Visit ID: ${lastID}`);
    }
    const newIDNumber = lastIDNumber + 1;
    const newID = `SDV${newIDNumber.toString().padStart(12, '0')}`;
    return newID;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const bookingSelect = $('#booking-id');
  const perawatanUtamaSelect = $('#perawatan-utama');
  const perawatanAddOn1Select = $('#perawatan-add-on-1');
  const perawatanAddOn2Select = $('#perawatan-add-on-2');
  const perawatanAddOn3Select = $('#perawatan-add-on-3');
  const perawatanAddOn4Select = $('#perawatan-add-on-4');
  const perawatanAddOn5Select = $('#perawatan-add-on-5');

  // Initialize Select2 on the dropdown elements
  bookingSelect.select2({
    placeholder: 'Select Booking ID',
    allowClear: true
  });
  perawatanUtamaSelect.select2({
    placeholder: 'Select Perawatan Utama',
    allowClear: true
  });
  perawatanAddOn1Select.select2({
    placeholder: 'Select Perawatan Add-On 1',
    allowClear: true
  });
  perawatanAddOn2Select.select2({
    placeholder: 'Select Perawatan Add-On 2',
    allowClear: true
  });
  perawatanAddOn3Select.select2({
    placeholder: 'Select Perawatan Add-On 3',
    allowClear: true
  });
  perawatanAddOn4Select.select2({
    placeholder: 'Select Perawatan Add-On 4',
    allowClear: true
  });
  perawatanAddOn5Select.select2({
    placeholder: 'Select Perawatan Add-On 5',
    allowClear: true
  });

  // Fetch Booking IDs and populate the dropdown
  async function fetchBookings() {
    try {
      const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsOptions = [];
      bookingsSnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsOptions.push({
          id: data['Booking ID'],
          text: `${data['Booking ID']} | ${data['Nama']}`
        });
      });
      bookingSelect.select2({
        data: bookingsOptions,
        placeholder: 'Select Booking ID',
        allowClear: true
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
    perawatanUtamaSelect.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan Utama',
      allowClear: true
    });
    perawatanAddOn1Select.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan Add-On 1',
      allowClear: true
    });
    perawatanAddOn2Select.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan Add-On 2',
      allowClear: true
    });
    perawatanAddOn3Select.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan Add-On 3',
      allowClear: true
    });
    perawatanAddOn4Select.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan Add-On 4',
      allowClear: true
    });
    perawatanAddOn5Select.select2({
      data: formattedOptions,
      placeholder: 'Select Perawatan Add-On 5',
      allowClear: true
    });
  }

  // Populate booking and perawatan dropdowns
  fetchBookings();
  initializePerawatanSelect();

  // Handle Booking ID selection
  bookingSelect.on('change', async function () {
    const selectedBookingID = $(this).val();
    if (selectedBookingID) {
      try {
        const bookingDoc = doc(db, 'bookings', selectedBookingID);
        const bookingData = await getDoc(bookingDoc);
        if (bookingData.exists()) {
          const data = bookingData.data();
          // Update the form with booking data
          $('#nama').text(data['Nama'] || '');
          $('#no-telp').text(data['No. telp'] || '');
          $('#booking-date').text(data['Booking Date'] || '');
          $('#booking-time').text(data['Booking Time'] || '');

          // Set the value for the other selects and trigger change
          perawatanUtamaSelect.val(data['Perawatan'] || '').trigger('change');
          $('#membership').val(data['Membership'] || '').trigger('change');

          // Update perawatan add-ons
          perawatanAddOn1Select.val(data['Perawatan Add-On 1'] || '').trigger('change');
          perawatanAddOn2Select.val(data['Perawatan Add-On 2'] || '').trigger('change');
          perawatanAddOn3Select.val(data['Perawatan Add-On 3'] || '').trigger('change');
          perawatanAddOn4Select.val(data['Perawatan Add-On 4'] || '').trigger('change');
          perawatanAddOn5Select.val(data['Perawatan Add-On 5'] || '').trigger('change');

          // Set Leads ID
          $('#leads-id').val(data['Leads ID'] || '');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    }
  });

  // Handle form submission
  $('#visit-form').on('submit', async function (event) {
    event.preventDefault();
    try {
      const visitID = await generateVisitID(); // Generate Visit ID upon form submission
      $('#visit-id').val(visitID);
      const formData = {
        'Visit ID': visitID,
        'Booking ID': $('#booking-id').val(),
        'Leads ID': $('#leads-id').val(),
        'Nama': $('#nama').text(),
        'No. telp': $('#no-telp').text(),
        'Perawatan Utama': $('#perawatan-utama').val(),
        'Membership': $('#membership').val(),
        'Booking Date': $('#booking-date').text(),
        'Booking Time': $('#booking-time').text(),
        'Perawatan Add-On 1': $('#perawatan-add-on-1').val(),
        'Perawatan Add-On 2': $('#perawatan-add-on-2').val(),
        'Perawatan Add-On 3': $('#perawatan-add-on-3').val(),
        'Perawatan Add-On 4': $('#perawatan-add-on-4').val(),
        'Perawatan Add-On 5': $('#perawatan-add-on-5').val(),
        'Total Bill': $('#total-bill').val(), // User-input Total Bill
      };
      // Save visit data to Firestore using Visit ID as document name
      await setDoc(doc(db, 'visits', visitID), formData);
      alert('Visit added successfully!');
      // Clear all fields after submission
      $('#visit-form').trigger('reset');
      $('#nama').text('');
      $('#no-telp').text('');
      $('#total-bill').val('');

      // Reset dropdowns
      bookingSelect.val(null).trigger('change');
      perawatanUtamaSelect.val(null).trigger('change');
      perawatanAddOn1Select.val(null).trigger('change');
      perawatanAddOn2Select.val(null).trigger('change');
      perawatanAddOn3Select.val(null).trigger('change');
      perawatanAddOn4Select.val(null).trigger('change');
      perawatanAddOn5Select.val(null).trigger('change');
      
      // Set a new Visit ID for the next entry
      $('#visit-id').val(await generateVisitID());
    } catch (error) {
      console.error('Error adding visit:', error);
      alert('Failed to add visit. Please try again.');
    }
  });

  // Format total bill input as IDR
  function formatIDR(value) {
    return 'IDR ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Add event listener to format input as IDR
  $('#total-bill').on('input', function() {
    let value = this.value.replace(/[^0-9]/g, '');
    this.value = formatIDR(value);
  });
});
