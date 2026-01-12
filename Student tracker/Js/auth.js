
// Use shared Firebase setup
import { auth, signInWithGoogle, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from './firebase.js';
import { showError, showSuccess, setLoading, validateEmail, validatePassword, initMobileNav } from './utils.js';

// ====================================
// DOM ELEMENTS
// ====================================
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

// Login form inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginEmailError = document.getElementById('loginEmailError');
const loginPasswordError = document.getElementById('loginPasswordError');
const loginError = document.getElementById('loginError');

// Signup form inputs
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');
const signupNameError = document.getElementById('signupNameError');
const signupEmailError = document.getElementById('signupEmailError');
const signupPasswordError = document.getElementById('signupPasswordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const signupError = document.getElementById('signupError');

// ====================================
// VALIDATION FUNCTIONS
// ====================================
// validateEmail and validatePassword imported from utils.js

function clearLoginErrors() {
  loginEmailError.textContent = '';
  loginPasswordError.textContent = '';
  loginError.textContent = '';
}

function clearSignupErrors() {
  signupNameError.textContent = '';
  signupEmailError.textContent = '';
  signupPasswordError.textContent = '';
  confirmPasswordError.textContent = '';
  signupError.textContent = '';
}

// ====================================
// UI HELPERS
// ====================================
// setLoading imported from utils.js

// showError and showSuccess imported from utils.js

// ====================================
// LOGIN FUNCTIONALITY
// ====================================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  clearLoginErrors();
  
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  
  // Validation
  if (!email) {
    showError(loginEmailError, 'Email is required');
    loginEmail.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    showError(loginEmailError, 'Please enter a valid email');
    loginEmail.focus();
    return;
  }
  
  if (!password) {
    showError(loginPasswordError, 'Password is required');
    loginPassword.focus();
    return;
  }
  
  if (!validatePassword(password)) {
    showError(loginPasswordError, 'Password must be at least 6 characters');
    loginPassword.focus();
    return;
  }
  
  setLoading(loginBtn, true);
  
  try {
    if (!initialized) {
      // Demo mode - simulate login
      await simulateDelay(1500);
      handleLoginSuccess({ email, displayName: 'Demo User' });
      return;
    }
    
    // Firebase login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    handleLoginSuccess(userCredential.user);
    
  } catch (error) {
    handleLoginError(error);
  } finally {
    setLoading(loginBtn, false);
  }
});

function handleLoginSuccess(user) {
  showSuccess(`Welcome back, ${user.displayName || user.email}!`);
  
  // Store user info
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userName', user.displayName || 'Student');
  
  // Redirect after brief delay
  setTimeout(() => {
    window.location.href = 'homepage.html';
  }, 800);
}

function handleLoginError(error) {
  const errorMessages = {
    'auth/user-not-found': 'Email not found. Please sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many failed attempts. Try again later.'
  };
  
  const message = errorMessages[error.code] || error.message || 'Login failed. Please try again.';
  showError(loginError, message);
}

// ====================================
// SIGNUP FUNCTIONALITY
// ====================================
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  clearSignupErrors();
  
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirmPwd = confirmPassword.value;
  
  // Validation
  if (!name) {
    showError(signupNameError, 'Name is required');
    signupName.focus();
    return;
  }
  
  if (name.length < 3) {
    showError(signupNameError, 'Name must be at least 3 characters');
    signupName.focus();
    return;
  }
  
  if (!email) {
    showError(signupEmailError, 'Email is required');
    signupEmail.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    showError(signupEmailError, 'Please enter a valid email');
    signupEmail.focus();
    return;
  }
  
  if (!password) {
    showError(signupPasswordError, 'Password is required');
    signupPassword.focus();
    return;
  }
  
  if (!validatePassword(password)) {
    showError(signupPasswordError, 'Password must be at least 6 characters');
    signupPassword.focus();
    return;
  }
  
  if (password !== confirmPwd) {
    showError(confirmPasswordError, 'Passwords do not match');
    confirmPassword.focus();
    return;
  }
  
  setLoading(signupBtn, true);
  
  try {
    if (!initialized) {
      // Demo mode - simulate signup
      await simulateDelay(1500);
      handleSignupSuccess({ email, displayName: name });
      return;
    }
    
    // Firebase signup
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile (modular SDK)
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    handleSignupSuccess(userCredential.user);
    
  } catch (error) {
    handleSignupError(error);
  } finally {
    setLoading(signupBtn, false);
  }
});

function handleSignupSuccess(user) {
  showSuccess(`Welcome ${user.displayName}! Account created successfully.`);
  
  // Store user info
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userName', user.displayName || 'Student');
  
  // Redirect after brief delay
  setTimeout(() => {
    window.location.href = 'homepage.html';
  }, 800);
}

function handleSignupError(error) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/operation-not-allowed': 'Email/password signup is not enabled.',
    'auth/too-many-requests': 'Too many attempts. Try again later.'
  };
  
  const message = errorMessages[error.code] || error.message || 'Signup failed. Please try again.';
  showError(signupError, message);
}

// ====================================
// GOOGLE OAUTH (Firebase Ready)
// ====================================
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    setLoading(googleLoginBtn, true);
    
    try {
      const user = await signInWithGoogle();
      handleLoginSuccess(user);
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        showError(loginError, `${error.code}: ${error.message || 'Google login failed.'}`);
      }
    } finally {
      setLoading(googleLoginBtn, false);
    }
  });
}

if (googleSignupBtn) {
  googleSignupBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    setLoading(googleSignupBtn, true);
    
    try {
      const user = await signInWithGoogle();
      handleSignupSuccess(user);
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        showError(signupError, `${error.code}: ${error.message || 'Google signup failed.'}`);
      }
    } finally {
      setLoading(googleSignupBtn, false);
    }
  });
}

// ====================================
// REAL-TIME INPUT VALIDATION
// ====================================
loginEmail.addEventListener('blur', () => {
  const email = loginEmail.value.trim();
  if (email && !validateEmail(email)) {
    showError(loginEmailError, 'Invalid email format');
  } else {
    loginEmailError.textContent = '';
  }
});

signupEmail.addEventListener('blur', () => {
  const email = signupEmail.value.trim();
  if (email && !validateEmail(email)) {
    showError(signupEmailError, 'Invalid email format');
  } else {
    signupEmailError.textContent = '';
  }
});

signupPassword.addEventListener('input', () => {
  const pwd = signupPassword.value;
  const confirmPwd = confirmPassword.value;
  
  if (confirmPwd && pwd !== confirmPwd) {
    showError(confirmPasswordError, 'Passwords do not match');
  } else {
    confirmPasswordError.textContent = '';
  }
});

confirmPassword.addEventListener('input', () => {
  const pwd = signupPassword.value;
  const confirmPwd = confirmPassword.value;
  
  if (confirmPwd && pwd !== confirmPwd) {
    showError(confirmPasswordError, 'Passwords do not match');
  } else {
    confirmPasswordError.textContent = '';
  }
});

// ====================================
// DEMO MODE HELPER
// ====================================
function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ====================================
// AUTO-LOGIN CHECK
// ====================================
if (initialized) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is already logged in, redirect to homepage
      window.location.href = 'homepage.html';
    }
  });
}

// ====================================
// KEYBOARD SHORTCUTS
// ====================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const toggle = document.getElementById('toggle');
    const activeForm = toggle.checked ? signupForm : loginForm;
    const submitBtn = toggle.checked ? signupBtn : loginBtn;
    
    if (activeForm.contains(document.activeElement) || document.activeElement === document.body) {
      submitBtn.click();
    }
  }
});

console.log('Auth module loaded. Firebase initialized:', initialized);
// Helpful debug: show current origin so you can add it to Firebase authorized domains
try {
  console.log('Current origin:', window.location.origin);
} catch (e) {
  console.log('Cannot read window.location.origin in this environment');
}
