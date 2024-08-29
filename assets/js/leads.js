import { db, auth } from './firebase-config.js';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Generate a unique Leads ID
async function generateLeadsID() {
  const leadsRef = collection(db, 'leads');
  const q = query(leadsRef, orderBy('leadsId', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return 'SDL000000000001';
  } else {
    const lastDoc = querySnapshot.docs[0];
    const lastID = lastDoc.data().leadsId;

    const lastIDNumber = parseInt(lastID.replace('SDL', ''), 10);
    if (isNaN(lastIDNumber)) {
      throw new Error(`Failed to parse Leads ID: ${lastID}`);
    }

    const newIDNumber = lastIDNumber + 1;
    const newID = `SDL${newIDNumber.toString().padStart(12, '0')}`;
    return newID;
  }
}

// Populate dropdowns with usernames
async function populateUserDropdowns() {
  const picLeadsSelect = document.getElementById('pic-leads');
  const picClosedSelect = document.getElementById('pic-closed');

  if (!picLeadsSelect || !picClosedSelect) {
    console.error('Dropdown elements not found:', { picLeadsSelect, picClosedSelect });
    return;
  }

  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    picLeadsSelect.innerHTML = '<option value="Unassigned" selected>Unassigned</option>';
    picClosedSelect.innerHTML = '<option value="Unassigned">Unassigned</option>';

    if (querySnapshot.empty) {
      console.warn('No users found in the collection');
    }

    querySnapshot.forEach(doc => {
      const username = doc.data().username;
      if (username) {
        const option = document.createElement('option');
        option.value = username;
        option.textContent = username;
        picLeadsSelect.appendChild(option.cloneNode(true)); // Clone option for PIC Closed
        picClosedSelect.appendChild(option);
      } else {
        console.warn('User document missing "username" field:', doc.id);
      }
    });

    onAuthStateChanged(auth, user => {
      if (user) {
        const userEmail = user.email;
        picLeadsSelect.value = userEmail;
      }
    });
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
  }
}

// Save form data to Firestore
async function saveLeadsFormData(event) {
  event.preventDefault();

  const leadsId = document.getElementById('lead-id').value;
  const leadName = document.getElementById('lead-name').value || '';
  const leadPhone = document.getElementById('lead-phone').value || '';
  const picLeads = document.getElementById('pic-leads').value || 'Unassigned';
  const channel = document.getElementById('channel').value || '';
  const leadsFrom = document.getElementById('lead-from').value || '';
  const dateFirstChat = document.getElementById('date-first-chat').value || '';
  const dateCreated = document.getElementById('date-created').value;
  const perawatan = document.getElementById('perawatan').value || '';
  const l1Result = document.getElementById('l1-result').value || '';
  const l2Result = document.getElementById('l2-result').value || '';
  const l3Result = document.getElementById('l3-result').value || '';
  const remarks = document.getElementById('remarks').value || '';
  const picClosed = document.getElementById('pic-closed').value || 'Unassigned';
  const status = document.getElementById('lead-status').value || 'Open';

  console.log('Form data:', {
    leadsId, leadName, leadPhone, picLeads, channel, leadsFrom, dateFirstChat,
    dateCreated, perawatan, l1Result, l2Result, l3Result, remarks, picClosed, status
  });

  const leadsRef = doc(db, 'leads', leadsId);
  const docSnapshot = await getDoc(leadsRef);

  if (docSnapshot.exists()) {
    alert('Leads ID already exists. Please submit the form again to create a new lead.');
  } else {
    await setDoc(leadsRef, {
      leadsId,
      leadName,
      leadPhone,
      picLeads,
      channel,
      leadsFrom,
      dateFirstChat,
      dateCreated,
      perawatan,
      l1Result,
      l2Result,
      l3Result,
      remarks,
      picClosed,
      status
    });

    alert('Leads data saved successfully!');

    document.getElementById('leads-form').reset();
    document.getElementById('lead-id').value = await generateLeadsID();
    document.getElementById('date-created').value = new Date().toISOString().split('T')[0];
  }
}

// Initialize form and populate dropdowns
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  const picLeadsSelect = document.getElementById('pic-leads');
  const picClosedSelect = document.getElementById('pic-closed');
  const statusSelect = document.getElementById('lead-status');

  console.log('Dropdown elements at DOMContentLoaded:', {
    picLeadsSelect,
    picClosedSelect,
    statusSelect
  });

  document.getElementById('lead-id').value = await generateLeadsID();
  document.getElementById('date-created').value = new Date().toISOString().split('T')[0];

  statusSelect.value = 'Open';

  populateUserDropdowns();
  
  const form = document.getElementById('leads-form');
  if (form) {
    form.addEventListener('submit', saveLeadsFormData);
  } else {
    console.error('Form element not found.');
  }
});
