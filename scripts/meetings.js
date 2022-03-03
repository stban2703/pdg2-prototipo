import { getMeetingDetails, getMeetings } from "./modules/firestore.js"
import { parseTimestampToDate } from "./utils/date-format.js"

export async function renderMeetings() {
    const meetinglistScreen = document.querySelector(".meetinglist-screen")

    if (meetinglistScreen && window.location.href.includes("#meetinglist")) {
        const pendingList = document.querySelector(".meetinglist-screen__list--pending")
        const finishedList = document.querySelector(".meetinglist-screen__list--finished")

        pendingList.innerHTML = ``
        finishedList.innerHTML = ``

        const meetingList = await getMeetings()
        const copy = [...meetingList]

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

    if (meetingInfoSection && window.location.href.includes("#meetingdetails")) {
        const meetingId = window.location.hash.split("?")[1]
        const meeting = await getMeetingDetails(meetingId)
        if (meeting) {
            meetingInfoSection.innerHTML = `
                <p class="subtitle subtitle--semibold">Nombre: <span>${meeting.name}</span></p>
                <p class="subtitle subtitle--semibold">Fecha: <span>${parseTimestampToDate(meeting.date)}</span></p>
                <p class="subtitle subtitle--semibold">Hora: <span>${meeting.time}</span></p>
                <p class="subtitle subtitle--semibold">Modalidad: <span>${meeting.mode}</span></p>
                <p class="subtitle subtitle--semibold">${meeting.mode == "Virtual" ? "Medio" : "Lugar"}: <span>${meeting.mode == "Virtual" ? meeting.platform : meeting.place}</span></p>
            `
            meetingAssistants.innerHTML = `${meeting.confirmedParticipants}/${meeting.totalParticipants}`
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
