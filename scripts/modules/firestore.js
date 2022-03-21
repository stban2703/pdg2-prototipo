import { firebase } from "./firebase.js";
import {
    getFirestore, collection, doc, addDoc, setDoc, updateDoc, query, getDoc, getDocs, where, deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { deleteFile, submitFile } from "./storage.js";
import { hideLoader } from "../utils/loader.js";

const firestore = getFirestore(firebase)
export const firestoreDb = firestore

// Note functions
export async function createNote(uid, name, week, category, subject, textNote, file, fileType, description) {
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
        descriptionText: description,
        period: "2022-1",
        date: Date.now()
    }

    await setDoc(usernoteRef, newNote).then(() => {
        if (file != null) {
            submitFile(file, usernoteRef.id)
        } else {
            updateFileReference(usernoteRef.id, null)
        }
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });

}

export async function updateFileReference(id, fileUrl) {
    const usernoteRef = doc(firestore, "notes", id)
    await updateDoc(usernoteRef, {
        fileReference: fileUrl
    }).then(() => {
        hideLoader()
        window.location = "index.html#notes"
    })
}

export async function getNotes(uid) {
    if (window.location.href.includes("#notes")) {
        const q = query(collection(firestore, "notes"), where("userId", "==", "" + uid))
        const querySnapshot = await getDocs(q);
        const noteList = querySnapshot.docs.map(doc => doc.data());
        return noteList
    }
    return []
}

export async function getNoteDetails(id) {
    const noteRef = doc(firestore, "notes", id)
    const docSnap = await getDoc(noteRef)
    if (docSnap.exists()) {
        const note = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return note
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function deleteNote(id) {
    await deleteDoc(doc(firestore, "notes", id)).then(() => {
        deleteFile(id)
    }).catch(error => {
        console.log(error)
    });
}

// Meetings functions
export async function createMeeting(name, date, time, duration, mode, place, platform, url, group) {
    const meetingRef = doc(collection(firestore, "meetings"))

    const newMeeting = {
        id: meetingRef.id,
        name: name,
        date: date,
        time: time,
        duration: duration,
        mode: mode,
        place: place,
        platform: platform,
        url: url,
        status: date < Date.now() ? "finished" : "pending",
        group: group,
        totalParticipants: ["Maria Juliana Ortiz", "Carlos Ramirez", "Wilson Lopez", "Jennifer Velez", "Roberto Martinez"],
        confirmedParticipants: [],
        minutesId: ""
    }
    await setDoc(meetingRef, newMeeting).then(() => {
        hideLoader()
        window.location = "index.html#meetinglist"
    }).catch((error) => {
        console.log(error)
    });
}

export async function getMeetingDetails(id) {
    const meetingRef = doc(firestore, "meetings", id)
    const docSnap = await getDoc(meetingRef)
    if (docSnap.exists()) {
        const meeting = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return meeting
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

export async function getMeetings() {
    const q = query(collection(firestore, "meetings"))
    const querySnapshot = await getDocs(q);
    let meetingList = []
    querySnapshot.forEach((doc) => {
        const meeting = doc.data()
        meeting.id = doc.id
        meetingList.push(meeting)
    })
    return meetingList
}

export async function updateMeetingAssistants(id, value) {
    const meetingRef = doc(firestore, "meetings", id);

    await updateDoc(meetingRef, {
        confirmedParticipants: value
    }).then(() => {
        console.log("Meeting updated")
    }).catch(e => {
        console.log(e)
    });
}

export async function updateMeetingMinutesReference(id, meetingMinutesId) {
    const meetingRef = doc(firestore, "meetings", id)
    await updateDoc(meetingRef, {
        minutesId: meetingMinutesId
    }).then(() => {
        console.log("Link de acta actualizado")
        hideLoader()
        window.location = "index.html#meetingminutesdetails?" + meetingMinutesId
    })
}

export async function createMeeingMinutes(name, date, time, assistants, agreements, meetingId) {
    const minutesRef = doc(collection(firestore, "minutes"))
    const newMinutes = {
        id: minutesRef.id,
        name: name,
        date: date,
        time: time,
        assistants: assistants,
        agreements: agreements,
        meetingId: meetingId
    }
    await setDoc(minutesRef, newMinutes).then(() => {
        updateMeetingMinutesReference(meetingId, minutesRef.id)
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

export async function getMeetingMinutes(id) {
    const minutesRef = doc(firestore, "minutes", id)
    const docSnap = await getDoc(minutesRef)
    if (docSnap.exists()) {
        const meetingMinutes = docSnap.data()
        //console.log("Document data:", docSnap.data());
        return meetingMinutes
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null
    }
}

// User functions
export const createUser = async function (uid, name, lastname, email, role) {
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
        hideLoader()
        window.location = 'index.html'
    }).catch((error) => {
        hideLoader()
        console.log(error)
    });
}

export const getUserFromDb = async function (uid) {
    const userRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        const user = docSnap.data()
        localStorage.setItem('currentuser', JSON.stringify(user))
        hideLoader()
        window.location = 'index.html'
        console.log("Document data: " + user.name + ", " + user.role);
    } else {
        console.log("No existe este usuario");
    }
}