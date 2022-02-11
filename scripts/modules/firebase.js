import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCHB5GVaYYH95v1r1msBjBDwWAGme4cg3I",
    authDomain: "pdg-memo.firebaseapp.com",
    projectId: "pdg-memo",
    storageBucket: "pdg-memo.appspot.com",
    messagingSenderId: "210391284983",
    appId: "1:210391284983:web:a35e0cb56de19a3b36e7f2",
    measurementId: "G-TCDGY4W5Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebase = app