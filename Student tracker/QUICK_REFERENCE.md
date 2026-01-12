# 📌 Quick Reference Card - Study Tracker

## 🎯 Main URLs
```
Login Page         → Login.html
Home/Dashboard     → homepage.html
Assignments        → assignments.html ⭐ NEW
Student Profile    → profile.html ⭐ NEW
Analytics          → Admin.html ⭐ NEW
```

---

## 📋 Assignment Management

### Add Assignment
```
1. Click "+ Add Assignment" button
2. Fill form:
   - Title (required)
   - Class (required) - dropdown
   - Description (optional)
   - Due Date (required)
   - Status - Pending/Completed/Submitted
3. Click "Save Assignment"
```

### Edit Assignment
```
1. Find assignment in grid
2. Click "Edit" button
3. Modal opens with pre-filled data
4. Update any field
5. Click "Save Assignment"
```

### Delete Assignment
```
1. Find assignment in grid
2. Click "Delete" button
3. Confirm in dialog
4. Assignment removed
```

### Filter Assignments
```
Click filter buttons: All | Pending | Completed | Submitted
Grid updates instantly
```

### View Assignment Details
Each card shows:
- Title, Course Code
- Description
- Course Name, Due Date
- Days Left, Added Date
- Status Badge, Actions

---

## 👤 Profile Information

### What You See
```
Header Section:
  - Avatar (your initials)
  - Name, Email, Join Date

Statistics:
  - Total Assignments
  - Completed Count
  - Completion Rate %
  - Classes Enrolled

Personal Info:
  - Email Address
  - Student ID (auto-generated)
  - Account Status
  - Member Since Date

Classes:
  - List of all enrolled courses
  - Progress bar per course
  - Completion percentage

Timeline:
  - All assignments in order
  - Completion status
  - Dates for each
```

### Profile Actions
```
Edit Profile  → Opens (placeholder for future)
Logout        → Confirms → Clears data → Back to login
```

---

## 📊 Analytics Dashboard

### KPI Cards (4 metrics)
```
Total Assignments    → Count across all courses
Completed Assignments → Number finished
Completion Rate      → Percentage (color changes based on rate)
Active Classes       → Number of courses
```

### Chart
```
Bar chart showing:
- Pending (orange)
- Completed (green)  
- Submitted (blue)

Filters: All Time | This Month | This Week
```

### Tables
```
Course Performance Table:
- Course Name, Code
- Total Assignments
- Completed Count
- Progress Bar + %
- Status Badge

Assignment Details Table:
- Assignment Name
- Course Code
- Due Date
- Status Indicator
- Days Left
- Completion %
```

### Insights
```
Smart messages based on:
✓ Completion Rate (75%+ is excellent)
⏰ Overdue Assignments (if any)
🚀 Busy Week Ahead (3+ due in 3 days)
⭐ Consistent Effort (3+ completed this week)
```

### Export
```
Click "Export Report" button
Downloads JSON file with:
- All statistics
- Course data
- Assignment list
- Insights
- Export timestamp
```

---

## 🔑 Keyboard Shortcuts

```
Escape           → Close modal or menu
Enter            → Submit login form
Hamburger Icon   → Toggle mobile menu
Click Overlay    → Close mobile menu
```

---

## 🎨 Status Colors

```
Status Badges:
Pending   → Orange (#f59e0b)
Completed → Green (#22c55e)
Submitted → Blue (#3b82f6)
Overdue   → Red (#ef4444)

Performance Levels:
Excellent (≥75%) → Green
Good (≥50%)      → Blue
Needs Work (<50%)→ Orange/Red
```

---

## 💾 Data Storage

### localStorage Keys
```javascript
localStorage.userEmail              // Your email
localStorage.userName               // Your name
localStorage.studyTrackerAssignments // Assignment JSON array
```

### What Gets Saved
```
✓ Login info (email, name)
✓ All assignments (auto-save)
✓ Assignment edits (immediate)
✓ Deletions (permanent)
✓ Persists across sessions
```

---

## 🔐 Authentication

### Login Flow
```
1. Go to Login.html
2. Email: student@example.com (or your email)
3. Password: password123 (or your password)
4. Click "Login"
5. Redirected to homepage.html
```

### Demo Mode
```
- No Firebase configured? Demo mode works!
- Fake 1.5s delay simulating API
- All features work normally
- Great for testing
```

### Logout Flow
```
1. Click "🚪 Logout" button
2. Confirm logout dialog
3. localStorage cleared
4. Redirected to Login.html
```

---

## 📱 Mobile Usage

### Navigation
```
Three lines icon (≡) = Hamburger menu
Tap it to open sidebar
Tap link to navigate
Tap X or outside to close
```

### Screen Sizes
```
Mobile    < 480px   → Single column
Tablet    768px     → 2 columns  
Desktop   1024px+   → 3-4 columns
```

### Touch Friendly
```
✓ Large buttons for fingers
✓ Proper spacing between buttons
✓ Readable text at all sizes
✓ Modal optimized for small screens
✓ Tables scroll horizontally if needed
```

---

## 📈 Assignment Status Meanings

```
🕐 PENDING
   Not yet started or in progress
   Show in filter for action items

✓ COMPLETED  
   Finished and submitted
   Show your done work

📤 SUBMITTED
   Turned in to teacher
   Waiting for grading

⏰ OVERDUE
   Past due date but not completed
   Needs immediate attention!
```

---

## 🎯 Course Codes Reference

```
MTH 202  → Calculus I
PHY 204  → Physics II
CSC 201  → Data Structures
ENG 205  → Literature
```

Can add more in the dropdown in assignments form!

---

## 💡 Pro Tips

### Tip 1: Add All Assignments ASAP
Add assignments as soon as assigned so you don't forget

### Tip 2: Check Profile Weekly
Review your stats to stay motivated

### Tip 3: Use Analytics for Planning
Check busy weeks ahead to plan your study schedule

### Tip 4: Export Reports
Export analytics for your records or to share progress

### Tip 5: Update Status Regularly
Mark assignments as completed for accurate completion rate

### Tip 6: Mobile First
Works great on phone - use it on the go!

### Tip 7: Track Timeline
Assignment timeline helps you see historical progress

### Tip 8: Watch Your KPIs
Completion rate is a great motivator!

---

## 🆘 Troubleshooting

### Page redirects to login
```
→ Not authenticated
→ Go to Login.html and login
→ Or use demo mode
```

### Data doesn't appear
```
→ Check localStorage isn't full
→ Try refreshing page
→ Check browser allows localStorage
```

### Modal won't close
```
→ Click outside modal
→ Press Escape key
→ Click Cancel button
```

### Mobile menu stuck
```
→ Refresh page
→ Click overlay
→ Press Escape
```

### Chart not showing
```
→ Check JavaScript enabled
→ Refresh page
→ Check browser console (F12)
```

---

## 📊 Navigation Map

```
LOGIN.HTML
    ↓
HOMEPAGE.HTML
    ├─→ ASSIGNMENTS.HTML
    ├─→ PROFILE.HTML
    ├─→ ADMIN.HTML (Analytics)
    └─→ LOGOUT → Back to LOGIN
```

---

## 🎓 Workflow Example

### Monday Morning
1. Login to app
2. Go to "Assignments" page
3. Add all new assignments for the week
4. Set due dates correctly
5. Review on "Profile" to see new counts

### Mid-Week Check
1. Click "Profile"
2. Review assignment timeline
3. Check enrolled classes progress
4. See completion rate

### Friday Night
1. Click "Admin" (Analytics)
2. Check completion status
3. Read insights for next week
4. Export report to archive

### Logout
1. Click "Logout" button
2. See you next time!

---

## 🔗 Integration Points

### Homepage Links
```
All sidebar links now work:
🏠 Home       → homepage.html
📋 Assignments → assignments.html ⭐
👤 Profile    → profile.html ⭐
📊 Analytics  → Admin.html ⭐
🚪 Logout     → Clears & redirects
```

### Data Sync
```
Assignments page ─┐
                  ├→ localStorage
Profile page ─────┤
                  ├→ Used by all pages
Admin dashboard ──┘
```

---

## 📞 Getting Help

### See Full Docs
```
README.md         → Overview & quickstart
FEATURES.md       → Detailed feature guide
FIREBASE_SETUP.md → Firebase integration
```

### Check Code Comments
```
Each JavaScript file has detailed comments
explaining what each section does
```

### Need Firebase?
```
See FIREBASE_SETUP.md for step-by-step
how to configure and connect Firebase
```

---

## ⭐ Key Features Summary

```
✅ Add/Edit/Delete Assignments
✅ Filter by Status
✅ View Profile with Stats
✅ Timeline of Assignments
✅ Course Progress Tracking
✅ Analytics Dashboard
✅ Smart Insights
✅ Export Reports
✅ Mobile Responsive
✅ Authentication System
✅ Data Persistence
✅ Firebase Ready
```

---

**Print this card for quick reference!**
**Last Updated: January 12, 2026**
