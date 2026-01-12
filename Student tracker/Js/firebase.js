// firebase.js (Firebase v9+ CDN Modular SDK)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6cv8uB21xI2Jf3TTNek3tOpkrM5EI8ds",
  authDomain: "study-tracker-1a735.firebaseapp.com",
  projectId: "study-tracker-1a735",
  storageBucket: "study-tracker-1a735.firebasestorage.app",
  messagingSenderId: "397536791358",
  appId: "1:397536791358:web:af1213d9e10b39a74ffa6f",
  measurementId: "G-H96Y2MVBQK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log('✅ Firebase initialized (study-tracker-1a735)');
console.log('Current origin:', window.location.origin);

// Google Sign-In function
export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log("✅ Google login success:", user.email);
      return user;
    })
    .catch((error) => {
      console.error("❌ Google login error:", error.code, error.message);
      throw error;
    });
}

// Export all auth functions and objects
export { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
};
