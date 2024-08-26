// assets/js/auth-check.js

document.addEventListener('DOMContentLoaded', () => {
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';

  if (!isAuthenticated) {
    window.location.href = 'login.html';
  }
});
