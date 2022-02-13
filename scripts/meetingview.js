import { firebase } from "./modules/firebase.js";
import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
const db = getFirestore(firebase)

const meetingViewInfo = document.querySelector(".meetingview__info")
const meetingViewLink = document.querySelector(".meetingview__section--link")

const meetingId = location.search.replace("?", "")
const meeting = getMeeting(meetingId)

async function getMeeting(id) {
    const meetingRef = doc(db, "meetings", id);
    const docSnap = await getDoc(meetingRef);
    if (docSnap.exists()) {
        const meeting = docSnap.data()
        if (meeting) {

            const meetingStatus = document.querySelector(".meetingview__status")
            meetingStatus.innerText = `${meeting.status == "pending" ? "Reunión pendiente" : "Historial de reuniones"}`

            meetingViewInfo.innerHTML = `
                <p style="font-weight: 700;">Nombre: <span>${meeting.name}</span></p>
                <p style="font-weight: 700;">Fecha: <span>${meeting.date}</span></p>
                 <p style="font-weight: 700;">Hora: <span>${meeting.time}</span></p>
                <p style="font-weight: 700;">Modalidad: <span>${meeting.mode}</span></p>
                <p style="font-weight: 700;">${meeting.platform ? "Medio" : "Lugar"}: <span>${meeting.platform ? meeting.platform : meeting.place}</span></p>
            `
            const meetingParticipants = document.querySelector(".meetingview__total")
            meetingParticipants.innerText = `${meeting.confirmedParticipants}/${meeting.totalParticipants}`

            if (meeting.platform) {
                meetingViewLink.classList.remove("hidden")
                meetingViewLink.innerHTML = `
                <p style="font-weight: 700;" class="meetingview__url">Link de la reunión: <a href="${meeting.link}" class=""><span>${meeting.link}</span></a></p>
                `
            }
        }
    } else {
        console.log("No existe este usuario");
    }
}
