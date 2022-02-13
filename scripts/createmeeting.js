import { createMeeting } from "./modules/firestore.js"

const createMeetingForm = document.querySelector('.createMeetingForm')
const modeInput = createMeetingForm.mode
const virtualMeeting = document.querySelector('.virtualMeeting')
const inPersonMeeting = document.querySelector('.inPersonMeeting')

modeInput.addEventListener('input', function () {
    if (modeInput.value == "Virtual") {
        virtualMeeting.classList.remove("hidden")
        inPersonMeeting.classList.add("hidden")
    } else {
        virtualMeeting.classList.add("hidden")
        inPersonMeeting.classList.remove("hidden")
    }
})

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
})