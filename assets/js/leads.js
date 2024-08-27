import { db, auth } from './firebase-config.js';  // Import the Firebase config
import { collection, addDoc, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Generate a unique Leads ID
async function generateLeadsID() {
  const leadsRef = collection(db, 'leads');
  const q = query(leadsRef, orderBy('leadsId', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return 'SDL000000000001'; // Start with the initial ID
  } else {
    const lastDoc = querySnapshot.docs[0];
    const lastID = lastDoc.data().leadsId; // Fetching Leads ID from document data
    console.log(`Last Leads ID: ${lastID}`); // Debugging line

    const lastIDNumber = parseInt(lastID.replace('SDL', ''), 10);
    console.log(`Last ID Number: ${lastIDNumber}`); // Debugging line

    if (isNaN(lastIDNumber)) {
      throw new Error(`Failed to parse Leads ID: ${lastID}`);
    }

    const newIDNumber = lastIDNumber + 1;
    const newID = `SDL${newIDNumber.toString().padStart(12, '0')}`;
    console.log(`New Leads ID: ${newID}`); // Debugging line
    return newID;
  }
}

// Populate dropdowns with usernames
async function populateUserDropdowns() {
  const picLeadsSelect = document.getElementById('pic-leads');
  const picClosedSelect = document.getElementById('pic-closed');
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);

  // Clear previous options
  picLeadsSelect.innerHTML = '<option value="Unassigned">Unassigned</option>';
  picClosedSelect.innerHTML = '<option value="Unassigned">Unassigned</option>';

  // Populate options for both dropdowns
  querySnapshot.forEach(doc => {
    const username = doc.data().username;
    const option = document.createElement('option');
    option.value = username;
    option.textContent = username;
    picLeadsSelect.appendChild(option.cloneNode(true)); // Clone option for PIC Closed
    picClosedSelect.appendChild(option);
  });

  // Set the initial value for PIC Leads to the logged-in user
  onAuthStateChanged(auth, user => {
    if (user) {
      const userEmail = user.email; // Assuming you use email for authentication
      picLeadsSelect.value = userEmail;
    }
  });
}

// Save form data to Firestore
async function saveLeadsFormData(event) {
  event.preventDefault();

  const leadsId = document.getElementById('lead-id').value;
  const leadName = document.getElementById('lead-name').value || ''; // Allow blank values
  const leadPhone = document.getElementById('lead-phone').value || ''; // Allow blank values
  const picLeads = document.getElementById('pic-leads').value || 'Unassigned'; // Default to Unassigned
  const channel = document.getElementById('channel').value || ''; // Allow blank values
  const leadsFrom = document.getElementById('lead-from').value || ''; // Allow blank values
  const dateFirstChat = document.getElementById('date-first-chat').value || ''; // Allow blank values
  const dateCreated = document.getElementById('date-created').value; // Read-only
  const perawatan = document.getElementById('perawatan').value || ''; // Allow blank values
  const l1Result = document.getElementById('l1-result').value || ''; // Allow blank values
  const l2Result = document.getElementById('l2-result').value || ''; // Allow blank values
  const l3Result = document.getElementById('l3-result').value || ''; // Allow blank values
  const remarks = document.getElementById('remarks').value || ''; // Allow blank values
  const picClosed = document.getElementById('pic-closed').value || 'Unassigned'; // Default to Unassigned

  const leadsRef = collection(db, 'leads');
  await addDoc(leadsRef, {
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
  });

  alert('Leads data saved successfully!');
}

// Initialize form and populate dropdowns
document.addEventListener('DOMContentLoaded', async () => {
  const leadsId = await generateLeadsID();
  document.getElementById('lead-id').value = leadsId;
  document.getElementById('date-created').value = new Date().toISOString().split('T')[0]; // Set current date
  populateUserDropdowns();
  document.getElementById('leads-form').addEventListener('submit', saveLeadsFormData);
});
