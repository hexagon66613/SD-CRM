// assets/js/auth-check.js

document.addEventListener('DOMContentLoaded', () => {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';

  if (!isAuthenticated) {
    window.location.href = 'login.html';
  }
});
