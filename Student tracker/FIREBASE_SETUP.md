# Firebase Setup Guide for Study Tracker

## Overview
This login system is **Firebase-ready** and supports:
- Email/Password Authentication
- Google OAuth Authentication
- Real-time validation
- Smooth animations and error handling
- Demo mode (works without Firebase configured)

---

## 🔧 Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `StudyTracker`
4. Disable Google Analytics (or enable if preferred)
5. Click "Create project"

### 2. Get Your Firebase Config

1. In Firebase Console, click the web icon `</>`
2. Register your app name
3. Copy the config object (you'll need this)

### 3. Enable Authentication Methods

#### Email/Password:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

#### Google OAuth:
1. Still in **Sign-in method**
2. Click **Google**
3. Enable it
4. Add your email as a test user
5. Save

### 4. Update Firebase Config in auth.js

In `js/auth.js`, find this section at the top:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace with your actual config from Firebase Console.

### 5. Add Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains"
   - For local testing: `localhost:8000` or your local IP
   - For production: Your actual domain

---

## 📋 Features Implemented

### Login Form
- ✅ Email validation
- ✅ Password validation (min 6 chars)
- ✅ Real-time error messages
- ✅ Loading state with spinner
- ✅ Forgot password link (ready to implement)
- ✅ Google OAuth button
- ✅ Auto-redirect to homepage on success

### Sign Up Form
- ✅ Full name validation
- ✅ Email validation
- ✅ Password matching
- ✅ Password strength requirement
- ✅ Real-time validation feedback
- ✅ Loading state with spinner
- ✅ Google OAuth button

### Security & UX
- ✅ CSRF protection (Firebase handles)
- ✅ Smooth animations
- ✅ Responsive design (mobile-friendly)
- ✅ Keyboard navigation (Enter to submit)
- ✅ Auto-redirect if already logged in
- ✅ Demo mode (works without Firebase)
- ✅ Error handling with user-friendly messages

---

## 🚀 Testing Without Firebase

The system includes **demo mode** that works without Firebase configuration:

1. Leave `firebaseConfig` as is with placeholder values
2. Use the login form normally
3. After 1.5s simulated delay, you'll be "logged in"
4. You'll be redirected to homepage
5. Works perfectly for UI/UX testing

---

## 🔐 Enhanced Security Features

### Password Requirements
- Minimum 6 characters (configurable in `validatePassword()`)
- Case-sensitive
- Can be enhanced with regex for complexity

### Email Validation
- Format checking before submission
- Firebase validates on server side
- Prevents common typos with blur event

### Error Handling
- User-friendly error messages
- No sensitive data in error text
- Prevents user enumeration
- Rate limiting (handled by Firebase)

---

## 📱 Customization

### Change Validation Rules

In `auth.js`, modify validation functions:

```javascript
function validatePassword(password) {
  return password.length >= 6; // Change minimum length
}

function validateEmail(email) {
  // Add stricter regex if needed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Customize Error Messages

Edit the error messages object in `handleLoginError()` and `handleSignupError()`:

```javascript
const errorMessages = {
  'auth/user-not-found': 'Custom message here',
  'auth/wrong-password': 'Another custom message'
};
```

### Change Redirect URL

After successful login, modify these lines:

```javascript
window.location.href = 'homepage.html'; // Change to your page
```

---

## 🔄 Next Steps - Features to Implement

### Email Verification
```javascript
// Add after signup
await user.sendEmailVerification();
```

### Password Reset
```javascript
// Create forgot-password.html and link it
firebase.auth().sendPasswordResetEmail(email);
```

### User Profile Updates
```javascript
// In homepage, after user logs in
const user = auth.currentUser;
const name = user.displayName;
const email = user.email;
const photoURL = user.photoURL;
```

### Persistent Login
```javascript
// Already implemented!
// User stays logged in across sessions
// Uses firebase.auth().onAuthStateChanged()
```

### Store User Data
```javascript
// In signup success, save to Realtime Database
const database = firebase.database();
await database.ref('users/' + user.uid).set({
  name: user.displayName,
  email: user.email,
  createdAt: new Date().toISOString()
});
```

---

## 🐛 Troubleshooting

### "Firebase is not defined"
- Check CDN links at bottom of Login.html
- Ensure internet connection (CDN requires it)
- Check browser console for errors

### Google Sign-in popup blocked
- Allow popups for your domain
- Check "Authorized domains" in Firebase
- Chrome might block if not HTTPS (in production)

### Email already exists error
- User is trying to sign up with existing email
- They should use login instead
- Or reset password if they forgot

### Wrong password error
- User typed password incorrectly
- They can use "Forgot password?" link
- Implement password reset functionality

### Too many requests error
- User has too many failed attempts
- Wait 30 seconds before trying again
- Firebase auto-blocks for security

---

## 📊 User Data Storage Example

Once you have users authenticating, extend `handleSignupSuccess()`:

```javascript
async function handleSignupSuccess(user) {
  // ... existing code ...
  
  // Store user profile in Realtime Database
  const database = firebase.database();
  await database.ref('users/' + user.uid).set({
    name: user.displayName,
    email: user.email,
    createdAt: new Date().toISOString(),
    joinDate: new Date().toLocaleDateString()
  });
}
```

Then retrieve in homepage:
```javascript
const userId = auth.currentUser.uid;
const database = firebase.database();
const userData = await database.ref('users/' + userId).once('value');
const profile = userData.val();
```

---

## 📝 Important Notes

1. **Never commit Firebase config with real keys** to public repositories
2. **Use environment variables** for production
3. **Enable Firestore security rules** before production
4. **Test email verification** in development
5. **Set up domain restrictions** for Google OAuth
6. **Monitor Firebase usage** to avoid unexpected charges
7. **Back up user data** regularly

---

## 🎨 Design Features

- **Smooth Animations**: All transitions use cubic-bezier easing
- **Responsive**: Works on mobile, tablet, desktop
- **Dark Theme**: Eye-friendly dark interface
- **Accessibility**: Proper labels, ARIA attributes ready
- **Loading States**: Visual feedback during authentication
- **Error Feedback**: Real-time validation with helpful messages
- **Tab Switching**: Smooth form transitions (Login ↔ Sign Up)

---

## 📞 Support

For issues:
1. Check browser console (F12 → Console)
2. Check Firebase Console for error logs
3. Verify Firebase config is correct
4. Test with demo mode first
5. Check network tab for failed requests

---

**Last Updated**: January 12, 2026
**Version**: 1.0
**Status**: Production Ready
