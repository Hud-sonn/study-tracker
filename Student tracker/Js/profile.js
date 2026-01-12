/**
 * Student Profile Management
 * Displays student data, statistics, and performance metrics
 */

import { STORAGE_KEY, formatDate, getInitials, signOut } from './utils.js';
import { auth, onAuthStateChanged } from './firebase.js';

class StudentProfile {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.assignments = this.loadAssignments();
    this.studentEmail = localStorage.getItem('userEmail') || 'student@example.com';
    this.studentName = localStorage.getItem('userName') || 'Student';
    this.initUI();
  }

  /**
   * Load assignments from localStorage
   */
  loadAssignments() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Initialize UI with student data
   */
  initUI() {
    this.displayProfileHeader();
    this.displayStats();
    this.displayPersonalInfo();
    this.displayEnrolledClasses();
    this.displayAssignmentTimeline();
    this.initEventListeners();
  }

  /**
   * Display profile header
   */
  displayProfileHeader() {
    const initials = this.getInitials(this.studentName);
    document.getElementById('profile-avatar').textContent = initials;
    document.getElementById('profile-name').textContent = this.studentName;
    document.getElementById('profile-email').textContent = this.studentEmail;
    
    const joinDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    document.getElementById('join-date').textContent = joinDate;
  }

  /**
   * Display student statistics
   */
  displayStats() {
    const stats = this.getStats();

    document.getElementById('total-assignments').textContent = stats.total;
    document.getElementById('completed-assignments').textContent = stats.completed;
    document.getElementById('completion-rate').textContent = stats.completionRate + '%';
    document.getElementById('enrolled-classes').textContent = stats.uniqueClasses;
  }

  /**
   * Display personal information
   */
  displayPersonalInfo() {
    document.getElementById('info-email').textContent = this.studentEmail;
    document.getElementById('info-id').textContent = 'STU' + Math.floor(Math.random() * 10000).toString().padStart(3, '0');
    
    const memberSince = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    document.getElementById('member-since').textContent = memberSince;
  }

  /**
   * Display enrolled classes
   */
  displayEnrolledClasses() {
    const classes = this.getEnrolledClasses();
    const grid = document.getElementById('enrolled-classes-grid');

    if (classes.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; color: #a0aec0; text-align: center; padding: 40px;">No classes enrolled yet</div>';
      return;
    }

    grid.innerHTML = classes.map(cls => {
      const classAssignments = this.assignments.filter(a => a.course === cls.code);
      const completedCount = classAssignments.filter(a => a.status === 'completed').length;
      const progressPercent = classAssignments.length > 0
        ? Math.round((completedCount / classAssignments.length) * 100)
        : 0;

      return `
        <div class="class-item">
          <div class="class-header">
            <div class="class-code">${cls.code}</div>
          </div>
          <div class="class-name">${cls.name}</div>
          <div class="class-info">
            <div>📚 ${classAssignments.length} assignments</div>
            <div>✓ ${completedCount} completed</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div style="text-align: center; color: #a0aec0; font-size: 12px;">
            ${progressPercent}% Complete
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Display assignment timeline
   */
  displayAssignmentTimeline() {
    const timeline = document.getElementById('assignments-timeline');
    
    if (this.assignments.length === 0) {
      timeline.innerHTML = '<div style="color: #a0aec0; text-align: center; padding: 40px;">No assignments yet</div>';
      return;
    }

    // Sort by due date, most recent first
    const sorted = [...this.assignments].sort((a, b) => 
      new Date(b.dueDate) - new Date(a.dueDate)
    );

    timeline.innerHTML = sorted.map(assignment => {
      const dueDate = this.formatDate(assignment.dueDate);
      const isCompleted = assignment.status === 'completed';
      const completedDate = assignment.completedAt ? this.formatDate(assignment.completedAt) : null;

      return `
        <div class="timeline-item ${isCompleted ? 'completed' : ''}">
          <div class="timeline-content">
            <div class="timeline-title">${this.escapeHtml(assignment.title)}</div>
            <div class="timeline-meta">
              <span>${assignment.courseName}</span>
              <span>Due: ${dueDate}</span>
              <span class="badge ${isCompleted ? 'completed' : 'pending'}">
                ${isCompleted ? '✓ Completed' : '⏳ Pending'}
              </span>
            </div>
            ${completedDate ? `<div style="color: #22c55e; font-size: 12px; margin-top: 8px;">✓ Completed on ${completedDate}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Get student statistics
   */
  getStats() {
    const completed = this.assignments.filter(a => a.status === 'completed').length;
    const submitted = this.assignments.filter(a => a.status === 'submitted').length;
    const uniqueClasses = new Set(this.assignments.map(a => a.course)).size;

    return {
      total: this.assignments.length,
      completed: completed,
      submitted: submitted,
      pending: this.assignments.length - completed - submitted,
      completionRate: this.assignments.length > 0
        ? Math.round((completed / this.assignments.length) * 100)
        : 0,
      uniqueClasses: uniqueClasses
    };
  }

  /**
   * Get enrolled classes
   */
  getEnrolledClasses() {
    const courseMap = new Map();
    const courses = {
      'MTH 202': 'Calculus I',
      'PHY 204': 'Physics II',
      'CSC 201': 'Data Structures',
      'ENG 205': 'Literature'
    };

    this.assignments.forEach(assignment => {
      if (!courseMap.has(assignment.course)) {
        courseMap.set(assignment.course, {
          code: assignment.course,
          name: courses[assignment.course] || assignment.courseName
        });
      }
    });

    return Array.from(courseMap.values());
  }

  // formatDate imported from utils.js

  // getInitials imported from utils.js

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
      if (!confirm('Are you sure you want to logout?')) return;
      // Try to sign out from Firebase if available, then clear local state
      import('./firebase.js').then(mod => {
        if (mod.initialized) {
          return mod.signOut(mod.auth).catch(() => {});
        }
      }).catch(() => {}).finally(() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'Login.html';
      });
    });

    // Mobile navigation
    const navToggle = document.getElementById('nav-toggle');
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.checked = false;
      });
    });

    document.querySelector('.overlay').addEventListener('click', () => {
      navToggle.checked = false;
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in (Firebase or localStorage)
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    window.location.href = 'Login.html';
    return;
  }

  new StudentProfile();
});
