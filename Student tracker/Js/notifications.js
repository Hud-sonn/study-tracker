// User Notifications Module - Shows alerts for upcoming due assignments/classes

export function initUserNotifications() {
  // Only show for logged-in users
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;

  // Check notifications on page load and every 5 minutes
  checkAndShowNotifications();
  setInterval(checkAndShowNotifications, 5 * 60 * 1000);
}

function checkAndShowNotifications() {
  const assignments = JSON.parse(localStorage.getItem('studyTrackerAssignments')) || [];
  const notifications = generateNotifications(assignments);
  
  if (notifications.length > 0) {
    displayNotificationBanner(notifications);
  }
}

function generateNotifications(assignments) {
  const today = new Date();
  const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  const notifications = [];
  const seenNotifications = JSON.parse(sessionStorage.getItem('seenNotifications')) || [];

  // Check each assignment
  assignments.forEach(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // Skip if already completed
    if (assignment.status === 'completed') return;

    const notifId = `${assignment.id}-${assignment.dueDate}`;

    // Check if overdue
    if (daysLeft < 0) {
      if (!seenNotifications.includes(notifId)) {
        notifications.push({
          id: notifId,
          type: 'overdue',
          title: assignment.title,
          course: assignment.course,
          dueDate: assignment.dueDate,
          message: `⚠️ OVERDUE: "${assignment.title}" (${assignment.course}) was due on ${formatDate(assignment.dueDate)}`,
          icon: '⏰',
          color: '#ef4444'
        });
      }
    }
    // Check if due within 3 days
    else if (daysLeft <= 3 && daysLeft >= 0) {
      if (!seenNotifications.includes(notifId)) {
        const dayText = daysLeft === 0 ? 'TODAY' : `in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;
        notifications.push({
          id: notifId,
          type: 'upcoming',
          title: assignment.title,
          course: assignment.course,
          dueDate: assignment.dueDate,
          message: `📝 "${assignment.title}" (${assignment.course}) is due ${dayText} - ${formatDate(assignment.dueDate)}`,
          icon: '📌',
          color: '#f59e0b'
        });
      }
    }
  });

  return notifications;
}

function displayNotificationBanner(notifications) {
  // Check if banner already exists
  if (document.getElementById('notification-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'notification-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 3px solid #f59e0b;
    padding: 15px 20px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-height: 150px;
    overflow-y: auto;
    animation: slideDown 0.3s ease;
  `;

  const notifHtml = notifications.map(n => `
    <div style="
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
      color: #333;
    ">
      <span style="margin-right: 10px;">${n.icon}</span>
      <strong>${n.title}</strong>
      <br>
      <span style="color: #666; font-size: 13px;">${n.message}</span>
    </div>
  `).join('');

  banner.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>${notifHtml}</div>
      <button id="close-notif-banner" style="
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 5px 10px;
        color: #999;
      ">✕</button>
    </div>
  `;

  document.body.insertBefore(banner, document.body.firstChild);

  // Add main content margin to avoid overlap
  const mainContent = document.querySelector('.main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.style.marginTop = '150px';
  }

  // Close button
  document.getElementById('close-notif-banner').addEventListener('click', () => {
    banner.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      banner.remove();
      if (mainContent) mainContent.style.marginTop = '0';
    }, 300);

    // Mark as seen
    const seenNotifications = JSON.parse(sessionStorage.getItem('seenNotifications')) || [];
    notifications.forEach(n => seenNotifications.push(n.id));
    sessionStorage.setItem('seenNotifications', JSON.stringify(seenNotifications));
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
