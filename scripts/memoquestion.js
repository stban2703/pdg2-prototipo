import { createMemoAnswer, getMemoQuestion, getOptionsFromAnswers, getPreviousMemoQuestion, updateAnswerValue } from "./modules/firestore.js"
import { hideLoader, showLoader } from "./utils/loader.js"
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

        const memoSectionNumber = memoQuestionScreen.querySelector(".memoquestion-screen__numberSpan")
        memoSectionNumber.innerHTML = currentQuestion.sectionIndex

        // Titulo de seccion
        const memoQuestionSectionTitle = memoQuestionScreen.querySelector(".memoquestion-screen__title")
        memoQuestionSectionTitle.innerHTML = currentQuestion.section

        // Formulario general
        const memoQuestionForm = memoQuestionScreen.querySelector(".memoquestion-form")

        if (currentQuestion.type !== "improveactions" && !urlQueryParts[3]) {
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

                    if (parseInt(currentQuestion.index) === 8) {
                        radioAnswerQuestion.style.width = 'fit-content'
                    }

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
                    if (!currentQuestion.options[0]) {
                        let negativeOptions = []
                        let positiveOptions = []
                        const question5Answers = await getOptionsFromAnswers("YsVpQwlC6PXwgAS2IW7r", subjectId, period)
                        const question6Answers = await getOptionsFromAnswers("jOz7X758oimxAJZ4V9BU", subjectId, period)

                        console.log(question5Answers)
                        console.log(question6Answers)

                        question5Answers.forEach((elem) => {
                            const parts = elem.split("|")
                            const object = {
                                tag: parts[0],
                                value: parseInt(parts[parts.length - 1])
                            }
                            positiveOptions.push(object.tag)
                            if (object.value < 4) {
                                let temp = negativeOptions.find(elem => {
                                    return elem === object.value
                                })
                                if (!temp) {
                                    negativeOptions.push(object.tag)
                                }
                            }
                        })

                        question6Answers.forEach((elem) => {
                            const parts = elem.split("|")
                            const object = {
                                tag: parts[0],
                                value: parseInt(parts[parts.length - 1])
                            }
                            if (object.value < 4) {
                                let temp = negativeOptions.find(elem => {
                                    return elem === object.value
                                })
                                if (!temp) {
                                    negativeOptions.push(object.tag)
                                }
                            }
                        })

                        negativeOptions.forEach((elem) => {
                            const negativeIndex = positiveOptions.indexOf(elem)
                            positiveOptions.splice(negativeIndex, 1)
                        })
                        renderMemoOption(positiveOptions, checkboxAnswerQuestion)
                    } else {
                        renderMemoOption(currentQuestion.options, checkboxAnswerQuestion)
                    }
                    memoAnswerContainer.appendChild(checkboxAnswerQuestion)
                    break;

                case "scale":
                    const scaleAnswerQuestion = document.createElement('div')
                    scaleAnswerQuestion.className = "memoquestion-form__scale"
                    scaleAnswerQuestion.innerHTML = `
                    <section class="memoquestion-form__scaleTag">
                        <p>${currentQuestion.scalemintag}</p>
                    </section>
                    <section class="memoquestion-form__scaleList">
                        <div class="memoquestion-form__scaleOption">
                            <span>1</span>
                            <label class="memo-radio-input">
                                <input type="radio" name="scale" value="1" required/>
                            </label>
                        </div>
                        <div class="memoquestion-form__scaleOption">
                            <span>2</span>
                            <label class="memo-radio-input">
                                <input type="radio" name="scale" value="2" required />
                            </label>
                        </div>
                        <div class="memoquestion-form__scaleOption">
                            <span>3</span>
                            <label class="memo-radio-input">
                                <input type="radio" name="scale" value="3" required />
                            </label>
                        </div>
                        <div class="memoquestion-form__scaleOption">
                            <span>4</span>
                            <label class="memo-radio-input">
                                <input type="radio" name="scale" value="4" required />
                            </label>
                        </div>
                        <div class="memoquestion-form__scaleOption">
                            <span>5</span>
                            <label class="memo-radio-input">
                                <input type="radio" name="scale" value="5" required />
                            </label>
                        </div>
                        <div class="memoquestion-form__scaleOption">
                            <span>6</span>
                            <label class="memo-radio-input">
                                <input type="radio" name="scale" value="6" required />
                            </label>
                        </div>
                    </section>
                    <section class="memoquestion-form__scaleTag">
                        <p>${currentQuestion.scalemaxtag}</p>
                    </section>
                    `

                    memoAnswerContainer.appendChild(scaleAnswerQuestion)
                    if (parseInt(currentQuestion.index) === 3) {
                        document.querySelector(".memoquestion-form__scaleValues").classList.remove("hidden")
                    } else document.querySelector(".memoquestion-form__scaleValues").classList.add("hidden")

                    break;

                case "matrix":
                    const matrixAnswerQuestion = document.createElement('div')
                    matrixAnswerQuestion.className = "memoquestion-form__matrix"
                    matrixAnswerQuestion.innerHTML = `
                    <table class="memo-matrix-table">
                        <thead class="memo-matrix-table__header">
                            <tr class="memo-matrix-table__headerRow">
                                <td class="memo-matrix-table__tag memo-matrix-table__tag--right">${currentQuestion.matrixcolumnmintag}</td>
                                <td class="memo-matrix-table__number">1</td>
                                <td class="memo-matrix-table__number">2</td>
                                <td class="memo-matrix-table__number">3</td>
                                <td class="memo-matrix-table__number">4</td>
                                <td class="memo-matrix-table__number">5</td>
                                <td class="memo-matrix-table__number">6</td>
                                <td class="memo-matrix-table__tag memo-matrix-table__tag--left">${currentQuestion.matrixcolumnmaxtag}
                                </td>
                            </tr>
                        </thead>
                        <tbody class="memo-matrix-table__body">
                        </tbody>
                    </table>
                    `
                    memoAnswerContainer.appendChild(matrixAnswerQuestion)

                    if (!currentQuestion.matrixrows[0]) {
                        let options = []
                        switch (parseInt(currentQuestion.index)) {
                            case 5:
                                options = await getOptionsFromAnswers("UdZPykHVoTAftyvkLxdE", subjectId, period)
                                break;
                            case 6:
                                options = await getOptionsFromAnswers("UdZPykHVoTAftyvkLxdE", subjectId, period)
                                break;
                        }
                        const matrixTableBody = document.querySelector(".memo-matrix-table__body")
                        matrixTableBody.innerHTML = ""
                        options.forEach((elem, index) => {
                            const matrixRow = document.createElement("tr")
                            matrixRow.className = "memo-matrix-table__bodyRow"
                            matrixRow.innerHTML = `
                                <td class="memo-matrix-table__label">${elem}</td>
                                <td class="memo-matrix-table__radio">
                                    <label class="memo-radio-input">
                                        <input type="radio" name="row${index}" value="1" required />
                                    </label>
                                </td>
                                <td class="memo-matrix-table__radio">
                                    <label class="memo-radio-input">
                                        <input type="radio" name="row${index}" value="2" required />
                                    </label>
                                </td>
                                <td class="memo-matrix-table__radio">
                                    <label class="memo-radio-input">
                                        <input type="radio" name="row${index}" value="3" required />
                                    </label>
                                </td>
                                <td class="memo-matrix-table__radio">
                                    <label class="memo-radio-input">
                                        <input type="radio" name="row${index}" value="4" required />
                                    </label>
                                </td>
                                <td class="memo-matrix-table__radio">
                                    <label class="memo-radio-input">
                                        <input type="radio" name="row${index}" value="5" required />
                                    </label>
                                </td>
                                <td class="memo-matrix-table__radio">
                                    <label class="memo-radio-input">
                                        <input type="radio" name="row${index}" value="6" required />
                                    </label>
                                </td>
                            `
                            matrixTableBody.appendChild(matrixRow)
                        })
                    }
                    break;

                case "parragraph":
                    const parragraphAnswerQuestion = document.createElement('div')
                    parragraphAnswerQuestion.className = "memoquestion-form__parragraph"

                    parragraphAnswerQuestion.innerHTML = `
                    <div class="text-area-input">
                        <textarea class="text-area-input__field" name="parragraph" id="" rows="5"
                        placeholder="Escribe aquí tu texto..."></textarea>
                    </div>
                    `
                    memoAnswerContainer.appendChild(parragraphAnswerQuestion)
                    break;
            }
            memoQuestionForm.querySelector(".memoquestion-form__container").appendChild(memoAnswerContainer)
        } else if (parseInt(currentQuestion.index) === 4) {
            const memoquestionSubsectionTitle = memoQuestionScreen.querySelector(".memoquestion-form__title")
            memoquestionSubsectionTitle.innerHTML = currentQuestion.subsection

            const memoquestionContainerNormal = memoQuestionForm.querySelector(".memoquestion-form__container--normal")
            memoquestionContainerNormal.classList.remove("hidden")

            memoquestionContainerNormal.querySelector(".memoquestion-form__answer").classList.add("hidden")
            document.querySelectorAll(".memoquestion-form__subtitle")[0].classList.add("hidden")
            document.querySelector(".memoquestion-form__question").classList.add("hidden")
            document.querySelector(".memoquestion-form__information").classList.remove("hidden")
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

            if (parseInt(currentQuestion.index) == 4 && window.location.href.includes("_info")) {
                hideLoader()
                window.location = `index.html#memoquestion?${period}_${subjectId}_${questionId}`
            } else {
                switch (currentQuestion.type) {
                    case "radio":
                        if (memoQuestionForm.radioanswer) {
                            const answerValue = [memoQuestionForm.radioanswer.value]
                            if (parseInt(currentQuestion.index) === 8 && answerValue[0] === "No") {
                                const rememberModal = document.querySelector(".memo-question-modal--remember")
                                rememberModal.classList.remove("hidden")

                                const closeMemoRememberModalButton = document.querySelector(".closeMemoRememberModalButton")
                                closeMemoRememberModalButton.addEventListener('click', () => {
                                    rememberModal.classList.add("hidden")
                                    onSubmitAnswer(questionId, currentQuestion.answerId, answerValue, period, subjectId, parseInt(currentQuestion.index) + 1)
                                })
                            } else {
                                onSubmitAnswer(questionId, currentQuestion.answerId, answerValue, period, subjectId, currentQuestion.index)
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
                            onSubmitAnswer(questionId, currentQuestion.answerId, selectedChecboxOptions, period, subjectId, currentQuestion.index)
                        } else {
                            window.alert("Debes responder a la pregunta")
                        }
                        break;
                    case "scale":
                        const scaleAnswerValue = [memoQuestionForm.scale.value];
                        onSubmitAnswer(questionId, currentQuestion.answerId, scaleAnswerValue, period, subjectId, currentQuestion.index)
                        break;
                    case "matrix":
                        const rows = document.querySelectorAll(".memo-matrix-table__bodyRow")
                        const matrixAnswerValues = []

                        for (let i = 0; i < rows.length; i++) {
                            const rowInputValue = document.querySelector(".memoquestion-form").elements[`row${i}`].value
                            const answerTag = rows[i].querySelector(".memo-matrix-table__label").innerHTML
                            const answerValue = answerTag + "|" + rowInputValue
                            matrixAnswerValues.push(answerValue)
                        }

                        onSubmitAnswer(questionId, currentQuestion.answerId, matrixAnswerValues, period, subjectId, currentQuestion.index)
                        break;
                    case "parragraph":
                        const parragraphAnswerValue = [memoQuestionForm.parragraph.value]
                        onSubmitAnswer(questionId, currentQuestion.answerId, parragraphAnswerValue, period, subjectId, currentQuestion.index)
                        break;
                }
            }
        })
    }
}

function onSubmitAnswer(questionId, questionAnswerdId, answerValue, period, subjectId, questionIndex) {
    showLoader()
    if (questionAnswerdId) {
        updateAnswerValue(questionAnswerdId, answerValue, period, subjectId, parseInt(questionIndex))
    } else {
        createMemoAnswer(period, questionId, subjectId, answerValue, parseInt(questionIndex))
    }
}

export function memoQuestionGoBack() {
    const questionBackButton = document.querySelector(".question-back-button")

    if (questionBackButton && window.location.href.includes("#memoquestion")) {
        questionBackButton.addEventListener('click', () => {
            showLoader()
            const urlQuery = window.location.hash.split("?")[1]
            const urlQueryParts = urlQuery.split("_")
            const period = urlQueryParts[0]
            const subjectId = urlQueryParts[1]
            const questionId = urlQueryParts[2]

            if (parseInt(currentQuestion.index) == 4 && !window.location.href.includes("_info")) {
                hideLoader()
                window.location = `index.html#memoquestion?${period}_${subjectId}_${questionId}_info`
            } else {
                getPreviousMemoQuestion(period, subjectId, parseInt(currentQuestion.index))
            }
        })
    }
}