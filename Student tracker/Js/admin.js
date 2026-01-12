/**
 * Admin Analytics & Reporting System
 * Provides comprehensive analytics dashboard for students to track their progress
 */

import { STORAGE_KEY, formatDate, escapeHtml, getDaysUntilDue, initMobileNav } from './utils.js';

class AdminAnalytics {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.assignments = this.loadAssignments();
    this.currentFilter = 'all';
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
   * Initialize UI
   */
  initUI() {
    this.displayKPIs();
    this.displayStatusChart();
    this.displayCoursePerformance();
    this.displayAssignmentDetails();
    this.displayInsights();
    this.initEventListeners();
  }

  /**
   * Display Key Performance Indicators
   */
  displayKPIs() {
    const stats = this.getStatistics();

    document.getElementById('kpi-assignments').textContent = stats.total;
    document.getElementById('kpi-completed').textContent = stats.completed;
    document.getElementById('kpi-completion-rate').textContent = stats.completionRate + '%';
    document.getElementById('kpi-classes').textContent = stats.uniqueClasses;

    // Update completion trend
    const trendElement = document.getElementById('completion-trend');
    if (stats.completionRate >= 75) {
      trendElement.textContent = '↑';
      trendElement.parentElement.style.background = '#134e4a';
      trendElement.parentElement.style.color = '#a7f3d0';
    } else if (stats.completionRate >= 50) {
      trendElement.textContent = '→';
      trendElement.parentElement.style.background = '#1e3a8a';
      trendElement.parentElement.style.color = '#bfdbfe';
    } else {
      trendElement.textContent = '↓';
      trendElement.parentElement.style.background = '#7c2d12';
      trendElement.parentElement.style.color = '#fed7aa';
    }
  }

  /**
   * Display status chart
   */
  displayStatusChart() {
    const chart = document.getElementById('status-chart');
    const stats = this.getStatistics();
    const total = stats.total || 1;

    const data = [
      { label: 'Pending', value: stats.pending, percentage: (stats.pending / total * 100).toFixed(0) },
      { label: 'Completed', value: stats.completed, percentage: (stats.completed / total * 100).toFixed(0) },
      { label: 'Submitted', value: stats.submitted, percentage: (stats.submitted / total * 100).toFixed(0) }
    ];

    if (stats.total === 0) {
      chart.innerHTML = '<div style="grid-column: 1 / -1; color: #a0aec0; text-align: center; padding: 40px;">No data available</div>';
      return;
    }

    chart.innerHTML = data.map((item, index) => {
      const colors = ['#f59e0b', '#22c55e', '#3b82f6'];
      const height = (item.value / Math.max(...data.map(d => d.value))) * 100;
      
      return `
        <div class="chart-bar" style="background: linear-gradient(180deg, ${colors[index]}, ${colors[index]}99); height: ${Math.max(height, 15)}%;" title="${item.label}: ${item.value}">
          <div class="chart-value">${item.value}</div>
          <div class="chart-label">${item.label}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Display course performance table
   */
  displayCoursePerformance() {
    const courses = this.getCoursesPerformance();
    const tbody = document.getElementById('course-table');

    if (courses.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #a0aec0; padding: 40px;">No course data available</td></tr>';
      return;
    }

    tbody.innerHTML = courses.map(course => {
      const progressPercent = course.total > 0 ? Math.round((course.completed / course.total) * 100) : 0;
      const status = progressPercent >= 75 ? 'high' : progressPercent >= 50 ? 'medium' : 'low';

      return `
        <tr>
          <td>${course.name}</td>
          <td><strong>${course.code}</strong></td>
          <td>${course.total}</td>
          <td>${course.completed}</td>
          <td>
            <div class="progress-cell">
              <div class="progress-bar-small">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
              </div>
              <span>${progressPercent}%</span>
            </div>
          </td>
          <td><span class="badge ${status}">${status === 'high' ? '✓ Excellent' : status === 'medium' ? '○ Good' : '✗ Needs Work'}</span></td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Display assignment details table
   */
  displayAssignmentDetails() {
    const assignments = [...this.assignments].sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );

    const tbody = document.getElementById('assignments-table');

    if (assignments.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #a0aec0; padding: 40px;">No assignments yet</td></tr>';
      return;
    }

    tbody.innerHTML = assignments.map(assignment => {
      const daysLeft = this.getDaysUntilDue(assignment.dueDate);
      const isOverdue = daysLeft < 0 && assignment.status !== 'completed';
      const statusIndicatorClass = assignment.status === 'completed' ? 'completed' : 
                                    assignment.status === 'submitted' ? 'active' : 'pending';

      return `
        <tr>
          <td><strong>${this.escapeHtml(assignment.title)}</strong></td>
          <td>${assignment.course}</td>
          <td>${this.formatDate(assignment.dueDate)}</td>
          <td>
            <span class="status-indicator ${statusIndicatorClass}"></span>
            ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </td>
          <td style="${isOverdue ? 'color: #ef4444;' : ''}">${isOverdue ? 'OVERDUE' : Math.max(daysLeft, 0) + ' days'}</td>
          <td>
            <div class="progress-cell">
              <div class="progress-bar-small">
                <div class="progress-fill" style="width: ${assignment.status === 'completed' ? 100 : assignment.status === 'submitted' ? 75 : 0}%"></div>
              </div>
              <span>${assignment.status === 'completed' ? 100 : assignment.status === 'submitted' ? 75 : 0}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Display study insights
   */
  displayInsights() {
    const insights = this.generateInsights();
    const container = document.getElementById('insights-container');

    if (insights.length === 0) {
      container.innerHTML = '<div style="color: #a0aec0; text-align: center; padding: 40px;">No insights available yet</div>';
      return;
    }

    container.innerHTML = insights.map(insight => `
      <div style="background: #0f0f14; border-left: 4px solid ${insight.color}; padding: 15px; margin-bottom: 15px; border-radius: 8px;">
        <div style="color: #fff; font-weight: 600; margin-bottom: 5px;">${insight.icon} ${insight.title}</div>
        <div style="color: #a0aec0; font-size: 14px;">${insight.message}</div>
      </div>
    `).join('');
  }

  /**
   * Generate smart insights based on data
   */
  generateInsights() {
    const insights = [];
    const stats = this.getStatistics();
    const today = new Date().toISOString().split('T')[0];
    const overdue = this.assignments.filter(a => a.dueDate < today && a.status !== 'completed');

    // Completion rate insight
    if (stats.completionRate >= 75) {
      insights.push({
        icon: '🎯',
        title: 'Excellent Progress',
        message: `You're doing great! ${stats.completionRate}% of your assignments are completed. Keep up the momentum!`,
        color: '#22c55e'
      });
    } else if (stats.completionRate >= 50) {
      insights.push({
        icon: '📈',
        title: 'Good Progress',
        message: `You've completed ${stats.completionRate}% of your assignments. A bit more push will get you to excellent!`,
        color: '#3b82f6'
      });
    } else if (stats.total > 0) {
      insights.push({
        icon: '⚠️',
        title: 'More Work Needed',
        message: `You've only completed ${stats.completionRate}% of your assignments. Let's focus on catching up!`,
        color: '#f59e0b'
      });
    }

    // Overdue insight
    if (overdue.length > 0) {
      insights.push({
        icon: '⏰',
        title: 'Overdue Assignments',
        message: `You have ${overdue.length} overdue assignment${overdue.length > 1 ? 's' : ''}. It's important to complete these as soon as possible.`,
        color: '#ef4444'
      });
    }

    // Assignment pace
    if (stats.pending > 0) {
      const avgDaysLeft = this.getAverageDaysLeft();
      if (avgDaysLeft < 3 && avgDaysLeft > 0) {
        insights.push({
          icon: '🚀',
          title: 'Busy Week Ahead',
          message: `You have ${stats.pending} pending assignments due within the next 3 days. Plan your time wisely!`,
          color: '#f59e0b'
        });
      }
    }

    // Consistent work
    if (stats.total >= 5) {
      const completedThisWeek = this.assignments.filter(a => {
        if (a.completedAt) {
          const completedDate = new Date(a.completedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return completedDate >= weekAgo;
        }
        return false;
      }).length;

      if (completedThisWeek >= 3) {
        insights.push({
          icon: '⭐',
          title: 'Consistent Effort',
          message: `You've completed ${completedThisWeek} assignments this week. Your dedication is paying off!`,
          color: '#a855f7'
        });
      }
    }

    return insights;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const completed = this.assignments.filter(a => a.status === 'completed').length;
    const submitted = this.assignments.filter(a => a.status === 'submitted').length;
    const pending = this.assignments.filter(a => a.status === 'pending').length;
    const uniqueClasses = new Set(this.assignments.map(a => a.course)).size;

    return {
      total: this.assignments.length,
      completed: completed,
      submitted: submitted,
      pending: pending,
      completionRate: this.assignments.length > 0
        ? Math.round((completed / this.assignments.length) * 100)
        : 0,
      uniqueClasses: uniqueClasses
    };
  }

  /**
   * Get course performance data
   */
  getCoursesPerformance() {
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
          name: courses[assignment.course] || assignment.courseName,
          total: 0,
          completed: 0
        });
      }

      const courseData = courseMap.get(assignment.course);
      courseData.total++;
      if (assignment.status === 'completed') {
        courseData.completed++;
      }
    });

    return Array.from(courseMap.values()).sort((a, b) => 
      (b.completed / b.total) - (a.completed / a.total)
    );
  }

  /**
   * Get average days left for pending assignments
   */
  getAverageDaysLeft() {
    const pending = this.assignments.filter(a => a.status === 'pending');
    if (pending.length === 0) return 0;

    const totalDays = pending.reduce((sum, a) => {
      return sum + Math.max(this.getDaysUntilDue(a.dueDate), 0);
    }, 0);

    return Math.round(totalDays / pending.length);
  }

  // getDaysUntilDue imported from utils.js

  // formatDate imported from utils.js

  // escapeHtml imported from utils.js

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.displayStatusChart();
      });
    });

    // Export button
    document.querySelector('.export-btn').addEventListener('click', () => {
      this.exportReport();
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

  /**
   * Export report as JSON
   */
  exportReport() {
    const report = {
      exportDate: new Date().toISOString(),
      statistics: this.getStatistics(),
      coursePerformance: this.getCoursesPerformance(),
      assignments: this.assignments,
      insights: this.generateInsights()
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  new AdminAnalytics();
});
