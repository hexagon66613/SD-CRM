// assets/js/auth-check.js

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('authenticated') !== 'true') {
    window.location.href = 'login.html';
  }
});
