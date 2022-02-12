import { firebase } from "./firebase.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { createUser, getUserFromDb } from "./firestore.js";

const auth = getAuth()

export const signUp = function (email, password, name, lastname) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            createUser(user.uid, name, lastname, email, "teacher")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + ": " + errorMessage)
        });
}

export const signIn = function (email, password) {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        getUserFromDb(user.uid)
        window.location = 'index.html'
        console.log(user.uid + " ha iniciado sesion")
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