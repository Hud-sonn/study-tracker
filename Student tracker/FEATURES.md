# Study Tracker - Complete Feature Documentation

## 📚 System Overview

Study Tracker is a comprehensive student academic management system with:
- **Authentication System** - Secure login/signup with Firebase readiness
- **Assignment Management** - Create, track, and manage assignments by course
- **Student Profile** - View detailed academic progress and statistics
- **Admin Dashboard** - Analytics and performance insights

---

## 🎯 Feature 1: Assignments Management Page

### Location
- **URL**: `assignments.html`
- **JavaScript**: `js/assignments.js`
- **Styling**: Integrated in `assignments.html` with responsive design

### Features Implemented

#### 1.1 Add Assignment
- **Button**: "+ Add Assignment" at top right
- **Modal Form** with fields:
  - Assignment Title (required)
  - Class/Course dropdown (required)
  - Description (optional)
  - Due Date (required)
  - Status selector (Pending/Completed/Submitted)
- **Validation**: All required fields checked before submission
- **Success Message**: Toast notification on creation

#### 1.2 Edit Assignment
- **Button**: "Edit" on each assignment card
- **Modal Reopens** with pre-filled data
- **Update**: Click "Save Assignment" to update
- **Real-time Sync**: Immediately updates display

#### 1.3 Delete Assignment
- **Button**: "Delete" on each assignment card
- **Confirmation Dialog**: Prevents accidental deletion
- **Instant Removal**: Card disappears from display

#### 1.4 View Assignments
- **Grid Layout**: Responsive card-based display
- **Sort**: Automatically sorted by due date (earliest first)
- **Status Badges**: Visual indicators (Pending/Completed/Submitted)
- **Days Left**: Calculated and displayed for each assignment

#### 1.5 Filter Assignments
- **Filter Buttons**: All / Pending / Completed / Submitted
- **Real-time Filtering**: Grid updates instantly
- **Active State**: Current filter highlighted

#### 1.6 Assignment Card Details
Each card displays:
- 📝 **Assignment Title**
- 🏫 **Course Code** (Badge)
- 📖 **Description**
- 📚 **Course Name** & **Due Date**
- ⏳ **Days Until Due**
- 📅 **Added Date**
- Status badge with icon
- Edit/Delete action buttons

### Data Storage
- **Primary**: localStorage with key `studyTrackerAssignments`
- **Format**: JSON array of assignment objects
- **Auto-save**: Changes persist across sessions
- **Firebase-ready**: Can be synced to Firebase Realtime Database

### Assignment Data Structure
```javascript
{
  id: 1234567890,                    // Unique timestamp ID
  title: "Math Homework",            // Assignment name
  course: "MTH 202",                 // Course code
  courseName: "Calculus I",          // Full course name
  description: "Complete exercises", // Assignment details
  dueDate: "2026-01-15",            // ISO date format
  status: "pending",                // pending | completed | submitted
  createdAt: "2026-01-12T...",      // ISO timestamp
  completedAt: null                 // Timestamp when marked complete
}
```

### Advanced Features
- **Form Validation**: Email-like error messages
- **Demo Data**: 3 sample assignments on first load
- **Keyboard Support**: Escape closes modal
- **Mobile Responsive**: Single column on mobile
- **Empty State**: Helpful message when no assignments
- **Error Handling**: User-friendly error toasts

### AssignmentManager Class Methods
```javascript
// Add new assignment
assignmentManager.addAssignment(data)

// Update existing
assignmentManager.updateAssignment(id, data)

// Delete assignment
assignmentManager.deleteAssignment(id)

// Get by status
assignmentManager.getByStatus(status)

// Get by course
assignmentManager.getByCourse(course)

// Get statistics
assignmentManager.getStats()

// Sort by due date
assignmentManager.sortByDueDate()

// Get overdue items
assignmentManager.getOverdue()
```

---

## 👤 Feature 2: Student Profile Page

### Location
- **URL**: `profile.html`
- **JavaScript**: `js/profile.js`
- **Styling**: Integrated in `profile.html` with gradient header

### Features Implemented

#### 2.1 Profile Header
- **Avatar**: Initials from student name (e.g., "JD" for John Doe)
- **Name**: Welcome greeting with student name
- **Email**: Display from localStorage
- **Join Date**: Month and year of account creation
- **Gradient Background**: Purple to pink gradient

#### 2.2 Quick Statistics Cards
Four KPI cards displaying:
- **Total Assignments**: All assignments count
- **Completed**: Number of completed assignments
- **Completion Rate**: Percentage of completion
- **Classes Enrolled**: Unique courses count

#### 2.3 Personal Information Section
Displays:
- **Email Address**: From login
- **Student ID**: Generated (STU + random 3-digit number)
- **Account Status**: Always "Active"
- **Member Since**: Month/year joined
- **Buttons**:
  - ✎ Edit Profile (placeholder for future)
  - 🚪 Logout (functional - confirms before logout)

#### 2.4 Enrolled Classes
- **Grid Layout**: Each class as a card
- **Class Details**:
  - Course Code (badge)
  - Course Name
  - Total assignments count
  - Completed count
  - Progress bar (visual percentage)
  - Completion percentage

#### 2.5 Assignment Timeline
- **Vertical Timeline**: Visual progression through assignments
- **Timeline Items Include**:
  - Assignment title (linked to course)
  - Course name
  - Due date
  - Completion status badge
  - Completion date (if completed)
- **Color Coding**: Pending (purple) vs Completed (green)
- **Sort**: Most recent first

#### 2.6 Performance Metrics
- **Completion Rate**: Percentage of finished assignments
- **Course Performance**: Breakdown by course
- **Assignment History**: Complete timeline view
- **Unique Classes**: Count of enrolled courses

### Data Sources
- **Student Data**: From localStorage (email, name)
- **Assignment Data**: From localStorage assignments array
- **Generated Data**: Student ID, member since date

### StudentProfile Class Methods
```javascript
// Load assignments
profile.loadAssignments()

// Display profile header
profile.displayProfileHeader()

// Show statistics
profile.displayStats()

// Render enrolled classes
profile.displayEnrolledClasses()

// Show timeline
profile.displayAssignmentTimeline()

// Get enrolled classes
profile.getEnrolledClasses()

// Get statistics
profile.getStats()
```

### UI Features
- **Responsive**: Mobile-first design adapts to all screens
- **Animations**: Slide-down animations on load
- **Icons**: Emoji icons for visual context
- **Color Coding**: Status indicators with appropriate colors
- **Progress Bars**: Visual representation of completion

---

## 📊 Feature 3: Admin Dashboard (Analytics)

### Location
- **URL**: `admin.html`
- **JavaScript**: `js/admin.js`
- **Styling**: Integrated in `admin.html`

### Features Implemented

#### 3.1 Key Performance Indicators (KPIs)
Four metric cards with trends:

**Total Assignments**
- Shows: Overall assignment count
- Trend: "+2 this week" indicator
- Icon: 📚 Books

**Completed Assignments**
- Shows: Successfully completed count
- Trend: "+1 completed" indicator
- Icon: ✓ Checkmark

**Completion Rate**
- Shows: Percentage of completion
- Trend: Up/Right/Down indicator based on rate
- Color Changes:
  - Green (↑) if >= 75%
  - Blue (→) if >= 50%
  - Red (↓) if < 50%
- Icon: 📈 Chart

**Active Classes**
- Shows: Number of enrolled courses
- Trend: "Active" status
- Icon: 📊 Dashboard

#### 3.2 Assignment Completion by Status Chart
- **Chart Type**: Horizontal bar chart
- **Data Series**:
  - Pending (Orange bar)
  - Completed (Green bar)
  - Submitted (Blue bar)
- **Features**:
  - Count displayed on each bar
  - Course labels below each bar
  - Proportional heights
  - Hover effects for details
  - Time filter (All Time / This Month / This Week)

#### 3.3 Performance by Course Table
Displays all courses with:
- **Course Name**: Full course title
- **Code**: Course code
- **Assignments**: Total count
- **Completed**: Completed count
- **Progress**: Visual bar + percentage
- **Status Badge**: 
  - Excellent (Green) if >= 75%
  - Good (Blue) if >= 50%
  - Needs Work (Orange) if < 50%

#### 3.4 Assignment Details Table
Complete list of all assignments:
- **Assignment**: Name with emphasis
- **Course**: Course code
- **Due Date**: Formatted date
- **Status**: Indicator dot + status text
- **Days Left**: Time until due (or OVERDUE)
- **Completion**: Progress bar + percentage

#### 3.5 Study Insights
Smart, AI-like messages based on performance:

**Excellent Progress** (75%+ completion)
- 🎯 Icon
- Encouragement message
- Green color

**Good Progress** (50-75% completion)
- 📈 Icon
- Motivational message
- Blue color

**More Work Needed** (< 50% completion)
- ⚠️ Icon
- Action-oriented message
- Orange color

**Overdue Assignments**
- ⏰ Icon
- Red color
- Urgent message if any overdue

**Busy Week Ahead**
- 🚀 Icon
- Alert if 3+ assignments due within 3 days
- Orange color

**Consistent Effort**
- ⭐ Icon
- Celebration if 3+ completed this week
- Purple color

#### 3.6 Export Report
- **Button**: "📥 Export Report"
- **Format**: JSON file
- **Contents**:
  - Export timestamp
  - All statistics
  - Course performance data
  - Assignment list
  - Generated insights
- **Filename**: `analytics-report-YYYY-MM-DD.json`
- **Uses**: For record-keeping or external analysis

### Data Analysis Functions

```javascript
// Core statistics
analytics.getStatistics()
// Returns: {total, completed, submitted, pending, completionRate, uniqueClasses}

// Course performance
analytics.getCoursesPerformance()
// Returns: Array of courses with performance metrics

// Generate insights
analytics.generateInsights()
// Returns: Array of smart insight objects with messages

// Days calculation
analytics.getDaysUntilDue(dateString)
// Returns: Number of days until assignment due

// Average days left
analytics.getAverageDaysLeft()
// Returns: Average days left for pending assignments
```

### Analytics Metrics Calculated
- ✓ Total assignments
- ✓ Completed assignments
- ✓ Submitted assignments
- ✓ Pending assignments
- ✓ Completion percentage
- ✓ Per-course completion rates
- ✓ Overdue assignment count
- ✓ Days until due dates
- ✓ Completion trend (up/stable/down)
- ✓ Assignment pace/velocity

### Visualizations
- **KPI Cards**: Large metrics with color coding
- **Bar Chart**: Status distribution visual
- **Progress Bars**: Course and assignment completion
- **Status Indicators**: Color dots for quick scanning
- **Trend Indicators**: Up/down/stable arrows
- **Tables**: Detailed data in tabular format

### Responsive Design
- KPI cards stack on mobile
- Chart adapts to smaller screens
- Tables become scrollable on mobile
- All text remains readable
- Touch-friendly button sizes

---

## 🔗 Integration Points

### Navigation Links
All pages have updated sidebar navigation:
```html
<a href="homepage.html">🏠 Home</a>
<a href="assignments.html">📋 Assignments</a>
<a href="#" class="disabled">📅 Class Schedule</a>
<a href="#" class="disabled">✓ Tasks</a>
<a href="profile.html">👤 Profile</a>
<a href="admin.html">📊 Analytics</a>
```

### Authentication Checks
All pages include:
```javascript
const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
  window.location.href = 'Login.html';
}
```

### Data Flow
1. **Login** → Stores email & name in localStorage
2. **Homepage** → Updates welcome message with name
3. **Assignments** → CRUD operations on localStorage
4. **Profile** → Reads from assignments & localStorage
5. **Admin** → Analyzes assignment data

### Logout Flow
- Click "🚪 Logout" on Homepage or Profile
- Confirmation dialog
- Clear localStorage
- Redirect to Login.html

---

## 💾 Data Structure

### localStorage Keys
```javascript
// User authentication
localStorage.getItem('userEmail')     // "user@email.com"
localStorage.getItem('userName')      // "John Doe"

// Assignments data
localStorage.getItem('studyTrackerAssignments')
// JSON string containing array of assignment objects
```

### Assignment Object
```javascript
{
  id: 1705056000000,                  // Unique ID (timestamp)
  title: "Math Homework",             // Display name
  course: "MTH 202",                  // Course code
  courseName: "Calculus I",           // Course name
  description: "Complete exercises",  // Details
  dueDate: "2026-01-15",              // YYYY-MM-DD format
  status: "pending",                  // pending|completed|submitted
  createdAt: "2026-01-12T...",        // ISO timestamp
  completedAt: null                   // ISO timestamp or null
}
```

---

## 🎨 Styling & Design

### Color Scheme
- **Dark Background**: #0f0f14
- **Card Background**: #1a1a23
- **Border**: #2d2d38
- **Primary Accent**: #a855f7 (Purple)
- **Secondary Accent**: #d946ef (Pink)
- **Text Primary**: #ffffff
- **Text Secondary**: #cbd5e1
- **Text Muted**: #a0aec0

### Status Colors
- **Pending**: #f59e0b (Orange)
- **Completed**: #22c55e (Green)
- **Submitted**: #3b82f6 (Blue)
- **Overdue**: #ef4444 (Red)

### Typography
- **System Fonts**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Headings**: 20px-32px, weight 600
- **Body**: 14px-16px, weight 400
- **Labels**: 12px-13px, weight 500

### Animations
- **Fade-in**: 0.3s ease on page load
- **Slide-down**: 0.3s ease for modals/cards
- **Transitions**: 0.2s-0.3s for hover states
- **Transform**: translateY for elevation effect

### Responsive Breakpoints
- **Mobile**: < 480px (single column)
- **Tablet**: 768px (2-3 columns)
- **Desktop**: 1024px+ (4+ columns)

---

## 🔐 Security Features

### Authentication
- ✓ Login required for all app pages
- ✓ Redirect to Login.html if not authenticated
- ✓ Logout clears localStorage
- ✓ Firebase-ready for real auth

### Data Protection
- ✓ XSS prevention: HTML escaping
- ✓ Form validation before submission
- ✓ Confirmation dialogs for destructive actions
- ✓ localStorage for client-side persistence

### Error Handling
- ✓ Try-catch blocks for data operations
- ✓ User-friendly error messages
- ✓ Toast notifications for feedback
- ✓ Graceful fallbacks

---

## 🚀 How to Use

### 1. Adding an Assignment
1. Click "+ Add Assignment" button
2. Fill in required fields:
   - Title: "Project Proposal"
   - Class: Select from dropdown
   - Due Date: Pick a date
3. (Optional) Add description and set status
4. Click "Save Assignment"
5. Assignment appears in grid, sorted by due date

### 2. Viewing Your Profile
1. Click "👤 Profile" in sidebar
2. See your overview stats
3. Review enrolled classes with progress
4. Check assignment timeline
5. Track completion history

### 3. Checking Analytics
1. Click "📊 Analytics" in sidebar
2. View KPI cards for quick stats
3. Check status chart for distribution
4. Review course performance table
5. Read insights for recommendations
6. Export report if needed

### 4. Logging Out
1. Click "🚪 Logout" button
2. Confirm logout
3. Redirected to Login page
4. Can log back in with credentials

---

## 📱 Mobile Experience

### Responsive Features
- ✓ Hamburger menu for navigation
- ✓ Single-column layouts
- ✓ Touch-friendly buttons
- ✓ Readable font sizes
- ✓ Proper spacing and padding
- ✓ Modal optimized for small screens
- ✓ Tables become scrollable
- ✓ Charts adapt to viewport

### Mobile Navigation
- Sidebar hides by default
- Hamburger icon opens menu
- Overlay closes menu on link click
- Escape key closes modals

---

## 🔧 Technical Details

### File Structure
```
Student Tracker/
├── index.html              # Landing page
├── Login.html              # Authentication
├── homepage.html           # Main dashboard
├── assignments.html        # Assignment management
├── profile.html            # Student profile
├── Admin.html              # Analytics dashboard
├── css/
│   ├── Style.css           # Landing page styles
│   ├── Login.css           # Auth styles
│   ├── Main.css            # App styles
├── Js/
│   ├── auth.js             # Authentication module
│   ├── Main.js             # Homepage scripts
│   ├── assignments.js      # Assignment manager
│   ├── profile.js          # Profile scripts
│   ├── admin.js            # Analytics module
└── Asset/Image/            # Image assets
```

### JavaScript Classes

**AssignmentManager**
- Manages assignment CRUD operations
- Handles localStorage persistence
- Provides data query methods
- Calculates statistics

**AssignmentUI**
- Renders assignment interface
- Manages modal interactions
- Handles user events
- Displays notifications

**StudentProfile**
- Loads student data
- Displays profile information
- Shows assignment timeline
- Calculates performance metrics

**AdminAnalytics**
- Aggregates performance data
- Generates insights
- Creates visualizations
- Exports reports

### Dependencies
- ✓ Vanilla JavaScript (ES6+)
- ✓ Firebase Auth SDK (optional, has fallback)
- ✓ localStorage API
- ✓ Modern browser APIs

---

## 🎓 Demo Data

### Pre-loaded Assignments
1. **Math Homework** - MTH 202, Due Jan 15 (Pending)
2. **Physics Lab Report** - PHY 204, Due Jan 17 (Pending)
3. **CS Project** - CSC 201, Due Jan 20 (Completed)

### Available Courses
- MTH 202 - Calculus I
- PHY 204 - Physics II
- CSC 201 - Data Structures
- ENG 205 - Literature

---

## 🔮 Future Enhancements

- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] User profile picture upload
- [ ] Class schedule calendar view
- [ ] Task management system
- [ ] Study timer with pomodoro
- [ ] Notes/document attachments
- [ ] Collaborative features
- [ ] GPA tracking
- [ ] Grade predictions
- [ ] Study group formation
- [ ] Recommendation engine
- [ ] Mobile app version
- [ ] Dark/Light theme toggle
- [ ] Export to calendar (iCal)

---

## 📞 Support & Troubleshooting

### Issue: Pages redirect to login
**Solution**: Must be logged in. Go to Login.html and create account or use demo mode.

### Issue: Data doesn't persist
**Solution**: Check browser allows localStorage. Try clearing cache and refreshing.

### Issue: Modal won't close
**Solution**: Click outside modal, press Escape, or use Cancel button.

### Issue: Charts not displaying
**Solution**: Check if JavaScript is enabled. Refresh page.

### Issue: Mobile menu not working
**Solution**: Ensure JavaScript is loaded. Try refreshing page.

---

## 📄 Files Modified/Created

### New Files Created
- ✓ `assignments.html` - Assignment management page
- ✓ `profile.html` - Student profile page
- ✓ `Admin.html` - Analytics dashboard
- ✓ `Js/assignments.js` - Assignment manager (600+ lines)
- ✓ `Js/profile.js` - Profile handler (300+ lines)
- ✓ `Js/admin.js` - Analytics system (500+ lines)

### Files Updated
- ✓ `homepage.html` - Added links, auth check, logout
- ✓ `FIREBASE_SETUP.md` - Documentation (created earlier)

### Total New Code
- **HTML**: ~1,500 lines
- **JavaScript**: ~1,400 lines
- **CSS**: ~1,000 lines (integrated in pages)
- **Total**: 3,900+ lines of new code

---

**Last Updated**: January 12, 2026  
**Version**: 2.0  
**Status**: Production Ready  
**License**: MIT
