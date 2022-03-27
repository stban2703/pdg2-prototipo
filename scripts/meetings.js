import { userInfo } from "./main.js"
import { getMeetingDetails, getMeetings, updateMeetingAssistants } from "./modules/firestore.js"
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

        if (userInfo.role == "leader") {
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
                        ${meeting.minutesId.length > 0 ? 
                        `<a href="#meetingminutesdetails?${meeting.minutesId}" class="seeMeetingBtn board-edit-button">
                            <p>Ver acta</p>
                        </a>`:
                        `<a href="#meetingdetails?${meeting.id}" class="seeMeetingBtn board-edit-button">
                            <p>Ver detalle</p>
                        </a>`
                        }
                        
                    </section>
                </section>
            `

            if(meeting.minutesId.length > 0) {
                finishedList.appendChild(meetingItem)
            } else {
                pendingList.appendChild(meetingItem)
            }
        })
    }
}

export async function renderMeetingDetails() {
    const meetingInfoColumns = document.querySelectorAll(".meeting__info-column")
    const meetingAssistants = document.querySelector(".meeting__assistants")
    const addMeetingMinutesBtn = document.querySelector(".addMeetingMinutesBtn")

    /*if (userInfo.role.includes("leader") && confirmRejectMeetingSection) {
        //console.log("Lider")
        confirmRejectMeetingSection.classList.add("hidden")
    }*/
    
    if (meetingInfoColumns.length > 0 && window.location.href.includes("#meetingdetails")) {
        const meetingId = window.location.hash.split("?")[1]
        const meeting = await getMeetingDetails(meetingId)

        addMeetingMinutesBtn.href = `#createmeetingminutes?${meetingId}`
        confirmMeetingAssistance(meeting)

        if (meeting) {

            if(userInfo.role.includes("leader") && userInfo.leaderGroup == meeting.group) {
                addMeetingMinutesBtn.classList.remove("hidden")
            }

            const confirmRejectMeetingSection = document.querySelector(".confirm-reject-meeting")
            if (confirmRejectMeetingSection && meeting.minutesId.length > 0) {
                confirmRejectMeetingSection.classList.add("hidden")
            }

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

            meetingInfoColumns[0].innerHTML = `
                <p class="meeting__subtitle subtitle subtitle--semibold">Nombre: <span>${meeting.name}</span></p>
                <p class="meeting__subtitle subtitle subtitle--semibold">Bloque: <span>${meeting.group}</span></p>
                <p class="meeting__subtitle subtitle subtitle--semibold">Modalidad: <span>${meeting.mode}</span></p>
                <p class="meeting__subtitle subtitle subtitle--semibold meeting__platform">${meeting.mode == "Virtual" ? "Medio" : "Lugar"}: ${meeting.mode == "Virtual" ? `<img src="./images/${iconSrc}" alt="">` : ''}<span>${meeting.mode == "Virtual" ? meeting.platform : meeting.place}</span></p>
            `
            meetingAssistants.innerHTML = `${meeting.confirmedParticipants.length}/${meeting.totalParticipants.length}`
            if (meeting.mode == "Virtual") {
                const linkElement = document.createElement('p')
                linkElement.classList.add("subtitle")
                linkElement.classList.add("subtitle--semibold")
                linkElement.classList.add("meeting__link")
                linkElement.innerHTML = `Link de la reunión: <a href=${meeting.url} target='_blank'>${meeting.url}</a>`
                meetingInfoColumns[0].appendChild(linkElement)
            }

            meetingInfoColumns[1].innerHTML = `
            <p class="meeting__subtitle subtitle subtitle--semibold">Fecha: <span>${parseTimestampToDate(meeting.date)}</span></p>
            <p class="meeting__subtitle subtitle subtitle--semibold">Hora: <span>${meeting.time}</span></p>
            <p class="meeting__subtitle subtitle subtitle--semibold">Duración: <span>${meeting.duration}</span></p>
            `

            const seeMinutesBtn = document.querySelector('.seeMinutesBtn')
            /*if(meeting.minutesId.length > 0) {
                seeMinutesBtn.classList.remove('hidden')
                seeMinutesBtn.href = `#meetingminutesdetails?${meeting.minutesId}`
            }*/
        } else {
            meetingInfoColumns[0].innerHTML = `<p class="subtitle subtitle--semibold"><span>No se encontró la reunión</span></p>`
        }
    }
}

function confirmMeetingAssistance(meeting) {
    const confirmRejectMeetingSection = document.querySelector(".confirm-reject-meeting")

    if (confirmRejectMeetingSection && window.location.href.includes("#meetingdetails")) {
        const confirmBtn = document.querySelector(".confirmMeetingBtn")
        confirmBtn.addEventListener('click', () => {
            const participantsCopy = [...meeting.confirmedParticipants]

            const currentParticipant = participantsCopy.find((m) => {
                return m == userInfo.name + " " + userInfo.lastname
            })
            
            const userGroup = userInfo.groups.find((e) => {
                return e == meeting.group
            })

            if(!currentParticipant && userGroup) {
                participantsCopy.push(userInfo.name + " " + userInfo.lastname)
                updateMeetingAssistants(meeting.id, participantsCopy).then(() => {
                    alert("¡Gracias por confirmar tu asistencia!")
                    location.reload()
                })
            } else if(!userGroup) {
                alert("Parece que no estás asignado a este bloque")
            } else if(currentParticipant) {
                alert("Ya confirmaste tu participación")
            }
        })

        const rejectBtn = document.querySelector(".rejectMeetingBtn")
        rejectBtn.addEventListener('click', () => {
            const participantsCopy = [...meeting.confirmedParticipants]

            const currentParticipantIndex = participantsCopy.findIndex((m) => {
                return m == userInfo.name + " " + userInfo.lastname
            })
            
            if(currentParticipantIndex < 0) {
                alert("No has confirmado tu participación en esta reunión")
            } else if(currentParticipantIndex >= 0) {
                participantsCopy.splice(currentParticipantIndex, 1)
                updateMeetingAssistants(meeting.id, participantsCopy).then(() => {
                    alert("Se ha retirado tu participación en esta reunión")
                    location.reload()
                })
            }
        })
    }
}
