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

            // Elementos de escala
            const scaleAnswerSection = question.querySelector("#questionscale")
            const minScaleInput = scaleAnswerSection.querySelector("#minscale")
            const maxScaleInput = scaleAnswerSection.querySelector("#maxscale")
            const minScaleTag = scaleAnswerSection.querySelector(".min-scale-tag-input")
            const maxScaleTag = scaleAnswerSection.querySelector(".max-scale-tag-input")

            // Elementos de matriz
            const matrixRowAnswerSection = question.querySelector("#questionmatrixrow")
            const matrixRowOptionList = matrixRowAnswerSection.querySelector(".memo-question-edit__rowList")
            const addRowOptionInput = matrixRowAnswerSection.querySelector("#addnewitem")

            const matrixColumnAnswerSection = question.querySelector("#questionmatrixcolumn")
            const matrixColumnInput = matrixColumnAnswerSection.querySelector("#maxscale")
            const matrixColumnMaxTag = matrixColumnAnswerSection.querySelector(".matrix-row-max-tag")

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

            // Cambiar valores de la escala
            minScaleInput.addEventListener('input', (event) => {
                const minvalue = event.target.value
                const maxvalue = maxScaleInput.value

                if (parseInt(minvalue) >= parseInt(maxvalue)) {
                    minScaleTag.querySelector(".memo-answer-option-edit__number").innerHTML = `${parseInt(maxvalue) - 1}.`
                    minScaleInput.value = parseInt(maxvalue) - 1
                } else {
                    minScaleTag.querySelector(".memo-answer-option-edit__number").innerHTML = `${minvalue}.`
                }
            })

            maxScaleInput.addEventListener('input', (event) => {
                const maxvalue = event.target.value
                const minvalue = minScaleInput.value

                if (parseInt(maxvalue) <= parseInt(minvalue)) {
                    maxScaleTag.querySelector(".memo-answer-option-edit__number").innerHTML = `${parseInt(minvalue) + 1}.`
                    maxScaleInput.value = parseInt(minvalue) + 1
                } else {
                    maxScaleTag.querySelector(".memo-answer-option-edit__number").innerHTML = `${maxvalue}.`
                }
            })

            // Agregar fila de matriz
            addRowOptionInput.addEventListener('click', () => {
                const newMatrixRowOption = document.createElement('div')
                newMatrixRowOption.className = "memo-answer-option-edit"
                newMatrixRowOption.innerHTML = `
                <div class="memo-answer-option-edit__input">
                <span class="memo-answer-option-edit__number">${matrixRowOptionList.children.length + 1}.</span>
                <input class="memo-answer-option-edit__field" id="row" name="row" type="text" placeholder="Escribe el nombre aquí">
                <label class="memo-answer-option-edit__label" for="row">Nombre de la fila</label>
                </div>
                <button class="memo-answer-option-edit__deleteButton" type="button">
                <img src="./images/deleteagreement.svg" alt="">
                </button>
                `
                matrixRowOptionList.appendChild(newMatrixRowOption)

                const matrixOptionInput = newMatrixRowOption.querySelector("#row")
                matrixOptionInput.focus()

                const deleteRowOptionButton = newMatrixRowOption.querySelector(".memo-answer-option-edit__deleteButton")
                deleteRowOptionButton.addEventListener("click", (event) => {
                    newMatrixRowOption.remove()
                })
            })

            matrixColumnInput.addEventListener('input', (event) => {
                const value = event.target.value
                matrixColumnMaxTag.querySelector(".memo-answer-option-edit__number").innerHTML = `${value}.`
            })
        })
    }
}

function addNewQuestion() {
    const memoEditForm = document.querySelector(".memosectionedit-form")

    if (memoEditForm && window.location.href.includes("#memosectionedit")) {

        const addQuestionBtn = document.querySelector('.addQuestionBtn')
        const memosectioneditFormContent = memoEditForm.querySelector('.memosectionedit-form__content')

        addQuestionBtn.addEventListener('click', () => {
            const newQuestion = document.createElement('fieldset')
            newQuestion.className = `memo-question-edit memo-edit-form-item`
            newQuestion.innerHTML = `
                <section class="memo-question-edit__section">
                    <div class="expandable-text-area">
                        <textarea id="question" class="expandable-text-area__field question" name="question1"
                            placeholder="Escribe aquí la pregunta" required rows="1"></textarea>
                        <label class="expandable-text-area__label" for="question">Pregunta</label>
                    </div>
                    <div class="memoform-select">
                        <span class="memoform-select__label">Tipo de respuesta</span>
                        <div class="memoform-select__pseudofield">
                            <div class="memoform-select__selectedOption">
                                <img class="memoform-option__icon" src="./images/memocheckboxicon.svg" alt="">
                                <span class="memoform-option__label">Casillas</span>
                            </div>
                            <img class="memoform-select__arrow" src="./images/memocustomselectarrow.svg" alt="">
                            <div class="memoform-optionList">
                                <div class="memoform-option" id="checkbox">
                                    <img class="memoform-option__icon" src="./images/memocheckboxicon.svg" alt="">
                                    <span class="memoform-option__label">Casillas</span>
                                </div>
                                <div class="memoform-option" id="radio">
                                    <img class="memoform-option__icon" src="./images/memoradiusicon.svg" alt="">
                                    <span class="memoform-option__label">Varias opciones</span>
                                </div>
                                <div class="memoform-option" id="scale">
                                    <img class="memoform-option__icon" src="./images/memoscaleicon.svg" alt="">
                                    <span class="memoform-option__label">Escala</span>
                                </div>
                                <div class="memoform-option" id="parragraph">
                                    <img class="memoform-option__icon" src="./images/memoparragraphicon.svg" alt="">
                                    <span class="memoform-option__label">Párrafo</span>
                                </div>
                                <div class="memoform-option" id="matrix">
                                    <img class="memoform-option__icon" src="./images/memomatrixicon.svg" alt="">
                                    <span class="memoform-option__label">Matriz</span>
                                </div>
                            </div>
                        </div>
                        <select class="memoform-select__realfield memo-question-edit-answertype-select" name="answertype"
                            id="answertype" required hidden>
                            <option value="checkbox">Casillas</option>
                            <option value="radio">Selección multiple</option>
                            <option value="scale">Escala</option>
                            <option value="parragraph">Párrafo</option>
                            <option value="matrix">Matriz</option>
                        </select>
                    </div>
                </section>
                <section class="memo-question-edit__section">
                    <fieldset class="memo-question-edit__answertype" id="questioncheckbox">
                        <section class="memo-question-edit__answersList">
                            <div class="memo-answer-option-edit">
                                <div class="memo-answer-option-edit__input">
                                    <img class="memo-answer-option-edit__icon" src="./images/memocheckboxicon.svg"
                                        alt="">
                                    <input class="memo-answer-option-edit__field" id="answeroption" name="answeroption"
                                        type="text" placeholder="Escriba la opción de respuesta">
                                    <label class="memo-answer-option-edit__label" for="answeroption">Opción 1</label>
                                </div>
                                <!--<button class="memo-answer-option-edit__deleteButton" type="button">
                                    <img src="./images/deleteagreement.svg" alt="">
                                </button>-->
                            </div>
                        </section>
                        <section class="memo-question-edit__answersControl">
                            <div class="add-item-input">
                                <div class="add-item-input__icon">
                                    <img src="./images/plusagreement.svg" alt="">
                                </div>
                                <div class="fix-label-text-input fix-label-text-input--secondary add-item-input__input">
                                    <input id="addnewitem" class="fix-label-text-input__field add-item-input__field"
                                        type="text" name="addnewitem" placeholder="Haz click para agregar una opción"
                                        autocomplete="off">
                                    <label class="fix-label-text-input__label" for="addnewitem">Agregar opción</label>
                                </div>
                            </div>
                        </section>
                    </fieldset>
                    <fieldset class="memo-question-edit__answertype hidden" id="questionradio">
                        <section class="memo-question-edit__answersList">
                            <div class="memo-answer-option-edit">
                                <div class="memo-answer-option-edit__input">
                                    <img class="memo-answer-option-edit__icon" src="./images/memoradiusicon.svg" alt="">
                                    <input class="memo-answer-option-edit__field" id="answeroption" name="answeroption"
                                        type="text" placeholder="Escriba la opción de respuesta">
                                    <label class="memo-answer-option-edit__label" for="answeroption">Opción 1</label>
                                </div>
                                <!--<button class="memo-answer-option-edit__deleteButton" type="button">
                                    <img src="./images/deleteagreement.svg" alt="">
                                </button>-->
                            </div>
                        </section>
                        <section class="memo-question-edit__answersControl">
                            <div class="add-item-input">
                                <div class="add-item-input__icon">
                                    <img src="./images/plusagreement.svg" alt="">
                                </div>
                                <div class="fix-label-text-input fix-label-text-input--secondary add-item-input__input">
                                    <input id="addnewitem" class="fix-label-text-input__field add-item-input__field"
                                        type="text" name="addnewitem" placeholder="Haz click para agregar una opción"
                                        autocomplete="off">
                                    <label class="fix-label-text-input__label" for="addnewitem">Agregar opción</label>
                                </div>
                            </div>
                        </section>
                    </fieldset>
                    <fieldset class="memo-question-edit__answertype hidden" id="questionscale">
                        <section class="memo-question-edit__scaleRanges">
                            <p class="memo-question-edit__subtitle">De</p>
                            <select class="scale-select-input" name="minscale" id="minscale">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <p class="memo-question-edit__subtitle">a</p>
                            <select class="scale-select-input" name="maxscale" id="maxscale">
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6" selected="selected">6</option>
                            </select>
                        </section>
                        <section class="memo-question-edit__scaleTags">
                            <div class="memo-answer-option-edit">
                                <div class="memo-answer-option-edit__input min-scale-tag-input">
                                    <span class="memo-answer-option-edit__number">1.</span>
                                    <input class="memo-answer-option-edit__field" id="minscaletag" name="minscaletag"
                                        type="text" placeholder="Escribe la etiqueta aquí">
                                    <label class="memo-answer-option-edit__label" for="minscaletag">Nombre de
                                        etiqueta</label>
                                </div>
                            </div>
                            <div class="memo-answer-option-edit">
                                <div class="memo-answer-option-edit__input max-scale-tag-input">
                                    <span class="memo-answer-option-edit__number">6.</span>
                                    <input class="memo-answer-option-edit__field" id="maxscaletag" name="maxscaletag"
                                        type="text" placeholder="Escribe la etiqueta aquí">
                                    <label class="memo-answer-option-edit__label" for="maxscaletag">Nombre de
                                        etiqueta</label>
                                </div>
                            </div>
                        </section>
                    </fieldset>
                    <fieldset class="memo-question-edit__answertype hidden" id="questionparragraph">
                        <div class="text-area-input text-area-input--disabled">
                            <label for="parragraph" class="text-area-input__label">Campo de texto</label>
                            <textarea class="text-area-input__field" name="parragraph" id="parragraph" rows="5"
                                placeholder="Texto de respuesta larga (Ejemplo)" disabled></textarea>
                        </div>
                    </fieldset>
                    <fieldset class="memo-question-edit__answertype hidden" id="questionmatrixrow">
                        <section class="memo-question-edit__rowSection">
                            <h5 class="memo-question-edit__subtitle">Filas</h5>
                            <section class="memo-question-edit__rowList">
                                <div class="memo-answer-option-edit">
                                    <div class="memo-answer-option-edit__input">
                                        <span class="memo-answer-option-edit__number">1.</span>
                                        <input class="memo-answer-option-edit__field" id="row" name="row" type="text"
                                            placeholder="Escribe el nombre aquí">
                                        <label class="memo-answer-option-edit__label" for="row">Nombre de la
                                            fila</label>
                                    </div>
                                    <!--<button class="memo-answer-option-edit__deleteButton" type="button">
                                        <img src="./images/deleteagreement.svg" alt="">
                                    </button>-->
                                </div>
                            </section>
                            <section class="memo-question-edit__rowControl">
                                <div class="add-item-input">
                                    <div class="add-item-input__icon">
                                        <img src="./images/plusagreement.svg" alt="">
                                    </div>
                                    <div
                                        class="fix-label-text-input fix-label-text-input--secondary add-item-input__input">
                                        <input id="addnewitem" class="fix-label-text-input__field add-item-input__field"
                                            type="text" name="addnewitem" placeholder="Haz click aquí para agregar una fila"
                                            autocomplete="off">
                                        <label class="fix-label-text-input__label" for="addnewitem">Agregar opción</label>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </fieldset>
                    <fieldset class="memo-question-edit__answertype hidden" id="questionmatrixcolumn">
                        <section class="memo-question-edit__columnSection">
                            <h5 class="memo-question-edit__subtitle">Columnas</h5>
                            <select class="scale-select-input" name="maxscale" id="maxscale">
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6" selected="selected">6</option>
                            </select>
                            <div class="memo-answer-option-edit">
                                <div class="memo-answer-option-edit__input">
                                    <span class="memo-answer-option-edit__number">1.</span>
                                    <input class="memo-answer-option-edit__field" id="mincolumntag" name="mincolumntag"
                                        type="text" placeholder="Escribe la etiqueta aquí">
                                    <label class="memo-answer-option-edit__label" for="mincolumntag">Nombre de
                                        etiqueta</label>
                                </div>
                            </div>
                            <div class="memo-answer-option-edit">
                                <div class="memo-answer-option-edit__input matrix-row-max-tag">
                                    <span class="memo-answer-option-edit__number">6.</span>
                                    <input class="memo-answer-option-edit__field" id="maxcolumntag" name="maxcolumntag"
                                        type="text" placeholder="Escribe la etiqueta aquí">
                                    <label class="memo-answer-option-edit__label" for="maxcolumntag">Nombre de
                                        etiqueta</label>
                                </div>
                            </div>
                        </section>
                    </fieldset>
                    <fieldset class="memo-question-edit__justification" id="questionjustification">
                        <section class="memo-question-edit__addJustification">
                            <section>
                                <h5 class="memo-question-edit__subtitle">Justificación</h5>
                                <p class="memo-question-edit__text">¿Desea agregar un campo para la justificación?</p>
                            </section>
                            <section class="memo-question-edit__yes-no">
                                <label class="memo-radio-input">
                                    <input type="radio" name="addjustication" value="yes" />
                                    Sí
                                </label>
                                <label class="memo-radio-input">
                                    <input type="radio" name="addjustication" value="no" checked />
                                    No
                                </label>
                            </section>
                            <div class="expandable-text-area justificationquestion-input-container hidden">
                                <textarea id="justificationquestion" class="expandable-text-area__field question"
                                    name="justificationquestion" placeholder="Escribe aquí la pregunta" required
                                    rows="1"></textarea>
                                <label class="expandable-text-area__label" for="justificationquestion">Pregunta para
                                    justificación</label>
                            </div>
                        </section>
                    </fieldset>
                </section>
            `
            memosectioneditFormContent.appendChild(newQuestion)
        })
    }
}

function addNewSubsection() {
    const memoEditForm = document.querySelector(".memosectionedit-form")

    if (memoEditForm && window.location.href.includes("#memosectionedit")) {

        const addSubsectionBtn = document.querySelector('.addSubsectionBtn')
        const memosectioneditFormContent = memoEditForm.querySelector('.memosectionedit-form__content')

        addSubsectionBtn.addEventListener('click', () => {
            const newSubsection = document.createElement('fieldset')
            newSubsection.className = `memo-subsection-edit memo-edit-form-item`
            newSubsection.innerHTML = `
            <section class="memo-subsection-edit__header">
                    <legend class="memo-subsection-edit__title">Subsección</legend>
                </section>
                <section class="memo-subsection-edit__body">
                    <div class="text-input">
                        <input id="subsectiontitle" class="text-input__field" type="text" name="subsectiontitle"
                            placeholder=" " required autocomplete="off">
                        <label class="text-input__label" for="subsectiontitle">Título de la subsección</label>
                    </div>
                </section>
            `
            memosectioneditFormContent.appendChild(newSubsection)
        })
    }
}

export function addMemoSectionFormFunctions() {
    changeSelectValue()
    changeMemoEditInputsTextSize()
    getMemoSectionEditFormSubsectionsAndQuestions()
    changeQuestionProperties()
    addNewQuestion()
    addNewSubsection()
}