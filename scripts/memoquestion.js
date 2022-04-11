import { createMemoAnswer, getMemoQuestion, updateAnswerValue } from "./modules/firestore.js"
import { showLoader } from "./utils/loader.js"
import { asteriskToBold } from "./utils/text-format.js"

let currentQuestion = {}

export async function renderMemoQuestion() {
    const memoQuestionScreen = document.querySelector(".memoquestion-screen")

    if (memoQuestionScreen && window.location.href.includes("#memoquestion")) {
        const urlQuery = window.location.hash.split("?")[1]
        const urlQueryParts = urlQuery.split("_")
        const period = urlQueryParts[0]
        const subjectId = urlQueryParts[1]
        const questionId = urlQueryParts[2]

        currentQuestion = await getMemoQuestion(period, subjectId, questionId)
        console.log(currentQuestion)

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
            }

            memoQuestionForm.querySelector(".memoquestion-form__container").appendChild(memoAnswerContainer)
        }

    }
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
            showLoader()

            if (memoQuestionForm.radioanswer) {
                const answerValue = [memoQuestionForm.radioanswer.value]
                if (currentQuestion.answerId) {
                    updateAnswerValue(currentQuestion.answerId, answerValue, period, subjectId, parseInt(currentQuestion.index))
                } else {
                    createMemoAnswer(period, questionId, subjectId, answerValue, parseInt(currentQuestion.index))
                }
            }
        })
    }
}

export async function nextMemoQuestion() {

}