import { createMeeingMinutes } from "./modules/firestore.js"
import { parseDateToTimestamp, parseMilitaryTimeToStandard } from "./utils/date-format.js"


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
    copy.forEach((e, i) => {
        const agreementDiv = document.createElement('div')
        agreementDiv.classList.add("agreement")
        agreementDiv.innerHTML = `
            <div class="agreement__number">
                <p>${i + 1}</p>
            </div>
            <p class="agreement__text">${e}</p>
            <button type="button" class="agreement__delete">
                <img src="./images/deleteagreement.svg" alt="" />
            </button>
        `

        agreementListSection.appendChild(agreementDiv)

        const deleteAgreementBtn = agreementDiv.querySelector(".agreement__delete")
        deleteAgreementBtn.addEventListener('click', () => {
            removeAgreement(i)
        })
    });
}

export function submitMeetingMinutes() {
    const createMeetingMinutesForm = document.querySelector('.createmeetingminutes-form')
    if (createMeetingMinutesForm && window.location.href.includes("#createmeetingminutes")) {
        createMeetingMinutesForm.addEventListener('submit', (event) => {
            event.preventDefault()
            console.log("subir")
            const name = createMeetingMinutesForm.name.value
            const date = createMeetingMinutesForm.date.value
            const time = createMeetingMinutesForm.time.value
            const assistants = createMeetingMinutesForm.elements['assistants[]']
            const meetingId = window.location.hash.split("?")[1]

            let timestamp = parseDateToTimestamp(new Date("" + date + "T" + time + ":00"))
            let standarTime = parseMilitaryTimeToStandard(time)

            let assistantsList = []
            assistants.forEach(e => {
                if (e.checked) {
                    assistantsList.push(e.value)
                }
            })

            if(agreementsList.length > 0 && assistantsList.length > 0) {
                createMeeingMinutes(name, timestamp, standarTime, assistantsList, agreementsList, meetingId)
            } else if(agreementsList.length == 0) {
                alert("Debes agregar por lo menos un acuerdo")
            } else if(assistantsList.length == 0){
                alert("Debes agregar por lo menos un asistente")
            }
        })
    } else {
        //console.log("No funciona")
    }
}