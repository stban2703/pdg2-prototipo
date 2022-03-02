import { createMeeting } from "./modules/firestore.js"
import { parseTimestampToDate } from "./utils/date-format.js"

export function onSelectMeetingMode() {
    const createMeetingForm = document.querySelector('.createmeeting-form')
    if (createMeetingForm && window.location.href.includes("#createmeeting")) {
        const modeInput = createMeetingForm.mode
        const platformInput = createMeetingForm.platform
        const urlInput = createMeetingForm.url
        const placeInput = createMeetingForm.place
        const virtualMeetingSection = document.querySelector('.createmeeting-form__section--virtual')
        const inPersonMeetingSection = document.querySelector('.createmeeting-form__section--inperson')

        modeInput.addEventListener('input', function () {
            if (modeInput.value == "Virtual") {
                virtualMeetingSection.classList.remove("hidden")
                inPersonMeetingSection.classList.add("hidden")
                platformInput.setAttribute('required', '')
                urlInput.setAttribute('required', '')
                placeInput.removeAttribute('required')
            } else {
                virtualMeetingSection.classList.add("hidden")
                inPersonMeetingSection.classList.remove("hidden")
                platformInput.removeAttribute('required')
                urlInput.removeAttribute('required')
                placeInput.setAttribute('required', '')
            }
        })
    }
}

export function submitMeeting() {
    const createMeetingForm = document.querySelector('.createmeeting-form')
    if (createMeetingForm && window.location.href.includes("#createmeeting")) {
        const virtualMeetingSection = document.querySelector('.createmeeting-form__section--virtual')
        const inPersonMeetingSection = document.querySelector('.createmeeting-form__section--inperson')

        createMeetingForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const name = createMeetingForm.name.value
            const date = createMeetingForm.date.value
            const time = createMeetingForm.time.value
            const duration = createMeetingForm.duration.value
            const mode = createMeetingForm.mode.value
            const platform = createMeetingForm.platform.value
            const url = createMeetingForm.url.value
            const place = createMeetingForm.place.value

            //console.log(new Date(("" + date + "T" + time + ":00").replace(/-/g, '\/').replace(/T.+/, '')))
            //console.log(new Date("" + date + "T" + time + ":00").getTime()) // <========== Usar este
            console.log(time)
            /*if(inPersonMeetingSection.classList.contains("hidden")) {
                console.log("Es virtual")
                createMeeting(name, date, time, duration, mode, platform, url, null)
            } else if(virtualMeetingSection.classList.contains("hidden")) {
                console.log("Es presencial")
                createMeeting(name, date, time, duration, mode, null, null, place)
            }*/
        })
    }
}