// Shared utilities across all modules
export const STORAGE_KEY = 'studyTrackerAssignments';

/**
 * Format date for display
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Show error message
 */
export function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.animation = 'none';
  setTimeout(() => {
    errorElement.style.animation = 'slideDown 0.3s ease';
  }, 10);
}

/**
 * Show success message (toast)
 */
export function showSuccess(message) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #134e4a;
    color: #a7f3d0;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 2000;
    animation: slideDown 0.3s ease;
  `;
  successDiv.textContent = '✓ ' + message;
  document.body.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 3000);
}

/**
 * Set button loading state
 */
export function setLoading(button, isLoading) {
  if (!button) return;

  const btnText = button.querySelector('.btn-text') || button.querySelector('span');
  const btnLoader = button.querySelector('.btn-loader');

  if (isLoading) {
    button.disabled = true;
    if (btnText) btnText.style.opacity = '0';
    if (btnLoader) btnLoader.classList.remove('hidden');
  } else {
    button.disabled = false;
    if (btnText) btnText.style.opacity = '1';
    if (btnLoader) btnLoader.classList.add('hidden');
  }
}

/**
 * Initialize mobile navigation
 */
export function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  if (!navToggle) return;

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.checked = false;
    });
  });

  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      navToggle.checked = false;
    });
  }
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  return password.length >= 6;
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  const diff = dueDate - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}
