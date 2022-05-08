import { getAllAnswersBySubjectAndPeriod, getCareerInfo, getCareerSubjects, getDepartmentCareers, getDepartments, getSubcjectInfo } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";
import { sortByAlphabeticAscending, sortByAlphabeticDescending, sortByQuestionIndex } from "./utils/sort.js";

let currentMemoseeAnswerTab = 0

export async function renderMemoseeDepartments() {
    const memoseeDepartments = document.querySelector(".memosee-screen__selectList--departments")

    if (memoseeDepartments && window.location.href.includes("#memoseedepartments")) {
        showLoader()
        const departments = await getDepartments();
        memoseeDepartments.innerHTML = ``

        departments.forEach(department => {
            const departmentItem = document.createElement("div")
            departmentItem.className = "memo-subject"
            departmentItem.innerHTML = `
            <h5 class="memo-subject__title">${department.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#memoseecareers?${department.id}">
                <span>Seleccionar</span>
            </a>
            `
            memoseeDepartments.appendChild(departmentItem)
        });
        hideLoader()
    }
}

export async function renderMemoseeCareers() {
    const memoseeCareers = document.querySelector(".memosee-screen__selectList--careers")

    if (memoseeCareers && window.location.href.includes("#memoseecareers")) {
        showLoader()
        const departmentId = window.location.hash.split("?")[1]
        const careers = await getDepartmentCareers(departmentId)
        const careerItem = document.createElement("div")
        careerItem.className = "memo-subject"
        memoseeCareers.innerHTML = ``
        careers.forEach(career => {
            const careerItem = document.createElement("div")
            careerItem.className = "memo-subject"
            careerItem.innerHTML = `
            <h5 class="memo-subject__title">${career.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#memoseesubjects?${career.id}">
                <span>Seleccionar</span>
            </a>
            `
            memoseeCareers.appendChild(careerItem)
        });
        hideLoader()
    }
}

export async function getInitialMemoseeSubjects() {
    const memoseeCareers = document.querySelector(".memosee-screen__selectList--subjects")

    if (memoseeCareers && window.location.href.includes("#memoseesubjects")) {
        showLoader()
        const careerId = window.location.hash.split("?")[1]
        const careerInfo = await getCareerInfo(careerId)
        const subjects = await getCareerSubjects(careerId)

        const subjectsForm = document.querySelector(".memoselectsubject-screen__controls")
        careerInfo.groups.forEach(group => {
            const option = document.createElement('option')
            option.value = group
            option.innerHTML = group
            subjectsForm.group.appendChild(option)
        })
        renderMemoseeSubjects(subjects)
        onSortFilterMemoseeSubjectListener(subjects)
    }
}

function renderMemoseeSubjects(list) {
    const memoseeCareers = document.querySelector(".memosee-screen__selectList--subjects")
    memoseeCareers.innerHTML = ``
    list.forEach(subject => {
        const subjectItem = document.createElement("div")
        subjectItem.className = "memo-subject"
        subjectItem.innerHTML = `
            <h5 class="memo-subject__title">${subject.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#memoseeanswers?${subject.id}">
                <span>Seleccionar</span>
            </a>
        `
        memoseeCareers.appendChild(subjectItem)
    })
}

function onSortFilterMemoseeSubjectListener(subjects) {
    const memoseeSubjectsControl = document.querySelector(".memoselectsubject-screen__controls--seeMemos")

    if (window.location.href.includes("#memoseesubjects") && memoseeSubjectsControl) {
        const subjectsSortSelect = memoseeSubjectsControl.alphabetic
        const subjectsFilterSelect = memoseeSubjectsControl.group

        memoseeSubjectsControl.addEventListener('input', () => {
            sortFilterMemoseeSubjects(subjects, subjectsSortSelect, subjectsFilterSelect)
        })
    }
}

function sortFilterMemoseeSubjects(subjects, subjectSort, groupFilter) {
    let filterCopy = [...subjects]

    if (subjectSort.value.length > 0) {
        if (subjectSort.value == "ascending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticAscending)
        } else if (subjectSort.value = "descending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticDescending)
        }
    }

    if (groupFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.group == groupFilter.value) {
                return true
            }
        })
    }
    renderMemoseeSubjects(filterCopy)
}

export function changeMemoseeAnswerTab() {
    const memoTabButtons = document.querySelectorAll(".memo-summary__tab")

    if (memoTabButtons && window.location.href.includes("#memoseeanswers")) {
        memoTabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                currentMemoseeAnswerTab = index
                renderMemoseeAnswerTab()
            })
        })
    }
}

export function renderMemoseeAnswerTab() {
    const buttons = document.querySelectorAll(".memo-summary__tab")
    const sections = document.querySelectorAll(".memo-summary__section")

    if (buttons && sections && window.location.href.includes("#memoseeanswers")) {
        buttons.forEach((button, index) => {
            if (index === currentMemoseeAnswerTab) {
                button.classList.add("memo-summary__tab--selected")
            } else {
                button.classList.remove("memo-summary__tab--selected")
            }
        })

        sections.forEach((section, index) => {
            if (index === currentMemoseeAnswerTab) {
                section.classList.remove("hidden")
            } else {
                section.classList.add("hidden")
            }
        })
    }
}

export async function renderMemoseeAnswersQuestions(currentPeriod, currentRole) {
    const sections = document.querySelectorAll(".memo-summary__section")
    if (sections && window.location.href.includes("#memoseeanswers")) {
        showLoader()
        const subjectId = window.location.hash.split("?")[1]
        const subectInfo = await getSubcjectInfo(subjectId)
        const answers = await getAllAnswersBySubjectAndPeriod(subjectId, currentPeriod)
        answers.sort(sortByQuestionIndex)


        const subjectInfoTitles = document.querySelectorAll(".subjectTitle")
        subjectInfoTitles[0].innerHTML = subectInfo.name
        subjectInfoTitles[1].innerHTML = currentPeriod
        subjectInfoTitles[2].innerHTML = subectInfo.teacher


        const answersHolders = document.querySelectorAll(".memo-summary__answerHolder")

        const seeImproveActionSection = document.querySelector(".memo-improve-actions")

        if (currentRole === "leader") {
            seeImproveActionSection.innerHTML = `
                <section class="memo-improve-actions__header">
                    <img src="./images/improveactionscommentsicon.svg" alt="">
                    <p class="memo-improve-actions__title">Agregar comentario</p>
                </section>
                <a href="#generalimproveactions?${subjectId}" class="small-button small-button--secondary goToImproveActionsButton">
                    <span>Ir</span>
                </a>
            `
        } else if (currentRole === "admin") {
            seeImproveActionSection.innerHTML = `
                <section class="memo-improve-actions__header">
                    <img src="./images/improveactionsicon.svg" alt="">
                    <p class="memo-improve-actions__title">Ver acciones de mejora</p>
                </section>
                <a class="small-button small-button--secondary goToImproveActionsButton">
                    <span>Ver</span>
                </a>
            `
            const goToImproveActionsButton = document.querySelector(".goToImproveActionsButton")
            goToImproveActionsButton.addEventListener('click', () => {
                currentMemoseeAnswerTab = 2
                renderMemoseeAnswerTab()
                answersHolders[9].scrollIntoView(true)
            })
        }

        // First
        if (answers[0] && answers[0].answerValue[0]) {
            answersHolders[0].innerHTML = answers[0].answerValue[0]
        }

        // Second
        answersHolders[1].innerHTML = ``
        if (answers[1] && answers[1].answerValue.length > 0) {
            answers[1].answerValue.forEach(value => {
                const optionItem = document.createElement("li")
                optionItem.className = "memo-summary__answerItem"
                optionItem.innerHTML = value
                answersHolders[1].appendChild(optionItem)
            })
        }

        // Third
        const scaleValues = [
            "Bajo (Aproximadamente solo un 10% evidencian en sus resultados el logro de los objetivos del curso)",
            "Deficiente",
            "Medio-bajo",
            "Medio (Aproximadamente un 60% de los estudiantes evidencian en sus resultados el logro de los objetivos del curso)",
            "Medio-alto",
            "Alto (Aproximadamente un 90% de los estudiantes evidencian en sus resultados el logro de los objetivos del curso)"
        ]
        if (answers[2] && answers[2].answerValue) {
            answersHolders[2].innerHTML = `${answers[2].answerValue[0]}. ${scaleValues[parseInt(answers[2].answerValue[0]) - 1]}`
            document.querySelector(".improve-action-question3").innerHTML = answers[2].answerValue[0]
        }

        // Fourth
        answersHolders[3].innerHTML = ``
        if (answers[3] && answers[3].answerValue.length > 0) {
            answers[3].answerValue.forEach(value => {
                const optionItem = document.createElement("li")
                optionItem.className = "memo-summary__answerItem"
                optionItem.innerHTML = value
                answersHolders[3].appendChild(optionItem)
            })
        }

        // Fifth
        document.querySelector(".improve-action-question5").innerHTML = ``
        if (answers[4] && answers[4].answerValue.length > 0) {
            answers[4].answerValue.forEach((value) => {
                const itemValue = parseInt(value.split("|")[1])

                const optionTag = document.createElement("li")
                optionTag.className = `memo-summary__answerItem${itemValue <= 3 ? ' memo-summary__answerItem--negative' : ''}`
                optionTag.innerHTML = value.split("|")[0]

                const optionValue = document.createElement("li")
                optionValue.className = `memo-summary__answerItem${itemValue <= 3 ? ' memo-summary__answerItem--negative memo-summary__answerItem--semibold' : ''}`
                optionValue.innerHTML = value.split("|")[1]

                answersHolders[4].querySelectorAll(".memo-summary__answerList")[0].appendChild(optionTag)
                answersHolders[4].querySelectorAll(".memo-summary__answerList")[1].appendChild(optionValue)

                if (itemValue <= 3) {
                    const previousAnswerItem = document.createElement("p")
                    previousAnswerItem.className = "memo-summary__strategyItem"
                    previousAnswerItem.innerHTML = value.split("|")[0]
                    document.querySelector(".improve-action-question5").appendChild(previousAnswerItem)
                }
            })
        }

        // Sixth
        document.querySelector(".improve-action-question6").innerHTML = ``
        if (answers[5] && answers[5].answerValue.length > 0) {
            answers[5].answerValue.forEach((value) => {
                const itemValue = parseInt(value.split("|")[1])

                const optionTag = document.createElement("li")
                optionTag.className = `memo-summary__answerItem${itemValue <= 3 ? ' memo-summary__answerItem--negative' : ''}`
                optionTag.innerHTML = value.split("|")[0]

                const optionValue = document.createElement("li")
                optionValue.className = `memo-summary__answerItem${itemValue <= 3 ? ' memo-summary__answerItem--negative memo-summary__answerItem--semibold' : ''}`
                optionValue.innerHTML = value.split("|")[1]

                answersHolders[5].querySelectorAll(".memo-summary__answerList")[0].appendChild(optionTag)
                answersHolders[5].querySelectorAll(".memo-summary__answerList")[1].appendChild(optionValue)

                if (itemValue <= 3) {
                    const previousAnswerItem = document.createElement("p")
                    previousAnswerItem.className = "memo-summary__strategyItem"
                    previousAnswerItem.innerHTML = value.split("|")[0]
                    document.querySelector(".improve-action-question6").appendChild(previousAnswerItem)
                }
            })
        }

        // Seventh
        answersHolders[6].innerHTML = ``
        if (answers[6] && answers[6].answerValue.length > 0) {
            answers[6].answerValue.forEach(value => {
                const optionItem = document.createElement("li")
                optionItem.className = "memo-summary__answerItem"
                optionItem.innerHTML = value
                answersHolders[6].appendChild(optionItem)
            })
        }

        // Eigth
        if (answers[7] && answers[7].answerValue) {
            answersHolders[7].innerHTML = answers[7].answerValue[0]
            document.querySelector(".improve-action-question8").innerHTML = answers[7].answerValue[0]
        }

        // Ninth
        if (answers[8] && answers[8].answerValue) {
            answersHolders[8].innerHTML = answers[8].answerValue[0]
        }

        // Improve actions
        if (answers[9] && answers[9].answerValue.length > 0) {
            answers[9].answerValue.forEach((elem, index) => {
                const improveActionItem = document.createElement("tr")
                improveActionItem.className = 'improve-action-item'
                improveActionItem.innerHTML = `
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
                `
                document.querySelector(".improve-actions__list").appendChild(improveActionItem)
            })
            const empty = document.querySelector(".improve-actions__empty")
            empty.classList.add("hidden")
        }

        // Eleven
        if (answers[10] && answers[10].answerValue) {
            answersHolders[10].innerHTML = answers[10].answerValue[0]
        }

        // Eleven
        if (answers[11] && answers[11].answerValue) {
            answersHolders[11].innerHTML = answers[11].answerValue[0]
        }

        // Twelve
        if (answers[11] && answers[11].justification) {
            document.querySelector(".memo-summary__answerJustification").innerHTML = `
                <span style="font-weight: 600;">Descripción: </span>${answers[11].justification}
            `
        }
        hideLoader()
    }
}