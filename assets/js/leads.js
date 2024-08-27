import { db, auth } from './firebase-config.js';  // Import the Firebase config
import { collection, addDoc, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

// Generate a unique Leads ID
async function generateLeadsID() {
  const leadsRef = collection(db, 'leads');
  const q = query(leadsRef, orderBy('leadsId', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return 'SD000000000001'; // Start with the initial ID
  } else {
    const lastDoc = querySnapshot.docs[0];
    const lastID = lastDoc.id; // Assuming document ID is used as Leads ID
    const lastIDNumber = parseInt(lastID.replace('SD', ''), 10);
    const newIDNumber = lastIDNumber + 1;
    return `SD${newIDNumber.toString().padStart(12, '0')}`;
  }
}

// Populate dropdowns with usernames
async function populateUserDropdowns() {
  const picLeadsSelect = document.getElementById('pic-leads');
  const picClosedSelect = document.getElementById('pic-closed');
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);

  // Clear previous options
  picLeadsSelect.innerHTML = '';
  picClosedSelect.innerHTML = '';

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
  const leadsId = document.getElementById('lead-id').value; // Updated ID
  const leadName = document.getElementById('lead-name').value;
  const leadPhone = document.getElementById('lead-phone').value;
  const picLeads = document.getElementById('pic-leads').value;
  const channel = document.getElementById('channel').value;
  const leadsFrom = document.getElementById('lead-from').value; // Updated ID
  const dateFirstChat = document.getElementById('date-first-chat').value;
  const dateCreated = document.getElementById('date-created').value;
  const perawatan = document.getElementById('perawatan').value;
  const l1Result = document.getElementById('l1-result').value;
  const l2Result = document.getElementById('l2-result').value;
  const l3Result = document.getElementById('l3-result').value;
  const remarks = document.getElementById('remarks').value;
  const picClosed = document.getElementById('pic-closed').value;

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
  document.getElementById('lead-id').value = leadsId; // Updated ID
  document.getElementById('date-created').value = new Date().toISOString().split('T')[0]; // Set current date
  populateUserDropdowns();
  document.getElementById('leads-form').addEventListener('submit', saveLeadsFormData);
});
