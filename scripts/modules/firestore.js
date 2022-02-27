import { firebase } from "./firebase.js";
import {
    getFirestore, collection, doc, addDoc, setDoc, updateDoc, query, getDoc, getDocs, where
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { submitFile } from "./storage.js";

const firestore = getFirestore(firebase)
export const firestoreDb = firestore

// Note functions
export async function createNote(uid, name, week, category, subject, textNote, file, fileType) {
    const usernoteRef = doc(collection(firestore, "notes"))
    const newNote = {
        id: usernoteRef.id,
        userId: uid,
        name: name,
        week: parseInt(week),
        subject: subject,
        category: category,
        textNote: textNote,
        fileReference: "",
        fileType: fileType,
        date: Date.now()
    }

    await setDoc(usernoteRef, newNote).then(() => {
        if (file != null) {
            submitFile(file, usernoteRef.id)
        } else {
            updateFileReference(usernoteRef.id, null)
        }
    }).catch((error) => {
        console.log(error)
    });

}

export async function updateFileReference(id, fileUrl) {
    try {
        const usernoteRef = doc(firestore, "notes", id)
        await updateDoc(usernoteRef, {
            fileReference: fileUrl
        }).then(() => {
            window.location = "index.html#notes"
        })
    } catch (e) {
        console.log(e)
    }
}

export async function getNotes(uid) {
    const q = query(collection(firestore, "notes"), where("userId", "==", "" + uid))
    const querySnapshot = await getDocs(q);
    const noteList = querySnapshot.docs.map(doc => doc.data());
    return noteList
}



// User functions
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


// Meeting functions
export const createMeeting = async function (newMeeting) {
    try {
        const meetingRef = doc(collection(firestore, "meetings"))
        await setDoc(meetingRef, newMeeting).then(() => {
            window.location = "meetings.html"
        }).catch((error) => {
            console.log(error)
        });
    } catch (e) {

    }
}
