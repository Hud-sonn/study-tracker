// Admin Dashboard JS - Firebase Realtime Database Integration

import { auth } from './firebase.js';

// ==================== FIREBASE SETUP ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6cv8uB21xI2Jf3TTNek3tOpkrM5EI8ds",
  authDomain: "study-tracker-1a735.firebaseapp.com",
  projectId: "study-tracker-1a735",
  storageBucket: "study-tracker-1a735.firebasestorage.app",
  messagingSenderId: "397536791358",
  appId: "1:397536791358:web:af1213d9e10b39a74ffa6f",
  measurementId: "G-H96Y2MVBQK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ==================== AUTH CHECK ====================
document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = sessionStorage.getItem('adminAuthenticated');
  if (!isAdmin) {
    window.location.href = 'admin-login.html';
    return;
  }

  initializeAdmin();
  loadDashboardData();
  setupEventListeners();
});

// ==================== INITIALIZE ADMIN ====================
function initializeAdmin() {
  console.log('✅ Admin dashboard loaded');
  
  // Update user info
  const userEmail = localStorage.getItem('userEmail') || 'Admin';
  document.getElementById('userInfo').textContent = userEmail;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Sidebar navigation
  document.querySelectorAll('.nav-link:not(.logout)').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      switchSection(section);
      
      // Update active state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Close sidebar on mobile
      const sidebar = document.querySelector('.sidebar');
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
      }
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  document.getElementById('logoutIconBtn').addEventListener('click', logout);

  // Menu button (mobile)
  document.getElementById('menuBtn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
  });

  document.getElementById('closeSidebar').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.remove('active');
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const status = btn.getAttribute('data-status');
      loadAssignments(status);
    });
  });
}

// ==================== SECTION SWITCHING ====================
function switchSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section + '-section').classList.add('active');
}

// ==================== LOAD DASHBOARD DATA ====================
async function loadDashboardData() {
  try {
    // Load from localStorage first (for demo)
    const assignments = JSON.parse(localStorage.getItem('studyTrackerAssignments')) || [];
    
    // Try to load from Firebase Realtime DB
    const assignmentsRef = ref(db, 'assignments');
    onValue(assignmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        updateStats(snapshot.val());
      } else {
        updateStats(assignments);
      }
    }, (error) => {
      console.warn('Firebase load warning:', error);
      updateStats(assignments);
    });

    loadUsers();
    loadAssignments('all');
    loadClasses();
    generateNotifications();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// ==================== UPDATE STATISTICS ====================
function updateStats(assignmentData) {
  const assignments = Array.isArray(assignmentData) ? assignmentData : Object.values(assignmentData || {});
  
  const completed = assignments.filter(a => a.status === 'completed').length;
  const pending = assignments.filter(a => a.status === 'pending').length;
  const overdue = assignments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.dueDate < today && a.status !== 'completed';
  }).length;

  // Get unique classes
  const classes = new Set(assignments.map(a => a.course || a.class));

  document.getElementById('totalUsers').textContent = localStorage.getItem('userEmail') ? '1' : '0';
  document.getElementById('totalAssignments').textContent = assignments.length;
  document.getElementById('completedAssignments').textContent = completed;
  document.getElementById('pendingAssignments').textContent = pending;
  document.getElementById('totalClasses').textContent = classes.size;
  document.getElementById('overdueAssignments').textContent = overdue;

  // Recent activity
  updateRecentActivity(assignments);
}

// ==================== UPDATE RECENT ACTIVITY ====================
function updateRecentActivity(assignments) {
  const list = document.getElementById('recentActivityList');
  
  if (assignments.length === 0) {
    list.innerHTML = '<p class="empty-state">No recent activity</p>';
    return;
  }

  const sorted = assignments.sort((a, b) => 
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  ).slice(0, 5);

  list.innerHTML = sorted.map(a => {
    const date = new Date(a.createdAt || Date.now());
    const timeAgo = getTimeAgo(date);
    return `
      <div class="activity-item">
        <strong>${a.title}</strong> - ${a.status}
        <div class="activity-time">${timeAgo}</div>
      </div>
    `;
  }).join('');
}

// ==================== LOAD USERS ====================
async function loadUsers() {
  const tbody = document.getElementById('usersTableBody');
  
  try {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        renderUsersTable(users, tbody);
      } else {
        // Fallback to localStorage
        const email = localStorage.getItem('userEmail');
        if (email) {
          tbody.innerHTML = `
            <tr>
              <td>${localStorage.getItem('userName') || 'Student'}</td>
              <td>${email}</td>
              <td>${new Date().toLocaleDateString()}</td>
              <td>Just now</td>
            </tr>
          `;
        } else {
          tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No users found</td></tr>';
        }
      }
    }, (error) => {
      console.warn('Firebase users load:', error);
      tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Error loading users</td></tr>';
    });
  } catch (error) {
    console.error('Error loading users:', error);
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Error loading users</td></tr>';
  }
}

function renderUsersTable(users, tbody) {
  if (!users || Object.keys(users).length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = Object.entries(users).map(([id, user]) => `
    <tr>
      <td>${user.displayName || 'Unknown'}</td>
      <td>${user.email}</td>
      <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
      <td>${user.lastLogin ? getTimeAgo(new Date(user.lastLogin)) : 'Never'}</td>
    </tr>
  `).join('');
}

// ==================== LOAD ASSIGNMENTS ====================
function loadAssignments(status = 'all') {
  const assignments = JSON.parse(localStorage.getItem('studyTrackerAssignments')) || [];
  const tbody = document.getElementById('assignmentsTableBody');

  const filtered = status === 'all' ? assignments : 
                   status === 'overdue' ? 
                     assignments.filter(a => {
                       const today = new Date().toISOString().split('T')[0];
                       return a.dueDate < today && a.status !== 'completed';
                     }) :
                     assignments.filter(a => a.status === status);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No ${status} assignments</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    const daysLeft = getDaysUntilDue(a.dueDate);
    const isOverdue = daysLeft < 0 && a.status !== 'completed';
    
    return `
      <tr>
        <td><strong>${a.title}</strong></td>
        <td>${a.course || 'N/A'}</td>
        <td>${new Date(a.dueDate).toLocaleDateString()}</td>
        <td><span class="badge ${a.status}">${a.status}</span></td>
        <td style="${isOverdue ? 'color: #ef4444; font-weight: 600;' : ''}">${isOverdue ? 'OVERDUE' : Math.max(daysLeft, 0) + ' days'}</td>
      </tr>
    `;
  }).join('');
}

// ==================== LOAD CLASSES ====================
function loadClasses() {
  const assignments = JSON.parse(localStorage.getItem('studyTrackerAssignments')) || [];
  const container = document.getElementById('classesList');

  const courses = {};
  assignments.forEach(a => {
    if (!courses[a.course]) {
      courses[a.course] = {
        code: a.course,
        name: a.courseName || a.course,
        assignments: 0,
        completed: 0
      };
    }
    courses[a.course].assignments++;
    if (a.status === 'completed') {
      courses[a.course].completed++;
    }
  });

  const classList = Object.values(courses);

  if (classList.length === 0) {
    container.innerHTML = '<p class="empty-state">No classes found</p>';
    return;
  }

  container.innerHTML = classList.map(cls => {
    const progress = cls.assignments > 0 ? Math.round((cls.completed / cls.assignments) * 100) : 0;
    return `
      <div class="class-card">
        <div class="class-code">${cls.code}</div>
        <div class="class-name">${cls.name}</div>
        <div class="class-info">
          <div>📝 ${cls.assignments} assignments</div>
          <div>✅ ${cls.completed} completed</div>
          <div style="margin-top: 10px;">
            <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${progress}%;"></div>
            </div>
            <div style="text-align: center; font-size: 12px; color: #64748b; margin-top: 5px;">${progress}%</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== GENERATE NOTIFICATIONS ====================
function generateNotifications() {
  const assignments = JSON.parse(localStorage.getItem('studyTrackerAssignments')) || [];
  const today = new Date();
  const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Assignment Notifications
  const assignmentNotifs = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return a.status !== 'completed' && daysLeft >= 0 && daysLeft <= 3;
  });

  const assignmentContainer = document.getElementById('assignmentNotifications');
  if (assignmentNotifs.length === 0) {
    assignmentContainer.innerHTML = '<p class="empty-state">No assignment alerts</p>';
  } else {
    assignmentContainer.innerHTML = assignmentNotifs.map(a => {
      const daysLeft = getDaysUntilDue(a.dueDate);
      return `
        <div class="notification-item ${daysLeft <= 1 ? 'danger' : 'warning'}">
          <strong>${a.title}</strong> (${a.course}) due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}
          <div class="notification-time">${new Date(a.dueDate).toLocaleDateString()}</div>
        </div>
      `;
    }).join('');
  }

  // Class Notifications (based on assignments by course)
  const courses = {};
  assignments.forEach(a => {
    if (!courses[a.course]) {
      courses[a.course] = { name: a.courseName || a.course, pending: 0 };
    }
    if (a.status !== 'completed') courses[a.course].pending++;
  });

  const classContainer = document.getElementById('classNotifications');
  const classNotifs = Object.entries(courses).filter(([_, c]) => c.pending > 0);

  if (classNotifs.length === 0) {
    classContainer.innerHTML = '<p class="empty-state">No class alerts</p>';
  } else {
    classContainer.innerHTML = classNotifs.map(([code, cls]) => `
      <div class="notification-item">
        <strong>${cls.name}</strong> has ${cls.pending} pending assignment${cls.pending !== 1 ? 's' : ''}
        <div class="notification-time">Updated just now</div>
      </div>
    `).join('');
  }

  // System Notifications
  const systemContainer = document.getElementById('systemNotifications');
  const overdueCount = assignments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.dueDate < today && a.status !== 'completed';
  }).length;

  if (overdueCount === 0) {
    systemContainer.innerHTML = '<p class="empty-state">All caught up! No system alerts</p>';
  } else {
    systemContainer.innerHTML = `
      <div class="notification-item danger">
        <strong>⚠️ ${overdueCount} overdue assignment${overdueCount !== 1 ? 's' : ''}</strong>
        <div class="notification-time">Immediate action needed</div>
      </div>
    `;
  }
}

// ==================== LOGOUT ====================
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'admin-login.html';
  }
}

// ==================== UTILITIES ====================
function getDaysUntilDue(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  const diff = dueDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return interval + ' ' + name + (interval > 1 ? 's' : '') + ' ago';
    }
  }
  return 'Just now';
}
