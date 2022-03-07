

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

export function onCheckbox() {
    /*const createMeetingMinutesForm = document.querySelector('.createmeetingminutes-form');
    const assistants = createMeetingMinutesForm.elements['assistants[]']

    createMeetingMinutesForm.addEventListener('submit', (event) => {
        event.preventDefault()
        let assistantsList = []

        assistants.forEach(e => {
            if(e.checked) {
                console.log(e.value)
            }
        })
    })*/
}