import { createMeeting } from "./modules/firestore.js"

export function onSelectMeetingMode() {
    const createMeetingForm = document.querySelector('.createmeeting-form')
    const modeInput = createMeetingForm.mode
    const platformInput = createMeetingForm.platform
    const urlInput = createMeetingForm.url
    const placeInput = createMeetingForm.place
    const virtualMeetingSection = document.querySelector('.createmeeting-form__section--virtual')
    const inPersonMeetingSection = document.querySelector('.createmeeting-form__section--inperson')

    if (createMeetingForm && window.location.href.includes("#createmeeting")) {
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
/*
createMeetingForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const name = createMeetingForm.name.value
    const date = createMeetingForm.date.value
    const time = createMeetingForm.time.value
    const duration = createMeetingForm.duration.value
    const mode = createMeetingForm.mode.value
    const place = createMeetingForm.place.value
    const platform = createMeetingForm.platform.value
    const link = createMeetingForm.link.value

    const newMeeting = {
        name: name,
        date: date,
        time: time,
        duration: duration,
        mode: mode,
        place: place,
        platform: platform,
        link: link,
        status: "pending",
        totalParticipants: 6,
        confirmedParticipants: 0
    }

    createMeeting(newMeeting)
    createMeetingForm.reset()
})*/