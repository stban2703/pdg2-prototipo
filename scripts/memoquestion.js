import { createMemoAnswer, getMemoQuestion, updateAnswerValue } from "./modules/firestore.js"
import { showLoader } from "./utils/loader.js"
import { asteriskToBold } from "./utils/text-format.js"

let currentQuestion = {}
let selectedOptions = []

export async function renderMemoQuestion() {
    const memoQuestionScreen = document.querySelector(".memoquestion-screen")

    if (memoQuestionScreen && window.location.href.includes("#memoquestion")) {
        const urlQuery = window.location.hash.split("?")[1]
        const urlQueryParts = urlQuery.split("_")
        const period = urlQueryParts[0]
        const subjectId = urlQueryParts[1]
        const questionId = urlQueryParts[2]

        currentQuestion = await getMemoQuestion(period, subjectId, questionId)

        // Titulo de seccion
        const memoQuestionSectionTitle = memoQuestionScreen.querySelector(".memoquestion-screen__title")
        memoQuestionSectionTitle.innerHTML = currentQuestion.section

        // Formulario general
        const memoQuestionForm = memoQuestionScreen.querySelector(".memoquestion-form")

        if (currentQuestion.type !== "improveactions") {
            // Titulo de subseccion
            const memoquestionSubsectionTitle = memoQuestionScreen.querySelector(".memoquestion-form__title")
            memoquestionSubsectionTitle.innerHTML = currentQuestion.subsection

            // Mostrar contenedor de pregunta normal
            const memoquestionContainerNormal = memoQuestionForm.querySelector(".memoquestion-form__container--normal")
            memoquestionContainerNormal.classList.remove("hidden")

            // Número de pregunta
            memoquestionContainerNormal.querySelector(".memoquestion-form__subtitle").innerHTML = `Pregunta ${currentQuestion.index}`

            // Descripcion de pregunta
            memoquestionContainerNormal.querySelector(".memoquestion-form__question").innerHTML = asteriskToBold(currentQuestion.question)

            // Contenedor de respuesta
            const memoAnswerContainer = memoquestionContainerNormal.querySelector(".memoquestion-form__answer")

            // Agregar tipo de respuesta
            switch (currentQuestion.type) {
                case "radio":
                    const radioAnswerQuestion = document.createElement('div')
                    radioAnswerQuestion.className = "memoquestion-form__radio-checkbox memoquestion-form__radio-checkbox--radio"

                    currentQuestion.options.forEach(option => {
                        const answerOption = document.createElement('label')
                        answerOption.className = "memo-radio-input"
                        answerOption.innerHTML = `
                        <input type="radio" name="radioanswer" value="${option}" required />
                        ${option}
                        `
                        radioAnswerQuestion.appendChild(answerOption)
                    });
                    memoAnswerContainer.appendChild(radioAnswerQuestion)
                    break;

                case "checkbox":
                    const checkboxAnswerQuestion = document.createElement('div')
                    checkboxAnswerQuestion.className = "memoquestion-form__radio-checkbox memoquestion-form__radio-checkbox--checkbox"
                    renderMemoOption(currentQuestion.options, checkboxAnswerQuestion)
                    memoAnswerContainer.appendChild(checkboxAnswerQuestion)
                    break;
            }
            memoQuestionForm.querySelector(".memoquestion-form__container").appendChild(memoAnswerContainer)
        }

    }
}


function addMemoOption(list, checkboxAnswerQuestion, value) {
    const newOption = value
    list.push(newOption)
    const allOptions = document.querySelector(".memoquestion-form").elements['checkbox[]']

    allOptions.forEach((elem, index) => {
        if (elem.checked) {
            selectedOptions.push(index)
        }
    })
    renderMemoOption(list, checkboxAnswerQuestion)
}

function renderMemoOption(list, checkboxAnswerQuestion) {
    checkboxAnswerQuestion.innerHTML = ``
    list.forEach((option, index) => {
        const answerOption = document.createElement('label')
        answerOption.className = "checkbox-input checkbox-input--memo"
        answerOption.innerHTML = `
        <input type="checkbox" name="${"checkbox"}[]" value="${option}" />
        ${option}
        `

        // Recuperar opciones marcadas
        for (let j = 0; j < selectedOptions.length; j++) {
            const selectedIndex = selectedOptions[j];
            if (index === selectedIndex) {
                answerOption.querySelector("input").checked = true
                break;
            }
        }
        checkboxAnswerQuestion.appendChild(answerOption)
    })
    selectedOptions = []

    const openAddOptionButton = document.createElement('button')
    openAddOptionButton.type = "button"
    openAddOptionButton.className = "memoquestion-form__openAddOptionButton"
    openAddOptionButton.innerHTML = `
        <div class="add-item-input__icon">
            <img src="./images/plusagreement.svg" alt="">
        </div>
        <p class="memoquestion-form__addOptionTag">Agregar otra</p>
    `

    const addOptionControls = document.createElement('div')
    addOptionControls.className = "memoquestion-form__addOptionControls hidden"
    addOptionControls.innerHTML = `
    <section class="memoquestion-form__inputControls">
        <div class="agreement__number agreement__number agreement__number--secondary">
            <img src="./images/plusagreement.svg" alt="">
        </div>
        <div class="fix-label-text-input fix-label-text-input--secondary memoquestion-form__addOptionInput">
            <input id="newoption" class="fix-label-text-input__field newoption" type="text" name="newoption" placeholder="Escribe aquí tu texto" autocomplete="off">
            <label class="fix-label-text-input__label" for="newoption">Agregar otra</label>
        </div>
    </section>
    <button type="button" class="small-button small-button--secondary addOptionBtn">
        <span>Agregar acuerdo</span>
    </button>
    `

    checkboxAnswerQuestion.appendChild(openAddOptionButton)
    checkboxAnswerQuestion.appendChild(addOptionControls)
    openAddOptionButton.addEventListener('click', () => {
        addOptionControls.classList.remove("hidden")
        openAddOptionButton.classList.add("hidden")
    })

    const addOptionBtn = addOptionControls.querySelector(".addOptionBtn")
    addOptionBtn.addEventListener('click', () => {
        const optionValue = addOptionControls.querySelector("#newoption").value
        if (optionValue.length > 0) {
            addMemoOption(list, checkboxAnswerQuestion, optionValue)
        } else console.log("Rellena el campo")
    })
}

export async function submitMemoQuestionForm() {
    const memoQuestionForm = document.querySelector(".memoquestion-form")

    if (memoQuestionForm && window.location.href.includes("#memoquestion")) {
        memoQuestionForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const urlQuery = window.location.hash.split("?")[1]
            const urlQueryParts = urlQuery.split("_")
            const period = urlQueryParts[0]
            const subjectId = urlQueryParts[1]
            const questionId = urlQueryParts[2]
            //showLoader()

            switch (currentQuestion.type) {
                case "radio":
                    if (memoQuestionForm.radioanswer) {
                        const answerValue = [memoQuestionForm.radioanswer.value]
                        if (currentQuestion.answerId) {
                            updateAnswerValue(currentQuestion.answerId, answerValue, period, subjectId, parseInt(currentQuestion.index))
                        } else {
                            createMemoAnswer(period, questionId, subjectId, answerValue, parseInt(currentQuestion.index))
                        }
                    }
                    break;
                case "checkbox":
                    const checkboxOptions = document.querySelector(".memoquestion-form").elements['checkbox[]']
                    let selectedChecboxOptions = []

                    checkboxOptions.forEach(e => {
                        if (e.checked) {
                            selectedChecboxOptions.push(e.value)
                        }
                    })

                    if (selectedChecboxOptions.length > 0) {
                        if (currentQuestion.answerId) {
                            updateAnswerValue(currentQuestion.answerId, selectedChecboxOptions, period, subjectId, parseInt(currentQuestion.index))
                        } else {
                            createMemoAnswer(period, questionId, subjectId, selectedChecboxOptions, parseInt(currentQuestion.index))
                        }
                    } else {
                        window.alert("Debes responder a la pregunta")
                    }
            }
        })
    }
}

export async function nextMemoQuestion() {

}