// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mungaieve-58b3d.firebaseapp.com",
  projectId: "mungaieve-58b3d",
  storageBucket: "mungaieve-58b3d.appspot.com",
  messagingSenderId: "189897880959",
  appId: "1:189897880959:web:c48e547e67776c94a9564a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
