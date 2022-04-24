import { createMeeingMinutes, getMeetingDetails } from "./modules/firestore.js"
import { parseTimestampToDate } from "./utils/date-format.js"
import { showLoader } from "./utils/loader.js"

let agreementsList = []

export function createAgreement() {
    const agreementListSection = document.querySelector('.createmeetingminutes-form__agreementsList')
    if (agreementListSection && window.location.href.includes("#createmeetingminutes")) {
        const addAgreementBtn = document.querySelector('.addAgreementBtn')

        addAgreementBtn.addEventListener('click', function () {
            const agreementValue = document.querySelector('.newagreement').value

            if (agreementValue.length > 0) {
                agreementsList.push(agreementValue)
                document.querySelector('.newagreement').value = ""
                renderAgreements(agreementsList)
            }
        })
    }
}

function removeAgreement(index) {
    agreementsList.splice(index, 1)
    renderAgreements(agreementsList)
}

function renderAgreements(list) {
    const agreementListSection = document.querySelector('.createmeetingminutes-form__agreementsList')
    agreementListSection.innerHTML = ``
    const copy = [...list]
    copy.forEach((elem, i) => {
        const agreementDiv = document.createElement('div')
        agreementDiv.classList.add("agreement")
        agreementDiv.innerHTML = `
            <div class="agreement__number">
                <p>${i + 1}</p>
            </div>
            <p class="agreement__text">${elem}</p>
            <button type="button" class="agreement__delete">
                <img src="./images/deleteagreement.svg" alt="" />
            </button>
        `

        agreementListSection.appendChild(agreementDiv)

        const elemOriginalValue = elem.valueOf()

        const editableText = agreementDiv.querySelector(".agreement__text");
        editableText.addEventListener("dblclick", () => {
            editableText.setAttribute("contenteditable", true);
            editableText.focus()
        })

        function editAgreement(event) {
            let isClickInside = editableText.contains(event.target);
            editableText.setAttribute("contenteditable", false);

            if (!isClickInside && editableText.innerText.length > 0 && editableText.innerText != elemOriginalValue) {
                let itemIndex = agreementsList.findIndex(oldValue => {
                    return oldValue == elem
                })
                agreementsList[itemIndex] = editableText.innerText;
                renderAgreements(agreementsList)
                document.removeEventListener("click", editAgreement)
            } else if (!isClickInside && (editableText.innerText.length == 0 || editableText.innerText == elemOriginalValue)) {
                editableText.innerText = elemOriginalValue

            } else if (!isClickInside) {
                console.log("Nada")
            }
        }
        document.addEventListener("click", editAgreement)

        const deleteAgreementBtn = agreementDiv.querySelector(".agreement__delete")
        deleteAgreementBtn.addEventListener('click', () => {
            removeAgreement(i)
        })
    });
}

export async function getMeetingInfoForMinute() {
    const meetingId = window.location.hash.split("?")[1]
    const meetingInfoSection = document.querySelector(".createmeetingminutes-form__meeting-info")

    if (meetingInfoSection && window.location.href.includes("#createmeetingminutes")) {
        const meetingInfo = await getMeetingDetails(meetingId)
        meetingInfoSection.innerHTML = `
        <p class="meeting__subtitle subtitle subtitle--semibold">Nombre: <span>${meetingInfo.name}</span></p>
        <p class="meeting__subtitle subtitle subtitle--semibold">Fecha: <span>${parseTimestampToDate(meetingInfo.date)}</span></p>
        <p class="meeting__subtitle subtitle subtitle--semibold">Hora: <span>${meetingInfo.time}</span></p>
        <p class="meeting__subtitle subtitle subtitle--semibold">Bloque: <span>${meetingInfo.group}</span></p>
        <p class="meeting__subtitle subtitle subtitle--semibold">Modalidad: <span>${meetingInfo.mode}</span></p>
        <p class="meeting__subtitle subtitle subtitle--semibold meeting__platform">${meetingInfo.mode == "Virtual" ? "Medio" : "Lugar"}: <span>${meetingInfo.mode == "Virtual" ? meetingInfo.platform : meetingInfo.place}</span></p>
        `

        const participantListSection = document.querySelector(".createmeetingminutes-form__assistantsList")
        meetingInfo.totalParticipants.forEach(elem => {
            const participantItem = document.createElement("label")
            participantItem.className = "checkbox-input"
            participantItem.innerHTML = `
            <input id="${elem.id}" type="checkbox" name="assistants[]" value="${elem.name}" />
                ${elem.name}
            `
            participantListSection.appendChild(participantItem)
        })
    }
}

export function submitMeetingMinutes() {
    const createMeetingMinutesForm = document.querySelector('.createmeetingminutes-form')
    if (createMeetingMinutesForm && window.location.href.includes("#createmeetingminutes")) {

        const meetingId = window.location.hash.split("?")[1]

        createMeetingMinutesForm.addEventListener('submit', (event) => {
            event.preventDefault()
            console.log("subir")

            const summary = createMeetingMinutesForm.summary.value

            const assistants = createMeetingMinutesForm.elements['assistants[]']
            let assistantsList = []
            assistants.forEach(e => {
                if (e.checked) {
                    assistantsList.push({
                        id: e.id,
                        name: e.value
                    })
                }
            })

            if (agreementsList.length > 0 && assistantsList.length > 0) {
                showLoader()
                createMeeingMinutes(summary, assistantsList, agreementsList, meetingId)
            } else if (agreementsList.length == 0) {
                alert("Debes agregar por lo menos un acuerdo")
            } else if (assistantsList.length == 0) {
                alert("Debes agregar por lo menos un asistente")
            }
        })
    } else {
        //console.log("No funciona")
    }
}