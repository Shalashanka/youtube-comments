import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrzghX-nlnRISi9Ayj-pCLv8G5xRkxUkk",
  authDomain: "comments-viewer-84d67.firebaseapp.com",
  projectId: "comments-viewer-84d67",
  storageBucket: "comments-viewer-84d67.firebasestorage.app",
  messagingSenderId: "53528857304",
  appId: "1:53528857304:web:10f43ed28fca2966afe5ad",
  measurementId: "G-SE9EPBHTDQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();