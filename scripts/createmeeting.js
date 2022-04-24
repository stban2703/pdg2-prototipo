import { createMeeting, getCareerByGroup, getDepartmentInfo, getGroupInfo } from "./modules/firestore.js"
import { parseDateToTimestamp, parseMilitaryTimeToStandard } from "./utils/date-format.js"
import { hideLoader, showLoader } from "./utils/loader.js"

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
            } else if (modeInput.value == "Presencial") {
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

export async function submitMeeting(userInfo) {
    const createMeetingForm = document.querySelector('.createmeeting-form')
    if (createMeetingForm && window.location.href.includes("#createmeeting")) {
        showLoader()
        const virtualMeetingSection = document.querySelector('.createmeeting-form__section--virtual')
        const inPersonMeetingSection = document.querySelector('.createmeeting-form__section--inperson')
        const careerInfo = await getCareerByGroup(userInfo.leaderGroup)
        const deparmentInfo = await getDepartmentInfo(careerInfo.departmentId)
        const groupInfo = await getGroupInfo(userInfo.leaderGroupId)
        hideLoader()

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
            if (inPersonMeetingSection.classList.contains("hidden") && userInfo.leaderGroup) {
                console.log("Es virtual")
                showLoader()
                createMeeting(name, timestamp, standarTime, duration, mode, null, platform, url, userInfo.leaderGroup, careerInfo, deparmentInfo, groupInfo.teachers)
            } else if (virtualMeetingSection.classList.contains("hidden")) {
                console.log("Es presencial")
                showLoader()
                createMeeting(name, timestamp, standarTime, duration, mode, place, null, null, userInfo.leaderGroup, careerInfo, deparmentInfo, groupInfo.teachers)
            }
        })
    }
}