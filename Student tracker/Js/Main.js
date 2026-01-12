// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const sidebar = document.querySelector('.sidebar');

// Close sidebar when clicking a link
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.checked = false;
  });
});

// Close sidebar when clicking overlay
document.querySelector('.overlay').addEventListener('click', () => {
  navToggle.checked = false;
});

// Task checkbox functionality
const taskCheckboxes = document.querySelectorAll('.task-checkbox');
const taskList = document.querySelector('.tasks-list');
const emptyState = document.querySelector('.empty-state');

function updateEmptyState() {
  const checkedTasks = Array.from(taskCheckboxes).filter(checkbox => checkbox.checked);
  const allTasks = taskCheckboxes.length;
  
  if (checkedTasks.length === allTasks && allTasks > 0) {
    emptyState.classList.remove('hidden');
    taskList.style.opacity = '0.7';
  } else {
    emptyState.classList.add('hidden');
    taskList.style.opacity = '1';
  }
}

taskCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateEmptyState);
});

// Smooth scroll snap behavior for horizontal scroll containers
document.querySelectorAll('.card-scroll').forEach(scroll => {
  scroll.addEventListener('scroll', () => {
    // Optional: add custom scroll behavior here
  });
});

// Add keyboard navigation for sidebar (optional enhancement)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navToggle.checked = false;
  }
});