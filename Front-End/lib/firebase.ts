// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase, ref, query, orderByKey, limitToLast, get, onValue, off, startAt, endAt} from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD14wZkvP46yP3jQAwzUBOSh9kf8m-7vwg",
  authDomain: "kumbung-sense.firebaseapp.com",
  databaseURL: "https://kumbung-sense-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kumbung-sense",
  storageBucket: "kumbung-sense.firebasestorage.app",
  messagingSenderId: "845687946504",
  appId: "1:845687946504:web:3540585e9d68d4ec2d40bd",
  measurementId: "G-F9H5CQQ24V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, query, orderByKey, limitToLast, get, onValue, off, startAt, endAt };