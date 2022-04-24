import { getMeetingDetails, getMeetingMinutes } from "./modules/firestore.js"
import { parseTimestampToDate } from "./utils/date-format.js"

export async function renderMeetingMinutesDetails() {
    const meetingMinutesSection = document.querySelector(".meetingminutes")

    if (meetingMinutesSection && window.location.href.includes("#meetingminutesdetails")) {
        const minutesId = window.location.hash.split("?")[1]
        const meetingMinutes = await getMeetingMinutes(minutesId)
        const meetingInfo = await getMeetingDetails(meetingMinutes.meetingId)


        let iconSrc = ""
        if (meetingInfo.platform) {
            if (meetingInfo.platform.includes("Meet")) {
                iconSrc = "meeticonmini.svg"
            } else if (meetingInfo.platform.includes("Teams")) {
                iconSrc = "teamsiconmini.svg"
            } else if (meetingInfo.platform.includes("Zoom")) {
                iconSrc = "zoomiconmini.svg"
            }
        }

        const meetingMinutesHeader = document.querySelector('.meetingminutes__header')
        meetingMinutesHeader.innerHTML = `
            <h4 class="meetingminutes__title subtitle subtitle--semibold">Detalle del acta</h4>
            <p class="meetingminutes__date subtitle subtitle--semibold">Fecha: <span>${parseTimestampToDate(meetingInfo.date)}</span></p>
        `

        const meetingSummarySection = document.querySelector(".meetingminutes__summary")
        meetingSummarySection.innerHTML = `
            <p class="meetingminutes__subtitle subtitle subtitle--semibold">Resumen:</p>
            <p class="meetingminutes__summary-text">
                ${meetingMinutes.summary}
            </p>
        `

        const meetingMinutesInfo = document.querySelector('.meetingminutes__info')
        meetingMinutesInfo.innerHTML = `
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Nombre: <span>${meetingInfo.name}</span></p>
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Hora: <span>${meetingInfo.time}</span></p>
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Bloque: <span>${meetingInfo.group}</span></p>
        <p class="meetingminutes__subtitle subtitle subtitle--semibold">Modalidad: <span>${meetingInfo.mode}</span></p>
        <p class="meetingminutes__subtitle meetingminutes__mode subtitle subtitle--semibold">${meetingInfo.mode == "Virtual" ? 'Medio' : 'Lugar'}: ${meetingInfo.mode == "Virtual" ? `<img src="./images/${iconSrc}" alt="">` : ''}<span>${meetingInfo.mode == "Virtual" ? meetingInfo.platform : meetingInfo.place}</span></p>
        ${meetingInfo.mode == "Virtual" ? `<p class="meetingminutes__link subtitle subtitle--semibold">Link: <a href="${meetingInfo.url}" target="_blank">${meetingInfo.url}</a></p>` : ''}
        `

        const agreementItemsSection = document.querySelector('.agreement__items')
        agreementItemsSection.innerHTML = ``

        meetingMinutes.agreements.forEach((e, i) => {
            const agreementDiv = document.createElement('div')
            agreementDiv.classList.add('agreement')
            agreementDiv.innerHTML = `
            <div class="agreement__number">
                <p>${i + 1}</p>
                </div>
            <p class="agreement__text">${e}</p>
            `
            agreementItemsSection.appendChild(agreementDiv)
        });

        const assistantItemsSection = document.querySelector('.assistants__items')
        assistantItemsSection.innerHTML = ``

        meetingMinutes.assistants.forEach((e, i) => {
            const assistantDiv = document.createElement('div')
            assistantDiv.classList.add('assistant')
            assistantDiv.innerHTML = `
                <div class="assistant__icon">
                    <img src="./images/assistantgenericicon.svg" alt="">
                </div>
                <p class="assistant__name">${e.name}</p>
            `
            assistantItemsSection.appendChild(assistantDiv)
        })
    }
}