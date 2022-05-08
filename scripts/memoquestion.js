import { submitUserAccomplishment } from "./accomplishment.js"
import { createMemoAnswer, getJustificationAnswers, getMemoQuestion, getNotes, getOptionsFromAnswers, getPreviousMemoQuestion, updateAnswerValue } from "./modules/firestore.js"
import { renderNotesListView } from "./notelist.js"
import { getSubjectFromId } from "./utils/getters.js"
import { hideLoader, showLoader } from "./utils/loader.js"
import { sortByWeek } from "./utils/sort.js"
import { asteriskToBold } from "./utils/text-format.js"

let currentQuestion = {}
let selectedOptions = []

let improveActionsList = []

let improveActionEditIndex = null

export async function renderMemoQuestion() {
    const memoQuestionScreen = document.querySelector(".memoquestion-screen")

    if (memoQuestionScreen && window.location.href.includes("#memoquestion")) {
        const urlQuery = window.location.hash.split("?")[1]
        const urlQueryParts = urlQuery.split("_")
        const period = urlQueryParts[0]
        const subjectId = urlQueryParts[1]
        const questionId = urlQueryParts[2]

        const exitMemoQuestionButton = document.querySelector(".exitMemoQuestionButton")
        exitMemoQuestionButton.setAttribute('href', `index.html#memosections?${subjectId}`)

        currentQuestion = await getMemoQuestion(period, subjectId, questionId)

        const memoSectionNumber = memoQuestionScreen.querySelector(".memoquestion-screen__numberSpan")
        memoSectionNumber.innerHTML = currentQuestion.sectionIndex

        // Titulo de seccion
        const memoQuestionSectionTitle = memoQuestionScreen.querySelector(".memoquestion-screen__title")
        memoQuestionSectionTitle.innerHTML = currentQuestion.section

        const memoquestionSubsectionTitle = memoQuestionScreen.querySelector(".memoquestion-form__title")
        memoquestionSubsectionTitle.innerHTML = currentQuestion.subsection

        // Formulario general
        const memoQuestionForm = memoQuestionScreen.querySelector(".memoquestion-form")

        // Mostrar barra de progreso
        const totalQuestion = 12

        const currentProgress = Math.round((parseInt(currentQuestion.index) / totalQuestion) * 100)
        const currentProgressBar = document.querySelector(".memoquestion-screen__currentProgress")
        currentProgressBar.style.width = `${currentProgress}%`

        if (currentQuestion.type !== "improveactions" && !urlQueryParts[3]) {
            // Mostrar contenedor de pregunta normal
            const memoquestionContainerNormal = memoQuestionForm.querySelector(".memoquestion-form__container--normal")
            memoquestionContainerNormal.classList.remove("hidden")

            // Número de pregunta
            memoquestionContainerNormal.querySelector(".memoquestion-form__subtitle--questionNumber").innerHTML = `Pregunta ${currentQuestion.index}`

            // Descripcion de pregunta
            memoquestionContainerNormal.querySelector(".memoquestion-form__question").innerHTML = asteriskToBold(currentQuestion.question)

            // Contenedor de respuesta
            const memoAnswerContainer = memoquestionContainerNormal.querySelector(".memoquestion-form__answer")

            if (parseInt(currentQuestion.index) === 12) {
                const nextButton = memoQuestionForm.querySelector(".memoquestion-form__nextButton")
                const finishButton = memoQuestionForm.querySelector(".memoquestion-form__finishButton")

                nextButton.classList.add("hidden")
                nextButton.disabled = true
                finishButton.classList.remove("hidden")
                finishButton.disabled = false
            }

            // Agregar tipo de respuesta
            switch (currentQuestion.type) {
                case "radio":
                    const radioAnswerQuestion = document.createElement('div')
                    radioAnswerQuestion.className = "memoquestion-form__radio-checkbox memoquestion-form__radio-checkbox--radio"

                    if (parseInt(currentQuestion.index) === 8 || parseInt(currentQuestion.index) === 11) {
                        radioAnswerQuestion.classList.add("memoquestion-form__radio-checkbox--row")
                    }

                    if (parseInt(currentQuestion.index) === 8 || parseInt(currentQuestion.index) === 11 || parseInt(currentQuestion.index) === 12) {
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

                    if (currentQuestion.justification) {
                        const justificationSection = document.createElement('div')
                        justificationSection.className = `memoquestion-form__justification hidden`
                        justificationSection.innerHTML = `
                        <p class="memoquestion-form__question">${asteriskToBold(currentQuestion.justification)}</p>
                        <div class="text-area-input">
                            <textarea class="text-area-input__field" name="justification" id="" rows="5"
                            placeholder="Escribe aquí tu texto..." required></textarea>
                        </div>
                        `
                        memoAnswerContainer.parentNode.insertBefore(justificationSection, memoAnswerContainer.nextSibling)
                        addJustificationQuestion(memoQuestionForm.radioanswer, justificationSection)
                    }

                    // Render answers
                    if (currentQuestion.answerId) {
                        const answers = await getOptionsFromAnswers(currentQuestion.id, subjectId, period)
                        //console.log(answers)
                        memoQuestionForm.radioanswer.value = answers[0]

                        const justificationSection = document.querySelector(".memoquestion-form__justification")
                        if (justificationSection) {
                            justificationSection.classList.remove("hidden")
                            const justificationAnswer = await getJustificationAnswers(currentQuestion.id, subjectId, period)
                            justificationSection.querySelector('textarea').value = justificationAnswer
                        }
                    }
                    break;

                case "checkbox":
                    const checkboxAnswerQuestion = document.createElement('div')
                    checkboxAnswerQuestion.className = "memoquestion-form__radio-checkbox memoquestion-form__radio-checkbox--checkbox"

                    let answers = []
                    if (currentQuestion.answerId) {
                        answers = await getOptionsFromAnswers(currentQuestion.id, subjectId, period)
                    }

                    if (!currentQuestion.options[0]) {
                        let negativeOptions = []
                        let positiveOptions = []
                        const question5Answers = await getOptionsFromAnswers("YsVpQwlC6PXwgAS2IW7r", subjectId, period)
                        const question6Answers = await getOptionsFromAnswers("jOz7X758oimxAJZ4V9BU", subjectId, period)

                        question5Answers.forEach((elem) => {
                            const parts = elem.split("|")
                            const object = {
                                tag: parts[0],
                                value: parseInt(parts[parts.length - 1])
                            }
                            positiveOptions.push(object.tag)
                            if (object.value < 4) {
                                let temp = negativeOptions.find(elem => {
                                    return elem === object.tag
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
                                    return elem === object.tag
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
                        renderMemoOption(positiveOptions, checkboxAnswerQuestion, answers)
                    } else {
                        if (answers.length > 0) {

                            let question2Answers = []
                            if (parseInt(currentQuestion.index) === 4) {
                                question2Answers = await getOptionsFromAnswers("jLpNRX7L6AoHlUMc0HyZ", subjectId, period)
                                console.log(question2Answers)
                            }

                            answers.forEach(answer => {
                                const q = currentQuestion.options.find(elem => {
                                    return elem === answer
                                })

                                if (!q) {
                                    currentQuestion.options.push(answer)
                                }
                            })

                            question2Answers.forEach(answer => {
                                const q = currentQuestion.options.find(elem => {
                                    return elem === answer
                                })
                                if (!q) {
                                    currentQuestion.options.push(answer)
                                }
                            })
                        }
                        renderMemoOption(currentQuestion.options, checkboxAnswerQuestion, answers)
                    }
                    memoAnswerContainer.appendChild(checkboxAnswerQuestion)
                    const checkboxList = document.querySelectorAll("input[type=checkbox]")

                    answers.forEach((answer) => {
                        const targetIndex = Array.prototype.slice.call(checkboxList).findIndex(elem => {
                            return elem.value === answer
                        })
                        if (targetIndex >= 0) {
                            checkboxList[targetIndex].checked = true
                        }
                    })

                    // Prevent submit by Enter
                    function submitOptionByEnterKey(e) {
                        if (e.keyCode == 13) {
                            e.preventDefault()
                        }
                    }
                    memoQuestionForm.addEventListener("keypress", submitOptionByEnterKey);
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
                    } else {
                        document.querySelector(".memoquestion-form__scaleValues").classList.add("hidden")
                    }

                    if (currentQuestion.answerId) {
                        const answers = await getOptionsFromAnswers(currentQuestion.id, subjectId, period)
                        //console.log(answers)
                        memoQuestionForm.scale.value = answers[0]
                    }
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
                        let previousAnswers = []

                        if (currentQuestion.answerId) {
                            previousAnswers = await getOptionsFromAnswers(currentQuestion.id, subjectId, period)
                        }

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
                            /*if (previousAnswers.length > 0) {
                                previousAnswers.forEach(elem => {
                                    
                                    const parts = elem.split("|")
                                    const value = parts[1]
                                    
                                    //console.log(memoQuestionForm.elements[`row${index}`][0])

                                    if(value === memoQuestionForm.elements[`row${index}`].value) {
                                        memoQuestionForm.elements[`row${index}`].checked = true
                                    }
                                })
                            }*/
                        })

                        const rows = document.querySelectorAll(".memo-matrix-table__bodyRow")

                        for (let i = 0; i < rows.length; i++) {
                            const rowInput = document.querySelector(".memoquestion-form").elements[`row${i}`]
                            const rowTag = rows[i].querySelector(".memo-matrix-table__label").innerHTML

                            for (let j = 0; j < previousAnswers.length; j++) {
                                const elem = previousAnswers[j];
                                const parts = elem.split("|")
                                const tag = parts[0]
                                const value = parts[parts.length - 1]

                                if (rowTag == tag) {
                                    rowInput.value = value
                                    break;
                                }
                            }
                            /*previousAnswers.forEach(elem => {
                                const parts = elem.split("|")
                                const tag = parts[0]
                                const value = parts[parts.length - 1]

                                if(rowTag == tag) {
                                    rowInput.value = value
                                }
                            })*/
                        }
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

                    if (currentQuestion.answerId) {
                        const answers = await getOptionsFromAnswers(currentQuestion.id, subjectId, period)
                        //console.log(answers)
                        memoQuestionForm.parragraph.value = answers[0]
                    }
                    break;
            }

        } else if (parseInt(currentQuestion.index) === 4) {
            const memoquestionContainerNormal = memoQuestionForm.querySelector(".memoquestion-form__container--normal")
            memoquestionContainerNormal.classList.remove("hidden")

            memoquestionContainerNormal.querySelector(".memoquestion-form__answer").classList.add("hidden")
            document.querySelectorAll(".memoquestion-form__subtitle")[0].classList.add("hidden")
            document.querySelector(".memoquestion-form__question").classList.add("hidden")
            document.querySelector(".memoquestion-form__information").classList.remove("hidden")

        } else if (currentQuestion.type === "improveactions") {
            // Recover previous answers
            const question5Answers = await getOptionsFromAnswers("YsVpQwlC6PXwgAS2IW7r", subjectId, period)
            const question6Answers = await getOptionsFromAnswers("jOz7X758oimxAJZ4V9BU", subjectId, period)

            let optionsQ5 = []
            let optionsQ6 = []

            question5Answers.forEach((elem) => {
                const parts = elem.split("|")
                const object = {
                    tag: parts[0],
                    value: parseInt(parts[parts.length - 1])
                }
                //if (object.value < 4) {
                optionsQ5.push(object)
                //}
            })

            question6Answers.forEach((elem) => {
                const parts = elem.split("|")
                const object = {
                    tag: parts[0],
                    value: parseInt(parts[parts.length - 1])
                }
                //if (object.value < 4) {
                optionsQ6.push(object)
                //}
            })

            let q5Description = "Estrategias E-A adecuadas medianamente a los objetivos"
            let q6Description = "Estrategias E-A acogidas medianamente por los estudiantes"
            let q5Low = false
            let q6Low = false

            for (let index = 0; index < optionsQ5.length; index++) {
                const element = optionsQ5[index];

                if (element.value < 4) {
                    q5Description = "Estrategias E-A poco adecuadas a los objetivos de la clase"
                    q5Low = true
                    break;
                }
            }

            for (let index = 0; index < optionsQ6.length; index++) {
                const element = optionsQ6[index];

                if (element.value < 4) {
                    q6Description = "Estrategias E-A poco acogidas por los estudiantes"
                    q6Low = true
                    break;
                }
            }

            // Render columns
            const columnsTitles = document.querySelectorAll(".memoquestion-form__strategiesSubtitle")
            columnsTitles[0].innerHTML = q5Description
            columnsTitles[1].innerHTML = q6Description

            if (optionsQ5.length > 0) {
                document.querySelector(".improve-action-question5").innerHTML = ``
                optionsQ5.forEach(item => {
                    if (q5Low) {
                        if (item.value < 4) {
                            const newItem = document.createElement("p")
                            newItem.className = "memoquestion-form__strategyItem"
                            newItem.innerHTML = item.tag
                            document.querySelector(".improve-action-question5").appendChild(newItem)
                        }
                    } else {
                        if (item.value >= 4 && item.value < 6) {
                            const newItem = document.createElement("p")
                            newItem.className = "memoquestion-form__strategyItem"
                            newItem.innerHTML = item.tag
                            document.querySelector(".improve-action-question5").appendChild(newItem)
                        }
                    }
                })
            }

            if (optionsQ6.length > 0) {
                document.querySelector(".improve-action-question6").innerHTML = ``
                optionsQ6.forEach(item => {
                    if (q6Low) {
                        if (item.value < 4) {
                            const newItem = document.createElement("p")
                            newItem.className = "memoquestion-form__strategyItem"
                            newItem.innerHTML = item.tag
                            document.querySelector(".improve-action-question6").appendChild(newItem)
                        }
                    } else {
                        if (item.value >= 4 && item.value < 6) {
                            const newItem = document.createElement("p")
                            newItem.className = "memoquestion-form__strategyItem"
                            newItem.innerHTML = item.tag
                            document.querySelector(".improve-action-question6").appendChild(newItem)
                        }
                    }
                })
            }

            const question3Answer = await getOptionsFromAnswers("RRNqsml3iXEoAqQyQd9k", subjectId, period)
            const question3Container = document.querySelector(".improve-action-question3")

            // Niveles de logro
            switch (parseInt(question3Answer[0])) {
                case 1:
                    question3Container.innerText = "Bajo"
                    break;
                case 2:
                    question3Container.innerText = "Deficiente"
                    break;
                case 3:
                    question3Container.innerText = "Medio-bajo"
                    break;
                case 4:
                    question3Container.innerText = "Medio"
                    break;
                case 5:
                    question3Container.innerText = "Medio-alto"
                    break;
                case 6:
                    question3Container.innerText = "Alto"
                    break;
            }

            // Recover previous answers
            const question8Answer = await getOptionsFromAnswers("jvLjdfeVkm6JnQMgrO6C", subjectId, period)
            const question8Container = document.querySelector(".improve-action-question8")
            question8Container.innerHTML = question8Answer[0]


            setTimeout(() => {
                const smallLoader = document.querySelector(".small-loader")
                smallLoader.classList.add("hidden")
            }, 2000)

            // Notes from user
            const memoModalNotes = document.querySelector(".memo-question-modal--notes")
            const closeMemoNotesModalButton = memoModalNotes.querySelector(".closeMemoNotesModalButton")
            const seeNotesButton = document.querySelector(".seeNotesButton")

            seeNotesButton.addEventListener("click", () => {
                memoModalNotes.classList.remove("hidden")
            })

            closeMemoNotesModalButton.addEventListener("click", () => {
                memoModalNotes.classList.add("hidden")
            })

            const viewNoteDetailsButtons = document.querySelectorAll(".board-note-item__editBtn")
            viewNoteDetailsButtons.forEach((elem) => {
                elem.addEventListener('click', () => {
                    memoModalNotes.classList.add("hidden")
                })
            })

            // Display improve actions containers
            const improveActionContainers = document.querySelectorAll(".improve-actions-content")
            improveActionContainers.forEach((e) => {
                e.classList.remove("hidden")
            })

            // Open add improve action
            const openAddImproveActionButton = document.querySelectorAll(".openAddImproveActionButton")
            const memoNextQuestionButton = document.querySelector(".memoquestion-form__nextButton")
            const memoquestionFormBack = document.querySelector(".memoquestion-form__back")
            const newImproveActionForm = document.querySelector(".memoquestion-form__container--newimproveaction")

            openAddImproveActionButton.forEach(button => {
                button.addEventListener('click', () => {
                    improveActionEditIndex = null
                    improveActionContainers.forEach((e) => {
                        e.classList.add("hidden")
                    })
                    memoNextQuestionButton.classList.add("hidden")
                    returnToImproveActionButton.classList.remove("hidden")
                    memoquestionFormBack.classList.add("hidden")
                    newImproveActionForm.classList.remove("hidden")
                    memoQuestionForm.improveactionname.value = ""
                    memoQuestionForm.improveactiondescription.value = ""
                })
            })

            // Close add improve action
            const returnToImproveActionButton = document.querySelector(".returnToImproveActionButton")
            returnToImproveActionButton.addEventListener("click", () => {
                improveActionContainers.forEach((e) => {
                    e.classList.remove("hidden")
                })
                memoNextQuestionButton.classList.remove("hidden")
                returnToImproveActionButton.classList.add("hidden")
                memoquestionFormBack.classList.remove("hidden")
                newImproveActionForm.classList.add("hidden")
            })

            if (currentQuestion.answerId) {
                const answers = await getOptionsFromAnswers(currentQuestion.id, subjectId, period)
                //console.log(answers)
                improveActionsList = answers
            }

            renderImproveActions(improveActionsList)
        }
    }
}

export function handleMemoAddActionForm() {
    const memoQuestionForm = document.querySelector(".memoquestion-form")

    if (memoQuestionForm && window.location.href.includes("#memoquestion") && window.location.href.includes("a0tOgnI8yoiCW0BvJK2k")) {
        const addImproveActionButton = document.querySelector(".addImproveActionButton")

        addImproveActionButton.addEventListener("click", () => {
            const improveActionName = memoQuestionForm.improveactionname.value
            const improveActionDescription = memoQuestionForm.improveactiondescription.value

            if (improveActionName.length > 0 && improveActionDescription.length > 0) {
                addImproveAction(improveActionName, improveActionDescription)
            } else {
                alert("Debes rellenar los campos")
            }
        })
    }
}

function addJustificationQuestion(input, justificationSection) {
    input.forEach(elem => {
        elem.addEventListener("input", () => {
            if (input.value.length > 0) {
                justificationSection.classList.remove("hidden")
            }
        })
    })
}

function addImproveAction(improveactionname, improveactiondescription) {
    if (improveActionEditIndex >= 0 && improveActionEditIndex !== null) {
        improveActionsList[improveActionEditIndex] = {
            name: improveactionname,
            description: improveactiondescription
        }
    } else if (improveActionEditIndex === null) {
        improveActionsList.push({
            name: improveactionname,
            description: improveactiondescription
        })
    }
    renderImproveActions(improveActionsList)
    document.querySelector(".returnToImproveActionButton").click()
}

function removeImproveAction(index) {
    improveActionsList.splice(index, 1)
    renderImproveActions(improveActionsList)
}

function renderImproveActions(list) {
    const emptyMessage = document.querySelector(".improve-actions__empty")
    const improveActionList = document.querySelector(".improve-actions__list")

    improveActionList.innerHTML = ``
    if (list.length == 0) {
        emptyMessage.classList.remove("hidden")
        improveActionList.classList.add("hidden")
    } else {
        emptyMessage.classList.add("hidden")
        improveActionList.classList.remove("hidden")
        list.forEach((elem, index) => {
            const actionItem = document.createElement("tr")
            actionItem.className = "improve-action-item"
            actionItem.innerHTML = `
            <td>
                <div class="improve-action-item__number">
                    <span>${index + 1}</span>
                </div>
            </td>
            <td class="improve-action-item__title">
                <h5>${elem.name}</h5>
            </td>
            <td class="improve-action-item__description">
                <p>${elem.description}</p>
            </td>
            <td>
                <button type="button" class="improve-action-item__controls"
                    style="background-image: url('./images/3dots.svg');">
                </button>
            </td>
            <ul class="improve-action-item__settings improve-action-item__settings--hidden">
                <li class="improve-action-item__settings-item delete-improve-action-item">
                    <img class="improve-action-item__settings-item__normal-icon" src="./images/deletenoteicon.svg">
                    <img class="improve-action-item__settings-item__hover-icon" src="./images/deletenoteiconwhite.svg">
                    <span>Eliminar</span>
                </li>
                <li class="improve-action-item__settings-item edit-improve-action-item">
                    <img class="improve-action-item__settings-item__normal-icon" src="./images/editicon.svg">
                    <img class="improve-action-item__settings-item__hover-icon" src="./images/editiconwhite.svg">
                    <span>Editar</span>
                </li>
            </ul>
            `
            improveActionList.appendChild(actionItem)

            // Item settings menu
            const improveActionsDotsBtn = actionItem.querySelector(".improve-action-item__controls")
            const improveActionItemSettings = actionItem.querySelector(".improve-action-item__settings")

            improveActionsDotsBtn.addEventListener('click', () => {
                improveActionItemSettings.classList.toggle("improve-action-item__settings--hidden")
                improveActionsDotsBtn.classList.toggle("improve-action-item__controls--activated")
            })

            const deleteImproveActionButton = actionItem.querySelector(".delete-improve-action-item")
            deleteImproveActionButton.addEventListener("click", () => {
                removeImproveAction(index)
            })

            const editImproveActionButton = actionItem.querySelector(".edit-improve-action-item")
            editImproveActionButton.addEventListener("click", () => {
                const improveActionContainers = document.querySelectorAll(".improve-actions-content")
                const memoNextQuestionButton = document.querySelector(".memoquestion-form__nextButton")
                const memoquestionFormBack = document.querySelector(".memoquestion-form__back")
                const newImproveActionForm = document.querySelector(".memoquestion-form__container--newimproveaction")
                const returnToImproveActionButton = document.querySelector(".returnToImproveActionButton")

                improveActionContainers.forEach((e) => {
                    e.classList.add("hidden")
                })
                memoNextQuestionButton.classList.add("hidden")
                returnToImproveActionButton.classList.remove("hidden")
                memoquestionFormBack.classList.add("hidden")
                newImproveActionForm.classList.remove("hidden")

                improveActionEditIndex = index
                const memoQuestionForm = document.querySelector(".memoquestion-form")
                memoQuestionForm.improveactionname.value = elem.name
                memoQuestionForm.improveactiondescription.value = elem.description
            })
        })
    }
}

function addMemoOption(list, checkboxAnswerQuestion, value, answers) {
    const newOption = value
    list.push(newOption)
    console.log(list)
    const allOptions = document.querySelector(".memoquestion-form").elements['checkbox[]']

    allOptions.forEach((elem, index) => {
        if (elem.checked) {
            selectedOptions.push(index)
        }
    })
    renderMemoOption(list, checkboxAnswerQuestion, answers)
}


function renderMemoOption(list, checkboxAnswerQuestion, answers) {
    checkboxAnswerQuestion.innerHTML = ``

    let copy = [...list]

    copy.forEach((option, index) => {
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
        <span>Agregar estrategia</span>
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
            addMemoOption(list, checkboxAnswerQuestion, optionValue, answers)
            const inputs = checkboxAnswerQuestion.querySelectorAll('input[type=checkbox]')
            inputs[inputs.length - 1].checked = true
        } else console.log("Rellena el campo")
    })
}

export async function submitMemoQuestionForm(userSubjects) {
    const memoQuestionForm = document.querySelector(".memoquestion-form")

    if (memoQuestionForm && window.location.href.includes("#memoquestion")) {

        memoQuestionForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const urlQuery = window.location.hash.split("?")[1]
            const urlQueryParts = urlQuery.split("_")
            const period = urlQueryParts[0]
            const subjectId = urlQueryParts[1]
            const questionId = urlQueryParts[2]

            const subjectInfo = getSubjectFromId(subjectId, userSubjects)

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
                                    // Pregunta 8
                                    onSubmitAnswer(questionId, currentQuestion.answerId, answerValue, period, subjectInfo, parseInt(currentQuestion.index), userSubjects)
                                })
                            } else if (parseInt(currentQuestion.index) === 11 && answerValue[0] === "No") {
                                //memo-question-modal--doyouknow
                                const doyouknowModal = document.querySelector(".memo-question-modal--doyouknow")
                                const finalModal = document.querySelector(".memo-question-modal--final")
                                doyouknowModal.classList.remove("hidden")

                                const closeMemodoyouknowModalButton = document.querySelector(".closeMemodoyouknowModalButton")
                                closeMemodoyouknowModalButton.addEventListener('click', () => {
                                    doyouknowModal.classList.add("hidden")
                                    finalModal.classList.remove("hidden")
                                    // Pregunta 11
                                    onSubmitAnswer(questionId, currentQuestion.answerId, answerValue, period, subjectInfo, parseInt(currentQuestion.index), userSubjects)
                                    hideLoader()
                                })

                                const closeFinalMemoModal = document.querySelector(".closeMemofinalModalButton")
                                closeFinalMemoModal.addEventListener('click', () => {
                                    finalModal.classList.add("hidden")
                                    window.location = `index.html#memosections?${subjectId}`
                                })
                            } else if (parseInt(currentQuestion.index) === 12) {
                                onSubmitAnswer(questionId, currentQuestion.answerId, answerValue, period, subjectInfo, parseInt(currentQuestion.index), userSubjects)
                                hideLoader()
                                const finalModal = document.querySelector(".memo-question-modal--final")
                                finalModal.classList.remove("hidden")
                                const closeFinalMemoModal = document.querySelector(".closeMemofinalModalButton")
                                closeFinalMemoModal.addEventListener('click', () => {
                                    finalModal.classList.add("hidden")
                                    window.location = `index.html#memosections?${subjectId}`
                                })
                            } else {
                                onSubmitAnswer(questionId, currentQuestion.answerId, answerValue, period, subjectInfo, currentQuestion.index, userSubjects)
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
                            onSubmitAnswer(questionId, currentQuestion.answerId, selectedChecboxOptions, period, subjectInfo, currentQuestion.index, userSubjects)
                        } else {
                            window.alert("Debes responder a la pregunta")
                        }
                        break;
                    case "scale":
                        const scaleAnswerValue = [memoQuestionForm.scale.value];
                        onSubmitAnswer(questionId, currentQuestion.answerId, scaleAnswerValue, period, subjectInfo, currentQuestion.index, userSubjects)
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

                        onSubmitAnswer(questionId, currentQuestion.answerId, matrixAnswerValues, period, subjectInfo, currentQuestion.index, userSubjects)
                        break;
                    case "parragraph":
                        const parragraphAnswerValue = [memoQuestionForm.parragraph.value]
                        onSubmitAnswer(questionId, currentQuestion.answerId, parragraphAnswerValue, period, subjectInfo, currentQuestion.index, userSubjects)
                        break;
                    case "improveactions":
                        if (improveActionsList.length > 0) {
                            const improveactionsValue = improveActionsList
                            onSubmitAnswer(questionId, currentQuestion.answerId, improveactionsValue, period, subjectInfo, currentQuestion.index, userSubjects)
                        } else {
                            window.alert("Debes agregar acciones de mejora")
                        }
                        break;
                }
            }
        })
    }
}

function onSubmitAnswer(questionId, questionAnswerdId, answerValue, period, subjectInfo, questionIndex, userSubjects) {
    showLoader()

    let questionJustification = null

    const justificationInput = document.querySelector(".memoquestion-form").justification

    if (justificationInput) {
        questionJustification = justificationInput.value
    }

    if (questionAnswerdId) {
        updateAnswerValue(questionAnswerdId, answerValue, period, subjectInfo, parseInt(questionIndex), questionJustification)
    } else {
        createMemoAnswer(period, questionId, subjectInfo, answerValue, parseInt(questionIndex), questionJustification)
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

export async function renderMemoNotes(uid) {
    if (window.location.href.includes("#memoquestion") && window.location.href.includes("a0tOgnI8yoiCW0BvJK2k")) {
        const noteList = await getNotes(uid)
        noteList.sort(sortByWeek)

        const urlQuery = window.location.hash.split("?")[1]
        const urlQueryParts = urlQuery.split("_")
        const period = urlQueryParts[0]

        noteList.filter((elem) => {
            return elem.period === period
        })

        renderNotesListView(noteList)
    }
}