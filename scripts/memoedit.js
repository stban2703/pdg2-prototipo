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

function changeQuestionAnswerType() {
    const memoEditForm = document.querySelector(".memosectionedit-form")

    if (memoEditForm && window.location.href.includes("#memosectionedit")) {
        const memoEditQuestions = memoEditForm.querySelectorAll('.memo-question-edit')

        memoEditQuestions.forEach((question, i) => {
            const questionAnswerTypeSelect = question.querySelector(".memo-question-edit-answertype-select")
            const answerTypesElements = question.querySelectorAll(".memo-question-edit__answertype")
            const addJustificationQuestionInput = question.querySelectorAll("input[name='addjustication']")
            const questionJusticationQuestionInput = question.querySelector(".justificationquestion-input-container")

            // Tipo de respuesta
            let selectObserver = new MutationObserver(function (mutationsList, observer) {
                //mutationsList.forEach(e => {/*console.log(e);*/})
                const value = questionAnswerTypeSelect.value

                answerTypesElements.forEach((answerType, j) => {
                    if(answerType.id.includes(value)) {
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
                    if(elem.value == "yes") {
                        questionJusticationQuestionInput.classList.remove('hidden')
                    } else {
                        questionJusticationQuestionInput.classList.add('hidden')
                    }
                })
            })
        })
    }
}

export function addMemoSectionFormFunctions() {
    changeSelectValue()
    changeMemoEditInputsTextSize()
    getMemoSectionEditFormSubsectionsAndQuestions()
    changeQuestionAnswerType()
}