import { getMeetingMinutes } from "./modules/firestore.js"


export async function renderMeetingMinutesDetails() {
    const meetingMinutesSection = document.querySelector(".meetingminutes")

    if(meetingMinutesSection && window.location.href.includes("#meetingminutesdetails")) {
        const minutesId = window.location.hash.split("?")[1]
        const meetingMinutes = await getMeetingMinutes(minutesId)
        console.log(meetingMinutes)
    }
}