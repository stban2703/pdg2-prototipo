import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

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
const auth = getAuth()

export const signUp = function (email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
}

export const signIn = function (email, password) {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user.uid)
    })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });

}

export const logOut = function () {
    signOut(auth).then(() => {
        console.log("Salio")
      }).catch((error) => {
        // An error happened.
        console.log("No salio")
      });
}

export const checkAuthState = function() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          console.log(uid)
        } else {
          console.log("Empty")
        }
      });
}
