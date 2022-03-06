import { userInfo } from "./main.js"
import { getMeetingDetails, getMeetings } from "./modules/firestore.js"
import { parseTimestampToDate } from "./utils/date-format.js"
import { sortByDate } from "./utils/sort.js"

export async function renderMeetings() {
    const meetinglistScreen = document.querySelector(".meetinglist-screen")
    const createMeetingButton = document.querySelector(".addMeetingBtn")

    if (meetinglistScreen && window.location.href.includes("#meetinglist")) {
        const pendingList = document.querySelector(".meetinglist-screen__list--pending")
        const finishedList = document.querySelector(".meetinglist-screen__list--finished")

        pendingList.innerHTML = ``
        finishedList.innerHTML = ``

        const meetingList = await getMeetings()
        const copy = [...meetingList].sort(sortByDate)

        if(userInfo.role == "leader") {
            createMeetingButton.classList.remove("hidden")
        }

        copy.forEach(meeting => {
            const meetingItem = document.createElement("div")
            meetingItem.classList.add("meeting-item")
            meetingItem.innerHTML = `
                <section class="meeting-item__header">
                    <img class="meeting-item__icon" src="./images/meetingicon.svg" alt="">
                    <h4 class="meeting-item__title subtitle subtitle--semibold">${meeting.name}</h4>
                    <p class="meeting-item__date">${parseTimestampToDate(meeting.date)}</p>
                </section>
                <section class="meeting-item__content">
                    <section class="meeting-item__details">
                        <p class="meeting-item__subtitle">Bloque: <span>${meeting.group}</span></p>
                        <p class="meeting-item__subtitle">Hora: <span>${meeting.time}</span></p>
                        <p class="meeting-item__subtitle">Modalidad: <span>${meeting.mode}</span></p>
                        <p class="meeting-item__subtitle">${meeting.mode == 'Virtual' ? 'Medio' : 'Lugar'}: <span>${meeting.mode == 'Virtual' ? meeting.platform : meeting.place}</span></p>
                    </section>
                    <section class="meeting-item__controls">
                        <a href="#meetingdetails?${meeting.id}" class="seeMeetingBtn board-edit-button">
                            <p>Ver detalle</p>
                        </a>
                    </section>
                </section>
            `

            switch (meeting.status) {
                case "pending":
                    pendingList.appendChild(meetingItem)
                    break;
                case "finished":
                    finishedList.appendChild(meetingItem)
                    break;
            }
        })
    }
}

export async function renderMeetingDetails() {
    const meetingInfoSection = document.querySelector(".meeting-info-section")
    const meetingAssistants = document.querySelector(".meeting__assistants")
    const confirmRejectMeetingSection = document.querySelector(".confirm-reject-meeting")

    if(userInfo.role.includes("leader") && confirmRejectMeetingSection) {
        console.log("Lider")
        confirmRejectMeetingSection.classList.add("hidden")
    } 

    if (meetingInfoSection && window.location.href.includes("#meetingdetails")) {
        const meetingId = window.location.hash.split("?")[1]
        const meeting = await getMeetingDetails(meetingId)
        if (meeting) {

            let iconSrc = ""

            if (meeting.platform) {
                if (meeting.platform.includes("Meet")) {
                    iconSrc = "meeticonmini.svg"
                } else if (meeting.platform.includes("Teams")) {
                    iconSrc = "teamsiconmini.svg"
                } else if (meeting.platform.includes("Zoom")) {
                    iconSrc = "zoomiconmini.svg"
                }
            }

            meetingInfoSection.innerHTML = `
                <p class="subtitle subtitle--semibold">Nombre: <span>${meeting.name}</span></p>
                <p class="subtitle subtitle--semibold">Bloque: <span>${meeting.group}</span></p>
                <p class="subtitle subtitle--semibold">Fecha: <span>${parseTimestampToDate(meeting.date)}</span></p>
                <p class="subtitle subtitle--semibold">Hora: <span>${meeting.time}</span></p>
                <p class="subtitle subtitle--semibold">Modalidad: <span>${meeting.mode}</span></p>
                <p class="subtitle subtitle--semibold meeting-info-section__platform">${meeting.mode == "Virtual" ? "Medio" : "Lugar"}: ${meeting.mode == "Virtual" ? `<img src="./images/${iconSrc}" alt="">` : ''}<span>${meeting.mode == "Virtual" ? meeting.platform : meeting.place}</span></p>
            `
            meetingAssistants.innerHTML = `${meeting.confirmedParticipants.length}/${meeting.totalParticipants.length}`
            if (meeting.mode == "Virtual") {
                const linkElement = document.createElement('p')
                linkElement.classList.add("subtitle")
                linkElement.classList.add("subtitle--semibold")
                linkElement.classList.add("meeting__link")
                linkElement.innerHTML = `Link de la reunión: <a href=${meeting.url} target='_blank'>${meeting.url}</a>`
                meetingInfoSection.appendChild(linkElement)
            }
        } else {
            meetingInfoSection.innerHTML = `<p class="subtitle subtitle--semibold"><span>No se encontró la reunión</span></p>`
        }
    }
}
