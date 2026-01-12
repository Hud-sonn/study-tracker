/**
 * Assignment Management System
 * Handles CRUD operations for assignments with localStorage persistence
 * Ready for Firebase integration
 */

import { STORAGE_KEY, formatDate, escapeHtml, showError, showSuccess, getDaysUntilDue, initMobileNav } from './utils.js';

// ============================================
// ASSIGNMENTS DATA MANAGEMENT
// ============================================

class AssignmentManager {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.assignments = this.loadAssignments();
    this.currentEditingId = null;
  }

  /**
   * Load assignments from localStorage
   */
  loadAssignments() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : this.getDefaultAssignments();
  }

  /**
   * Get default assignments for demo
   */
  getDefaultAssignments() {
    return [
      {
        id: 1,
        title: 'Math Homework',
        course: 'MTH 202',
        courseName: 'Calculus I',
        description: 'Complete exercises 1-25 from Chapter 5',
        dueDate: '2026-01-15',
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null
      },
      {
        id: 2,
        title: 'Physics Lab Report',
        course: 'PHY 204',
        courseName: 'Physics II',
        description: 'Write report on experiment results',
        dueDate: '2026-01-17',
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null
      },
      {
        id: 3,
        title: 'CS Project',
        course: 'CSC 201',
        courseName: 'Data Structures',
        description: 'Implement binary search tree',
        dueDate: '2026-01-20',
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Save assignments to localStorage
   */
  saveAssignments() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.assignments));
    // TODO: Sync with Firebase when available
  }

  /**
   * Add new assignment
   */
  addAssignment(data) {
    const newAssignment = {
      id: Date.now(),
      title: data.title,
      course: data.course,
      courseName: this.getCourseName(data.course),
      description: data.description,
      dueDate: data.dueDate,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      completedAt: data.status === 'completed' ? new Date().toISOString() : null
    };

    this.assignments.push(newAssignment);
    this.saveAssignments();
    return newAssignment;
  }

  /**
   * Update existing assignment
   */
  updateAssignment(id, data) {
    const assignment = this.assignments.find(a => a.id === id);
    if (!assignment) return null;

    assignment.title = data.title;
    assignment.course = data.course;
    assignment.courseName = this.getCourseName(data.course);
    assignment.description = data.description;
    assignment.dueDate = data.dueDate;
    assignment.status = data.status;
    assignment.completedAt = data.status === 'completed' ? new Date().toISOString() : null;

    this.saveAssignments();
    return assignment;
  }

  /**
   * Delete assignment
   */
  deleteAssignment(id) {
    const index = this.assignments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.assignments.splice(index, 1);
      this.saveAssignments();
      return true;
    }
    return false;
  }

  /**
   * Get course name from course code
   */
  getCourseName(courseCode) {
    const courses = {
      'MTH 202': 'Calculus I',
      'PHY 204': 'Physics II',
      'CSC 201': 'Data Structures',
      'ENG 205': 'Literature'
    };
    return courses[courseCode] || courseCode;
  }

  /**
   * Get assignments by status
   */
  getByStatus(status) {
    if (status === 'all') return this.assignments;
    return this.assignments.filter(a => a.status === status);
  }

  /**
   * Get assignments by course
   */
  getByCourse(course) {
    return this.assignments.filter(a => a.course === course);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      total: this.assignments.length,
      pending: this.assignments.filter(a => a.status === 'pending').length,
      completed: this.assignments.filter(a => a.status === 'completed').length,
      submitted: this.assignments.filter(a => a.status === 'submitted').length,
      completionRate: this.assignments.length > 0
        ? Math.round((this.assignments.filter(a => a.status === 'completed').length / this.assignments.length) * 100)
        : 0
    };
  }

  /**
   * Sort assignments by due date
   */
  sortByDueDate() {
    return [...this.assignments].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  /**
   * Get overdue assignments
   */
  getOverdue() {
    const today = new Date().toISOString().split('T')[0];
    return this.assignments.filter(a => a.dueDate < today && a.status !== 'completed');
  }
}

// ============================================
// UI MANAGEMENT
// ============================================

class AssignmentUI {
  constructor() {
    this.assignmentManager = new AssignmentManager();
    this.currentFilter = 'all';
    this.modal = document.getElementById('assignment-modal');
    this.form = document.getElementById('assignment-form');
    this.grid = document.getElementById('assignments-grid');
    this.initEventListeners();
    this.render();
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Add assignment button
    document.getElementById('add-btn').addEventListener('click', () => {
      this.openModal();
    });

    // Close modal
    document.getElementById('close-modal').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.closeModal();
    });

    // Modal backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  /**
   * Open assignment modal
   */
  openModal(assignmentId = null) {
    const modalTitle = document.getElementById('modal-title');
    const titleInput = document.getElementById('assignment-title');
    const classInput = document.getElementById('assignment-class');
    const descInput = document.getElementById('assignment-description');
    const dueDateInput = document.getElementById('assignment-duedate');
    const statusInput = document.getElementById('assignment-status');

    // Reset form
    this.form.reset();

    if (assignmentId) {
      // Edit mode
      const assignment = this.assignmentManager.assignments.find(a => a.id === assignmentId);
      if (assignment) {
        modalTitle.textContent = 'Edit Assignment';
        titleInput.value = assignment.title;
        classInput.value = assignment.course;
        descInput.value = assignment.description;
        dueDateInput.value = assignment.dueDate;
        statusInput.value = assignment.status;
        this.assignmentManager.currentEditingId = assignmentId;
      }
    } else {
      // Add mode
      modalTitle.textContent = 'Add Assignment';
      this.assignmentManager.currentEditingId = null;
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDateInput.value = tomorrow.toISOString().split('T')[0];
    }

    this.modal.classList.add('active');
    titleInput.focus();
  }

  /**
   * Close assignment modal
   */
  closeModal() {
    this.modal.classList.remove('active');
    this.assignmentManager.currentEditingId = null;
    this.form.reset();
  }

  /**
   * Handle form submission
   */
  handleFormSubmit() {
    const titleInput = document.getElementById('assignment-title');
    const classInput = document.getElementById('assignment-class');
    const descInput = document.getElementById('assignment-description');
    const dueDateInput = document.getElementById('assignment-duedate');
    const statusInput = document.getElementById('assignment-status');

    // Validate required fields
    if (!titleInput.value.trim() || !classInput.value || !dueDateInput.value) {
      this.showError('Please fill in all required fields');
      return;
    }

    const assignmentData = {
      title: titleInput.value.trim(),
      course: classInput.value,
      description: descInput.value.trim(),
      dueDate: dueDateInput.value,
      status: statusInput.value
    };

    // Add or update
    if (this.assignmentManager.currentEditingId) {
      this.assignmentManager.updateAssignment(
        this.assignmentManager.currentEditingId,
        assignmentData
      );
      this.showSuccess('Assignment updated successfully!');
    } else {
      this.assignmentManager.addAssignment(assignmentData);
      this.showSuccess('Assignment added successfully!');
    }

    this.closeModal();
    this.render();
  }

  /**
   * Delete assignment with confirmation
   */
  deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignmentManager.deleteAssignment(id);
      this.showSuccess('Assignment deleted successfully!');
      this.render();
    }
  }

  /**
   * Get days until due date (imported from utils.js)
   */
  getDaysUntilDue(dateString) {
    return getDaysUntilDue(dateString);
  }

  /**
   * Render assignments
   */
  render() {
    const assignments = this.assignmentManager.getByStatus(this.currentFilter);

    if (assignments.length === 0) {
      this.grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📝</div>
          <h3>No ${this.currentFilter} assignments</h3>
          <p>Add your first assignment to get started!</p>
        </div>
      `;
      return;
    }

    // Sort by due date
    const sorted = [...assignments].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );

    this.grid.innerHTML = sorted.map(assignment => {
      const daysLeft = this.getDaysUntilDue(assignment.dueDate);
      const isOverdue = daysLeft < 0 && assignment.status !== 'completed';

      return `
        <div class="assignment-item">
          <div class="assignment-item-header">
            <h3 class="assignment-item-title">${this.escapeHtml(assignment.title)}</h3>
            <span class="assignment-item-course">${assignment.course}</span>
          </div>

          <p class="assignment-item-description">${this.escapeHtml(assignment.description || 'No description')}</p>

          <div class="assignment-item-meta">
            <div class="meta-item">
              <span class="meta-label">Course</span>
              <span class="meta-value">${assignment.courseName}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Due Date</span>
              <span class="meta-value ${isOverdue ? 'style="color: #ef4444;"' : ''}">${this.formatDate(assignment.dueDate)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Days Left</span>
              <span class="meta-value ${isOverdue ? 'style="color: #ef4444;"' : ''}">${Math.max(daysLeft, 0)} days</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Added</span>
              <span class="meta-value">${this.formatDate(assignment.createdAt)}</span>
            </div>
          </div>

          <div class="assignment-item-footer">
            <span class="status-badge ${assignment.status}">
              <span>${assignment.status === 'pending' ? '⏳' : assignment.status === 'completed' ? '✓' : '📤'}</span>
              ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
            <div class="assignment-actions">
              <button class="action-btn" onclick="assignmentUI.openModal(${assignment.id})">Edit</button>
              <button class="action-btn delete" onclick="assignmentUI.deleteAssignment(${assignment.id})">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // escapeHtml imported from utils.js

  // showError imported from utils.js
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

let assignmentUI;

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in (Firebase or localStorage)
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    window.location.href = 'Login.html';
    return;
  }

  assignmentUI = new AssignmentUI();
});
