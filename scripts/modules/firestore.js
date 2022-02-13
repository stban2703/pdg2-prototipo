import { firebase } from "./firebase.js";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    query,
    getDoc,
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { submitFile } from "./storage.js";

const firestore = getFirestore(firebase)
export const firestoreDb = firestore

export const createUser = async function (uid, name, lastname, email, role) {
    try {
        const userRef = doc(firestore, 'users', uid);

        const newUser = {
            id: uid,
            name: name,
            lastname: lastname,
            email: email,
            role: role
        }

        await setDoc(userRef, newUser).then(() => {
            localStorage.setItem('currentuser', JSON.stringify(newUser))
            window.location = 'index.html'
        }).catch((error) => {
            console.log(error)
        });
    } catch (e) {
        console.log(e)
    }
}

export const getUserFromDb = async function (uid) {
    const userRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const user = docSnap.data()
        localStorage.setItem('currentuser', JSON.stringify(user))
        window.location = 'index.html'
        console.log("Document data: " + user.name + ", " + user.role);
    } else {
        console.log("No existe este usuario");
    }
}

export const submitNote = async function (uid, name, week, category, subject, file) {
    try {
        const usernoteRef = doc(collection(firestore, "notes"))
        const newNote = {
            id: usernoteRef.id,
            name: name,
            week: week,
            subject: subject,
            category: category,
            fileReference: "",
            userId: uid,
            date: Date.now()
        }
        await setDoc(usernoteRef, newNote).then(() => {
            submitFile(file, usernoteRef.id)
        }).catch((error) => {
            console.log(error)
        });
    } catch (e) {
        console.log(e)
    }
}

export const updateFileReference = async function (id, fileUrl) {
    try {
        const usernoteRef = doc(firestore, "notes", id)
        await updateDoc(usernoteRef, {
            fileReference: fileUrl
        }).then(() => {
            window.location = "noteboard.html"
        })
    } catch (e) {
        console.log(e)
    }
}

export const createMeeting = async function(newMeeting) {
    try {
        const meetingRef = doc(collection(firestore, "meetings"))
        await setDoc(meetingRef, newMeeting).then(() => {
            window.location = "meetings.html"
        }).catch((error) => {
            console.log(error)
        });
    } catch(e) {

    }
}
 