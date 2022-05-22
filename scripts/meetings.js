import { userInfo } from "./main.js"
import { getMeetingDetails, getMeetings, updateMeetingAssistants } from "./modules/firestore.js"
import { parseTimestampToDate, parseTimestampToIcsDate } from "./utils/date-format.js"
import { hideLoader, showLoader } from "./utils/loader.js"
import { sortByDateAscending, sortByDateDescending } from "./utils/sort.js"

export async function getInitialMeetings(userInfo, currentRole) {
    const meetinglistScreen = document.querySelector(".meetinglist-screen")

    if (meetinglistScreen && window.location.href.includes("#meetinglist")) {
        showLoader()

        const createMeetingButton = document.querySelector(".addMeetingBtn")
        const alternativeCreateMeetingButton = document.querySelector(".alternativeAddMeetingButton")

        const meetingListSection = document.querySelector(".meetinglist-screen__meetings")
        const meetingListSectionAdmin = document.querySelector(".meetinglist-screen__meetings--admin")
        const meetingsSettingsForm = document.querySelector(".memoselectsubject-screen__controls--meetings")

        const meetingList = await getMeetings()
        meetingList.sort(sortByDateAscending)
        let listCopy = [...meetingList]

        if (userInfo.groups) {
            listCopy = meetingList.filter(meeting => {
                return userInfo.groups.includes(meeting.group)
            })
        }

        const groups = []
        const careers = []
        const departments = []

        meetingList.forEach((meeting) => {
            if (!groups.includes(meeting.group)) {
                groups.push(meeting.group)
            }
            if (!careers.includes(meeting.career)) {
                careers.push(meeting.career)
            }
            if (!departments.includes(meeting.department)) {
                departments.push(meeting.department)
            }
        })

        const departmentFilterSelect = meetingsSettingsForm.department
        departments.forEach(elem => {
            const option = document.createElement("option")
            option.value = elem
            option.innerHTML = elem
            departmentFilterSelect.appendChild(option)
        })

        const careerFilterSelect = meetingsSettingsForm.career
        careers.forEach(elem => {
            const option = document.createElement("option")
            option.value = elem
            option.innerHTML = elem
            careerFilterSelect.appendChild(option)
        })

        const groupFilterSelect = meetingsSettingsForm.group
        groups.forEach(elem => {
            const option = document.createElement("option")
            option.value = elem
            option.innerHTML = elem
            groupFilterSelect.appendChild(option)
        })

        if (currentRole === "leader") {
            alternativeCreateMeetingButton.classList.remove("hidden")

        }

        if (currentRole === "admin") {
            document.querySelector(".section-banner__description").classList.add("hidden")
            meetingListSectionAdmin.classList.remove("hidden")
            meetingListSection.classList.add("hidden")
            document.querySelector(".meetinglist-screen__header").classList.remove("hidden")
            renderMeetingsForAdmin(listCopy)
            onSortFilterMeetingsListener(meetingList)
        } else {
            meetingListSectionAdmin.classList.add("hidden")
            meetingListSection.classList.remove("hidden")
            document.querySelector(".meetinglist-screen__header").classList.add("hidden")
            renderMeetings(listCopy, currentRole)
        }

        hideLoader()
    }
}

function renderMeetings(list, currentRole) {
    const pendingList = document.querySelector(".meetinglist-screen__list--pending")
    const finishedList = document.querySelector(".meetinglist-screen__list--finished")

    pendingList.innerHTML = ``
    finishedList.innerHTML = ``

    list.forEach(meeting => {
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
            </section>
            <section class="meeting-item__controls">
                    ${meeting.minutesId.length === 0 && currentRole === 'leader' ?
                    `<a href="#createmeetingminutes?${meeting.id}" class="createMeetingMinutesBtn board-edit-button--secondary">
                        <p>Crear acta</p>
                    </a>` : ``}
                    ${meeting.minutesId.length > 0 ?
                    `<a href="#meetingminutesdetails?${meeting.minutesId}" class="seeMeetingBtn board-edit-button">
                        <p>Ver acta</p>
                    </a>`:
                    `<a href="#meetingdetails?${meeting.id}" class="seeMeetingBtn board-edit-button">
                        <p>Ver detalle</p>
                    </a>`}                    
            </section>
        `

        if (meeting.minutesId.length > 0) {
            finishedList.appendChild(meetingItem)
        } else {
            pendingList.appendChild(meetingItem)
        }
    })
}

function renderMeetingsForAdmin(list) {
    const finishedListAdmin = document.querySelector(".meetinglist-screen__list--admin")

    finishedListAdmin.innerHTML = ``

    const copy = [...list].filter(elem => {
        return elem.minutesId.length > 0
    })

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
            </section>
            <section class="meeting-item__controls">
                    ${meeting.minutesId.length > 0 ?
                    `<a href="#meetingminutesdetails?${meeting.minutesId}" class="seeMeetingBtn board-edit-button">
                        <p>Ver acta</p>
                    </a>`:
                    `<a href="#meetingdetails?${meeting.id}" class="seeMeetingBtn board-edit-button">
                        <p>Ver detalle</p>
                    </a>`}                    
            </section>
        `

        finishedListAdmin.appendChild(meetingItem)
    })
}

function onSortFilterMeetingsListener(meetings) {
    const meetingsSettingsForm = document.querySelector(".memoselectsubject-screen__controls--meetings")

    if (window.location.href.includes("#meetinglist") && meetingsSettingsForm) {
        const meetingsSortSelect = meetingsSettingsForm.date
        const departmentFilterSelect = meetingsSettingsForm.department
        const careerFilterSelect = meetingsSettingsForm.career
        const groupFilterSelect = meetingsSettingsForm.group

        meetingsSettingsForm.addEventListener('input', () => {
            sortFilterMeetings(meetings, meetingsSortSelect, departmentFilterSelect, careerFilterSelect, groupFilterSelect)
        })
    }
}

function sortFilterMeetings(meetings, meetingSort, departmentFilter, careerFilter, groupFilter) {
    let filterCopy = [...meetings]

    if (meetingSort.value.length > 0) {
        if (meetingSort.value == "ascending") {
            filterCopy = [...filterCopy].sort(sortByDateAscending)
        } else if (meetingSort.value = "descending") {
            filterCopy = [...filterCopy].sort(sortByDateDescending)
        }
    }

    if (departmentFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.department == departmentFilter.value) {
                return true
            }
        })
    }

    if (careerFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.career == careerFilter.value) {
                return true
            }
        })
    }

    if (groupFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.group == groupFilter.value) {
                return true
            }
        })
    }

    renderMeetingsForAdmin(filterCopy)
}

export async function renderMeetingDetails(role) {
    const meetingInfoColumns = document.querySelectorAll(".meeting__info-column")
    const meetingAssistants = document.querySelector(".meeting__assistants")
    const addMeetingMinutesBtn = document.querySelector(".alternativeCreateMinutesButton")
    const confirmRejectMeetingSection = document.querySelector(".confirm-reject-meeting")

    if (meetingInfoColumns.length > 0 && window.location.href.includes("#meetingdetails")) {
        showLoader()
        const meetingId = window.location.hash.split("?")[1]
        const meeting = await getMeetingDetails(meetingId)

        addMeetingMinutesBtn.href = `#createmeetingminutes?${meetingId}`

        const participantsCopy = [...meeting.confirmedParticipants]
        const currentParticipant = participantsCopy.find((m) => {
            return m.id == userInfo.id
        })

        if (currentParticipant) {
            document.querySelector(".confirmMeetingBtn").classList.remove("meetingNoSelected")
        }

        confirmMeetingAssistance(meeting)

        if (meeting) {
            if (role === "leader" && userInfo.leaderGroup == meeting.group) {
                addMeetingMinutesBtn.classList.remove("hidden")
                //confirmRejectMeetingSection.classList.add("hidden")
            }

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

        const downloadMeetingButton = document.querySelector(".downloadMeetingBtn")
        downloadMeetingButton.addEventListener('click', () => {
            const parsedIcsStartDate = parseTimestampToIcsDate(meeting.date, meeting.time)
            //console.log(parsedIcsStartDate)

            let startTimeHour = parseInt(meeting.time.split(":")[0])
            let durationValue = parseInt(meeting.duration.split(" ")[0])
            let amPm = meeting.time.split(" ")[1]

            let endTimeHour = startTimeHour + durationValue
            let timeArray = [13, 14]
            let index = 0
            if(endTimeHour > 12) {
                index = timeArray.findIndex(e => {
                    return e === endTimeHour
                })
                endTimeHour = index + 1
                amPm = "pm"
            }

            let stringEndTime = endTimeHour + ":" + meeting.time.split(":")[1].split(" ")[0] + " " + amPm
            const parsedIcsEndDate = parseTimestampToIcsDate(meeting.date, stringEndTime)

            console.log(parsedIcsStartDate)
            console.log(parsedIcsEndDate)

            let cal = ics();
            cal.addEvent(meeting.name, `Reunión reflexiva del bloque ${meeting.group}`, 
            `${meeting.mode == "Virtual" ? meeting.platform + ": " + meeting.url : meeting.place}`, parsedIcsStartDate, parsedIcsEndDate);
            cal.download('reunionReflexiva');
        })

        hideLoader()
    }
}

function confirmMeetingAssistance(meeting) {
    const confirmRejectMeetingSection = document.querySelector(".confirm-reject-meeting")

    if (confirmRejectMeetingSection && window.location.href.includes("#meetingdetails")) {
        const assistanceModal = document.querySelector(".memo-question-modal--assistance")

        const confirmBtn = document.querySelector(".confirmMeetingBtn")
        confirmBtn.addEventListener('click', () => {
            const participantsCopy = [...meeting.confirmedParticipants]

            const currentParticipant = participantsCopy.find((m) => {
                return m.id == userInfo.id
            })

            if (!currentParticipant) {
                showLoader()
                participantsCopy.push({
                    id: userInfo.id,
                    name: userInfo.name + " " + userInfo.lastname
                })
                updateMeetingAssistants(meeting.id, participantsCopy).then(() => {
                    hideLoader()
                    assistanceModal.classList.remove("hidden")
                    //location.reload()
                })
            } else if (currentParticipant) {
                alert("Ya confirmaste tu participación")
            }
        })

        const rejectBtn = document.querySelector(".rejectMeetingBtn")
        rejectBtn.addEventListener('click', () => {
            const participantsCopy = [...meeting.confirmedParticipants]

            const currentParticipantIndex = participantsCopy.findIndex((m) => {
                return m.id == userInfo.id
            })

            if (currentParticipantIndex < 0) {
                alert("No has confirmado tu participación en esta reunión")
            } else if (currentParticipantIndex >= 0) {
                showLoader()
                participantsCopy.splice(currentParticipantIndex, 1)
                updateMeetingAssistants(meeting.id, participantsCopy).then(() => {
                    hideLoader()
                    alert("Se ha retirado tu participación en esta reunión")
                    location.reload()
                })
            }
        })

        const closeAssistanceModalButton = document.querySelector(".closeAssistanceModalButton")
        closeAssistanceModalButton.addEventListener('click', () => {
            assistanceModal.classList.add("hidden")
            window.location.reload()
        })
    }
}
