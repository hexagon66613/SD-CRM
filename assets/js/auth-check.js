// assets/js/auth-check.js

document.addEventListener('DOMContentLoaded', () => {
  // Check if 'authenticated' flag is set in localStorage
  if (localStorage.getItem('authenticated') !== 'true') {
    // Redirect to login page if not authenticated
    window.location.href = 'login.html';
  }
});
