# Google OAuth Setup Guide

## ✅ What's Already Done

Your Study Tracker has Google OAuth **code ready**. The buttons and handlers exist in:
- **Login.html** - "Sign in with Google" button (lines 59, 125)
- **Js/auth.js** - Google authentication handlers (lines 305-351)

## ❌ What's Missing

Google authentication is **disabled in Firebase Console**. You need to enable it.

---

## 🚀 Enable Google OAuth in Firebase Console

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/study-tracker-1a735/authentication/providers

### Step 2: Enable Google Provider
1. Look for **"Google"** in the Sign-in providers list
2. Click on **"Google"**
3. Toggle the **"Enable"** switch to ON
4. Click **"Save"**

The status should change from ❌ to ✅

### Step 3: Configure OAuth Consent Screen
1. Firebase may ask you to configure the OAuth consent screen
2. Click **"Configure OAuth consent screen"** 
3. Fill in:
   - **App name**: Study Tracker
   - **User support email**: (your email)
   - **Authorized domains**: 
     - localhost
     - localhost:5500 (if using Live Server)
4. Click **"Save and Continue"**
5. Add your email as a **Test User**
6. Click **"Save and Continue"** until done

### Step 4: Add Authorized Domains
Go to: Firebase Console → Authentication → Settings → Authorized domains

Add these domains:
- ✅ localhost
- ✅ 127.0.0.1
- ✅ localhost:5500 (if using Live Server extension)
- ✅ localhost:8000 (if using Python server)

---

## 🧪 Test Google OAuth

### Using Live Server (Recommended)
1. In VS Code, right-click **Login.html**
2. Select **"Open with Live Server"**
3. In the opened page, click **"Sign in with Google"**
4. A Google login popup should appear
5. Sign in with your Google account
6. Should be redirected to homepage.html ✅

### Using Local File
1. Open **Login.html** directly in browser
2. Click **"Sign in with Google"**
3. May not work with file:// protocol
   - Use Live Server or local HTTP server instead

### Using Python Server
```bash
# In your project directory
python -m http.server 8000
```

Then open: http://localhost:8000/Login.html

If you prefer Node.js:
```bash
# From project root
npx http-server . -p 8000
```

Notes:
- Make sure `http://localhost:8000` is added to Firebase Console → Authentication → Settings → Authorized domains.
- Use `http://localhost:8000/Login.html` (not file://) when testing Google OAuth to ensure popup origins match.

---

## 🔍 Verify It's Working

After clicking "Sign in with Google":

**Success** - You see:
- ✅ Google login popup appears
- ✅ Can select Google account
- ✅ Gets redirected to homepage.html
- ✅ Shows "Welcome, [Your Name]"
- ✅ User appears in Firebase Console → Authentication → Users

**Failure** - You see errors:
- ❌ "Google login not configured"
- ❌ Popup blocked by browser
- ❌ CORS error
- ❌ "Invalid client ID"

---

## 🛠️ Troubleshooting

### Error: "Google login not configured"
**Cause**: Google provider is disabled in Firebase Console

**Solution**:
1. Go to Firebase Console → Authentication → Sign-in method
2. Check if Google shows ❌ (disabled)
3. Click Google provider
4. Toggle "Enable" to ON
5. Click "Save"
6. Refresh Login.html and try again

### Error: "Popup blocked by browser"
**Cause**: Browser is blocking the OAuth popup

**Solution**:
1. Check browser's popup blocker settings
2. Add your domain to popup whitelist
3. Use incognito/private window to test
4. Try a different browser

### Error: "Origin mismatch" or CORS error
**Cause**: Domain not authorized in Firebase

**Solution**:
1. Go to Firebase Console → Authentication → Settings
2. Check "Authorized domains" section
3. Add your current domain:
   - If using file:// → Use Live Server instead
   - If using localhost:5500 → Add to authorized domains
   - If using custom domain → Add to authorized domains
4. Wait 5 minutes for changes to propagate
5. Try again

### Error: "Invalid client ID"
**Cause**: Firebase config might be wrong

**Solution**:
1. Verify Firebase config in **Js/auth.js** (lines 5-12)
2. Check it matches Firebase Console → Project Settings
3. Make sure all values are correct:
   - apiKey: AIzaSyC6cv8uB21xI2Jf3TTNek3tOpkrM5EI8ds ✓
   - authDomain: study-tracker-1a735.firebaseapp.com ✓
   - projectId: study-tracker-1a735 ✓

### Google Popup Not Appearing
**Cause**: 
- Firebase not initialized
- Google provider not enabled
- Browser popup blocker active

**Solution**:
1. Check browser console (F12) for error messages
2. Ensure Firebase is loading (check Network tab)
3. Verify Google is enabled in Firebase Console
4. Try in incognito mode
5. Try different browser

---

## 📋 Pre-Flight Checklist

Before testing Google OAuth:

- [ ] Firebase project created (study-tracker-1a735)
- [ ] Google OAuth enabled in Firebase Console
- [ ] OAuth consent screen configured
- [ ] Test user added
- [ ] Authorized domains include localhost
- [ ] Firebase config in auth.js matches project settings
- [ ] Login.html has Google buttons
- [ ] Using Live Server or local HTTP server (not file://)
- [ ] Internet connection active
- [ ] Browser popup blocker allows this domain

---

## 🔐 Security Notes

**Current Setup** (Development):
- ✅ Google OAuth enabled for testing
- ✅ Works on localhost only
- ✅ Demo mode has fallback

**Before Production Deploy**:
- [ ] Use HTTPS only
- [ ] Add production domain to authorized domains
- [ ] Configure reCAPTCHA for account protection
- [ ] Set up email verification
- [ ] Enable 2FA in security settings
- [ ] Monitor suspicious login attempts
- [ ] Set up security rules for database

---

## 📚 More Information

**Firebase Documentation**:
- Google Auth Docs: https://firebase.google.com/docs/auth/web/google-signin
- Sign-in Methods: https://console.firebase.google.com/project/study-tracker-1a735/authentication/providers

**If Google OAuth Still Doesn't Work**:
1. Check error messages in browser console (F12)
2. Review Firebase Console → Authentication → Users to see login attempts
3. Try with a different Google account
4. Clear browser cache and cookies
5. Restart the local server

---

## ✅ Once Google OAuth Works

After successful setup:
- Users can sign in with Google
- Accounts appear in Firebase → Authentication → Users
- User data persists in localStorage
- Optional: Sync to Firebase Realtime Database (see IMPLEMENTATION.md)

**Next Steps**:
1. Test email/password login also works
2. Test logout functionality
3. Verify data persists on Login.html
4. Create assignments and verify persistence
5. Test all pages (homepage, profile, admin, assignments)

---

**Questions?**
Check the error message in the browser console (F12 → Console tab) for specific guidance.
