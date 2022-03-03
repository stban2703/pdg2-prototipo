import { createMeeting } from "./modules/firestore.js"
import { parseDateToTimestamp, parseMilitaryTimeToStandard, parseTimestampToDate } from "./utils/date-format.js"

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
            } else if(modeInput.value == "Presencial") {
                virtualMeetingSection.classList.add("hidden")
                inPersonMeetingSection.classList.remove("hidden")
                platformInput.removeAttribute('required')
                urlInput.removeAttribute('required')
                placeInput.setAttribute('required', '')
            } else {
                virtualMeetingSection.classList.add("hidden")
                inPersonMeetingSection.classList.add("hidden")
                platformInput.removeAttribute('required')
                urlInput.removeAttribute('required')
                placeInput.removeAttribute('required', '')
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

            let timestamp = parseDateToTimestamp(new Date("" + date + "T" + time + ":00"))
            let standarTime = parseMilitaryTimeToStandard(time)

            //console.log(new Date(("" + date + "T" + time + ":00").replace(/-/g, '\/').replace(/T.+/, '')))
            // Carolina, francisco, andres
            if(inPersonMeetingSection.classList.contains("hidden")) {
                console.log("Es virtual")
                createMeeting(name, timestamp, standarTime, duration, mode, null, platform, url)
            } else if(virtualMeetingSection.classList.contains("hidden")) {
                console.log("Es presencial")
                createMeeting(name, timestamp, standarTime, duration, mode, place, null, null)
            }
        })
    }
}