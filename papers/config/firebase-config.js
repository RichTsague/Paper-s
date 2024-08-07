// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpngvtmKOeo7HNpuxXKF_pE15xNhnw02M",
  authDomain: "the-dancelab.firebaseapp.com",
  projectId: "the-dancelab",
  storageBucket: "the-dancelab.appspot.com",
  messagingSenderId: "304325549588",
  appId: "1:304325549588:web:7650024b7ee3f6e5095101"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
