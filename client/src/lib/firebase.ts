import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsvtthVkDTHn54MG0mbsiBEKj4YnuSmhU",
  authDomain: "corestone-grader-f4f31.firebaseapp.com",
  projectId: "corestone-grader-f4f31",
  storageBucket: "corestone-grader-f4f31.firebasestorage.app",
  messagingSenderId: "647364637704",
  appId: "1:647364637704:web:303fa9c263541fce10cdbd",
  measurementId: "G-TZ68DFQYT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;