import { nextUntil } from "./utils/nextUntil.js";

export function onContentEditableEnter() {
    const pseudoInputs = document.querySelectorAll(".memoedit-form__pseudo-input--text")
    if (window.location.href.includes("#memoedit") && pseudoInputs.length > 0) {
        pseudoInputs.forEach(elem => {
            elem.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {
                    return false;
                }
            })
        })
    }
}

export function updateMemoPseudoInputsValueLocally(memo) {
    const pseudoInputs = document.querySelectorAll(".memoedit-form__pseudo-input--text")
    if (window.location.href.includes("#memoedit") && pseudoInputs.length > 0) {
        pseudoInputs.forEach((e, i) => {
            e.addEventListener('input', () => {
                if (i == 0) {
                    memo.objective = e.innerHTML.toString()
                } else {
                    memo.importance = e.innerHTML.toString()
                }
            })
        })
    }
}

export function changeMemoEditFormPage() {
    const memoeditForm = document.querySelector(".memoedit-form")

    if (window.location.href.includes("#memoedit") && memoeditForm) {
        const memoeditFormSection1 = memoeditForm.querySelectorAll(".memoedit-form__section1")
        const memoeditFormSection2 = memoeditForm.querySelectorAll(".memoedit-form__section2")

        if (window.location.href.includes("#memoedit?1")) {
            memoeditFormSection1.forEach(e => {
                e.classList.remove("hidden")
            })

            memoeditFormSection2.forEach(e => {
                e.classList.add("hidden")
            })

        } else if (window.location.href.includes("#memoedit?2")) {
            memoeditFormSection1.forEach(e => {
                e.classList.add("hidden")
            })

            memoeditFormSection2.forEach(e => {
                e.classList.remove("hidden")
            })
        }

        window.scrollTo(0, 0)
    }
}

export function renderMemoEditValues(memo) {
    const memoeditForm = document.querySelector(".memoedit-form")
    if (window.location.href.includes("#memoedit") && memoeditForm) {
        const objetiveInput = memoeditForm.querySelector("#objetive")
        const importanceInput = memoeditForm.querySelector("#importance")
        objetiveInput.innerHTML = ``
        importanceInput.innerHTML = ``

        const copy = { ...memo }

        objetiveInput.innerHTML = copy.objective
        importanceInput.innerHTML = copy.importance
    }
}

export function submitMemoEditForm() {
    const memoeditForm = document.querySelector(".memoedit-form")
    if (window.location.href.includes("#memoedit") && memoeditForm) {

    }
}


let sections = [
    {
        name: "",
        index: 0,
        questions: [
            {
                name: "",
                index: 0,
                type: "checkbox",
                justificationQuestion: "",
                itemList: [
                    ""
                ],
                matrix: [

                ]
            }
        ]
    }

]


function changeSelectValue() {
    const memoformSelects = document.querySelectorAll(".memoform-select")

    if (memoformSelects.length > 0) {
        memoformSelects.forEach((select, i) => {
            const optionList = select.querySelector(".memoform-optionList")
            const selectedOptionField = select.querySelector(".memoform-select__selectedOption")
            const realInput = select.querySelector(".memoform-select__realfield")
            const options = select.querySelectorAll(".memoform-option")

            select.addEventListener('click', () => {
                select.classList.toggle('memoform-select--focus')
                optionList.classList.toggle('memoform-optionList--focus')
            })

            options.forEach((option, i) => {
                option.addEventListener('click', () => {
                    realInput.value = option.id
                    realInput.setAttribute('value', option.id)
                    selectedOptionField.innerHTML = ``
                    const optionClone = option.cloneNode(true);
                    selectedOptionField.innerHTML = optionClone.innerHTML
                    //console.log(realInput.value)
                })
            })
        })
    }
}

function changeMemoEditInputsTextSize() {
    const memoEditTextInputs = document.querySelectorAll(".expandable-text-area__field")
    if (memoEditTextInputs.length > 0) {
        memoEditTextInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.which == 13) { e.preventDefault(); }
            })
            input.addEventListener('input', () => {
                input.style.removeProperty('height');
                input.style.height = (input.scrollHeight) + 'px';
            })
        })
    }
}

function getMemoSectionEditFormSubsectionsAndQuestions() {
    const memoEditForm = document.querySelector(".memosectionedit-form")
    if (memoEditForm && window.location.href.includes("#memosectionedit")) {
        const memoEditSections = memoEditForm.querySelectorAll(".memo-subsection-edit")
        memoEditSections.forEach((section, i) => {
            let questions = nextUntil(section, '.memo-subsection-edit')
            //console.log(questions)
        })
    }
}

function changeQuestionProperties() {
    const memoEditForm = document.querySelector(".memosectionedit-form")

    if (memoEditForm && window.location.href.includes("#memosectionedit")) {
        const memoEditQuestions = memoEditForm.querySelectorAll('.memo-question-edit')

        memoEditQuestions.forEach((question, i) => {
            // Elementos de tipo de respuesta
            const questionAnswerTypeSelect = question.querySelector(".memo-question-edit-answertype-select")
            const answerTypesElements = question.querySelectorAll(".memo-question-edit__answertype")

            // Elementos de justificzcion
            const addJustificationQuestionInput = question.querySelectorAll("input[name='addjustication']")
            const questionJusticationQuestionInput = question.querySelector(".justificationquestion-input-container")

            // Elementos de checkbox
            const checkboxAnswerSection = question.querySelector("#questioncheckbox")
            const checkboxOptionList = checkboxAnswerSection.querySelector(".memo-question-edit__answersList")
            const addCheckboxOptionInput = checkboxAnswerSection.querySelector("#addnewitem")

            // Elementos de radio
            const radioAnswerSection = question.querySelector("#questionradio")
            const radioOptionList = radioAnswerSection.querySelector(".memo-question-edit__answersList")
            const addRadioOptionInput = radioAnswerSection.querySelector("#addnewitem")

            // Cambiar tipo de respuesta
            let selectObserver = new MutationObserver(function (mutationsList, observer) {
                //mutationsList.forEach(e => {/*console.log(e);*/})
                const value = questionAnswerTypeSelect.value

                answerTypesElements.forEach((answerType, j) => {
                    if (answerType.id.includes(value)) {
                        answerType.classList.remove('hidden')
                    } else {
                        answerType.classList.add('hidden')
                    }
                })
            });
            selectObserver.observe(questionAnswerTypeSelect, { subtree: true, attributes: true });

            // Pregunta de justificacion
            addJustificationQuestionInput.forEach((elem, j) => {
                elem.addEventListener('input', () => {
                    if (elem.value == "yes") {
                        questionJusticationQuestionInput.classList.remove('hidden')
                    } else {
                        questionJusticationQuestionInput.classList.add('hidden')
                    }
                })
            })


            // Agregar opcion para checkbox
            addCheckboxOptionInput.addEventListener('click', () => {
                const newCheckBoxOption = document.createElement('div')
                newCheckBoxOption.className = "memo-answer-option-edit"
                newCheckBoxOption.innerHTML = `
                <div class="memo-answer-option-edit__input">
                <img class="memo-answer-option-edit__icon" src="./images/memocheckboxicon.svg" alt="">
                <input class="memo-answer-option-edit__field" id="answeroption" name="answeroption" type="text" placeholder="Escriba la opción de respuesta">
                <label class="memo-answer-option-edit__label" for="answeroption">Opción ${checkboxOptionList.children.length + 1}</label>
                </div>
                <button class="memo-answer-option-edit__deleteButton" type="button">
                    <img src="./images/deleteagreement.svg" alt="">
                </button>
                `
                checkboxOptionList.appendChild(newCheckBoxOption)

                const checkboxOptionInput = newCheckBoxOption.querySelector("#answeroption")
                checkboxOptionInput.focus()

                const deleteCheckboxoptionButton = newCheckBoxOption.querySelector(".memo-answer-option-edit__deleteButton")
                deleteCheckboxoptionButton.addEventListener("click", (event) => {
                    newCheckBoxOption.remove()
                })
            })


            // Agregar opcion para radio
            addRadioOptionInput.addEventListener('click', () => {
                const newRadioOption = document.createElement('div')
                newRadioOption.className = "memo-answer-option-edit"
                newRadioOption.innerHTML = `
                <div class="memo-answer-option-edit__input">
                <img class="memo-answer-option-edit__icon" src="./images/memoradiusicon.svg" alt="">
                <input class="memo-answer-option-edit__field" id="answeroption" name="answeroption" type="text" placeholder="Escriba la opción de respuesta">
                <label class="memo-answer-option-edit__label" for="answeroption">Opción ${radioOptionList.children.length + 1}</label>
                </div>
                <button class="memo-answer-option-edit__deleteButton" type="button">
                    <img src="./images/deleteagreement.svg" alt="">
                </button>
                `
                radioOptionList.appendChild(newRadioOption)

                const radioOptionInput = newRadioOption.querySelector("#answeroption")
                radioOptionInput.focus()

                const deleteRadioptionButton = newRadioOption.querySelector(".memo-answer-option-edit__deleteButton")
                deleteRadioptionButton.addEventListener("click", (event) => {
                    newRadioOption.remove()
                })
            })
        })
    }
}

export function addMemoSectionFormFunctions() {
    changeSelectValue()
    changeMemoEditInputsTextSize()
    getMemoSectionEditFormSubsectionsAndQuestions()
    changeQuestionProperties()
}