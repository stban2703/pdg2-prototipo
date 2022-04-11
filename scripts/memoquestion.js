import { getMemoQuestion } from "./modules/firestore.js"
import { asteriskToBold } from "./utils/text-format.js"

export async function renderMemoQuestion() {
    const memoQuestionScreen = document.querySelector(".memoquestion-screen")

    if (memoQuestionScreen && window.location.href.includes("#memoquestion")) {
        const urlQuery = window.location.hash.split("?")[1]
        const urlQueryParts = urlQuery.split("_")
        const period = urlQueryParts[0]
        const subjectId = urlQueryParts[1]
        const questionId = urlQueryParts[2]

        const questionInfo = await getMemoQuestion(period, subjectId, questionId)
        console.log(questionInfo)

        // Titulo de seccion
        const memoQuestionSectionTitle = memoQuestionScreen.querySelector(".memoquestion-screen__title")
        memoQuestionSectionTitle.innerHTML = questionInfo.section

        // Formulario general
        const memoQuestionForm = memoQuestionScreen.querySelector(".memoquestion-form")

        if (questionInfo.type !== "improveactions") {
            // Titulo de subseccion
            const memoQuestionSubsectionTitle = memoQuestionScreen.querySelector(".memoquestion-form__title")
            memoQuestionSubsectionTitle.innerHTML = questionInfo.subsection
            memoQuestionSubsectionTitle.classList.remove("hidden")

            // Contenedor de pregunta normal
            const memoquestionContainerNormal = memoQuestionForm.querySelector(".memoquestion-form__container--normal")
            memoquestionContainerNormal.classList.remove("hidden")

            // Renderizar pregunta
            memoquestionContainerNormal.innerHTML = `
                    <h5 class="memoquestion-form__subtitle">Pregunta ${questionInfo.index}</h5>
                    <p class="memoquestion-form__question">${asteriskToBold(questionInfo.question)}
                    </p>
                `
            
            // Contenedor de respuesta
            const answerContainer = document.createElement('div')
            answerContainer.className = "memoquestion-form__answer"

            // Agregar tipo de respuesta
            switch (questionInfo.type) {
                case "radio":
                    const radioAnswerQuestion = document.createElement('div')
                    radioAnswerQuestion.className = "memoquestion-form__radio-checkbox memoquestion-form__radio-checkbox--radio"

                    questionInfo.options.forEach(option => {
                        const answerOption = document.createElement('label')
                        answerOption.className = "memo-radio-input"
                        answerOption.innerHTML = `
                        <input type="radio" name="${questionId}" value="${option}" required />
                        ${option}
                        `
                        radioAnswerQuestion.appendChild(answerOption)
                    });
                    answerContainer.appendChild(radioAnswerQuestion)
                    break;
            }

            memoQuestionForm.querySelector(".memoquestion-form__container").appendChild(answerContainer)
        }

    }
}