import { getMeetingDetails, getMeetingMinutes } from "./modules/firestore.js"
import { parseTimestampToDate } from "./utils/date-format.js"

export async function renderMeetingMinutesDetails() {
    const meetingMinutesSection = document.querySelector(".meetingminutes")

    if(meetingMinutesSection && window.location.href.includes("#meetingminutesdetails")) {
        const minutesId = window.location.hash.split("?")[1]
        const meetingMinutes = await getMeetingMinutes(minutesId)
        const meetingInfo = await getMeetingDetails(meetingMinutes.meetingId)
        console.log(meetingMinutes)
        console.log(meetingInfo)

        const meetingMinutesHeader = document.querySelector('.meetingminutes__header')
        meetingMinutesHeader.innerHTML = `
            <h4 class="meetingminutes__title subtitle subtitle--semibold">Detalle del acta</h4>
            <p class="meetingminutes__date subtitle subtitle--semibold">Fecha: <span>${parseTimestampToDate(meetingMinutes.date)}</span></p>
        `

        const meetingMinutesInfo = document.querySelector('.meetingminutes__info')
        meetingMinutesInfo.innerHTML = `
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Nombre: <span>${meetingInfo.name}</span></p>
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Hora: <span>${meetingMinutes.time}</span></p>
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Bloque: <span>${meetingInfo.group}</span></p>
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Modalidad: <span>${meetingInfo.mode}</span></p>
        <p class="meetingminutes__subtitle meetingminutes__mode subtitle subtitle--semibold">${meetingInfo.mode == "Virtual" ? 'Medio' : 'Lugar'}: <img src="./images/teamsiconmini.svg" alt=""><span>${meetingInfo.mode == "Virtual" ? meetingInfo.platform : meetingInfo.place}</span></p>
        ${meetingInfo.mode == "Virtual" ? `<p class="meetingminutes__link subtitle subtitle--semibold">Link: <a href="${meetingInfo.url}" target="_blank">${meetingInfo.url}</a></p>` : ''}
        `

        const agreementItemsSection = document.querySelector('.agreement__items')
        agreementItemsSection.innerHTML = ``

        meetingMinutes.agreements.forEach(e => {
            
        });
    }
}