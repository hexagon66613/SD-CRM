// assets/js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const profileButton = document.getElementById('profileButton');
  const profileModal = document.getElementById('profileModal');
  const closeModal = profileModal.querySelector('.close');
  const userNameDisplay = profileModal.querySelector('#userName');
  const logoutButton = profileModal.querySelector('#logoutButton');

  profileButton.addEventListener('click', () => {
    profileModal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userId');
    window.location.href = 'login.html'; // Redirect to login page after logout
  });

  // Display username in the modal
  const userId = localStorage.getItem('username');
  if (username) {
    userNameDisplay.textContent = `Username: ${username}`;
  } else {
    userNameDisplay.textContent = 'Not logged in';
  }
});
