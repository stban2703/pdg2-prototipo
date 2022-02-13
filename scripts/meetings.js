import { firebase } from "./modules/firebase.js";
import {
    getFirestore,
    collection,
    query,
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const db = getFirestore(firebase)
const meetingsListPending = document.querySelector(".meetings__list--pending")
const meetingsListFinished = document.querySelector(".meetings__list--finished")
let meetingsList = []
getMeetings()

async function getMeetings() {
    const q = query(collection(db, "meetings"))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const meeting = doc.data()
        meeting.id = doc.id
        meetingsList.push(meeting)
        console.log(meeting.id)
    });
    console.log(meetingsList)
    renderMeeting(meetingsList)
}

function renderMeeting(list) {
    let copy = [...list]
    meetingsListPending.innerHTML = ``
    meetingsListFinished.innerHTML = ``

    copy.forEach((elem, i) => {
        const meetingItemDiv = document.createElement('div')
        meetingItemDiv.classList.add("meetingItem")
        meetingItemDiv.innerHTML = `
            <p class="meetingItem__name">${elem.name}</p>
            <p class="meetingItem__date">Fecha: ${elem.date}</p>
            <p class="meetingItem__mode">${elem.mode}</p>
            <p class="meetingItem__place">${elem.place ? elem.place : elem.platform}</p>
        `
        const meetingItemButton = document.createElement("button")
        meetingItemButton.classList.add("meetingItem__button")
        meetingItemButton.classList.add("button")
        meetingItemButton.classList.add("button--dark")
        meetingItemButton.classList.add("button--board")
        meetingItemButton.innerHTML = `
                <p>Ver detalle</p>
        `
        meetingItemButton.addEventListener('click', function () {
            window.location = `meetingview.html?${elem.id}`
        })
        meetingItemDiv.appendChild(meetingItemButton)

        switch (elem.status) {
            case "pending":
                meetingsListPending.appendChild(meetingItemDiv)
                break
            case "finished":
                meetingsListFinished.appendChild(meetingItemDiv)
                break
        }
    })
}
