document.addEventListener('DOMContentLoaded', async () => {
  const leadsSelect = $('#leads-id');
  const perawatanSelect = $('#perawatan');

  async function fetchLeads() {
    try {
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      leadsSelect.empty().append('<option value="" disabled selected>Select Leads ID</option>');
      leadsSnapshot.forEach((doc) => {
        const data = doc.data();
        const option = $('<option></option>').val(data.leadsId).text(`${data.leadsId} | ${data.leadName}`);
        leadsSelect.append(option);
      });
      leadsSelect.select2({
        placeholder: "Select Leads ID",
        allowClear: true
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }

  await fetchLeads();

  leadsSelect.on('change', async () => {
    const selectedLeadsId = leadsSelect.val();
    if (selectedLeadsId) {
      try {
        const leadDoc = doc(db, 'leads', selectedLeadsId);
        const leadData = await getDoc(leadDoc);
        if (leadData.exists()) {
          const data = leadData.data();

          // Ensure you're using the correct method to update form fields
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

  document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const bookingID = await generateBookingID();
      document.getElementById('booking-id').value = bookingID;

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
        'Klinik Tujuan': $('#klinik-tujuan').val(),
        'Nama Promo': $('#nama-promo').val(),
        'Asuransi': $('#asuransi').val(),
        'Booking Date': $('#booking-date').val(),
        'Booking Time': $('#booking-time').val(),
        'Doctor': $('#doctor').val(),
      };

      console.log('Form Data:', formData);

      await setDoc(doc(db, 'bookings', bookingID), formData);
      alert('Booking added successfully!');

      // Clear all fields after submission
      document.getElementById('booking-form').reset();
      $('#nama').text('');
      $('#no-telp').text('');
      $('#pic-leads').text('');
      $('#channel').text('');
      $('#leads-from').text('');
      perawatanSelect.empty().append('<option value="" disabled>Select Perawatan</option>').val(null).trigger('change');

      leadsSelect.empty().append('<option value="" disabled selected>Select Leads ID</option>');
      await fetchLeads();
      document.getElementById('booking-id').value = await generateBookingID();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to add booking. Please try again.');
    }
  });

  document.getElementById('booking-id').value = await generateBookingID();
});
