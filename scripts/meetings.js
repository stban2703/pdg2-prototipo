import { getMeetings } from "./modules/firestore.js"

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
                    <p class="meeting-item__date">${meeting.date}</p>
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

export function renderMeetingDetails() {
    const url = window.location.search.substring(1)
}
