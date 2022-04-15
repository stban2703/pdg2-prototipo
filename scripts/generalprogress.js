import { createImproveActionComment, getAllAnswersByViewType, getCareerInfo, getCareerSubjects, getImproveActionComment, getImproveActions, getSubcjectInfo } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js";

// Select view general
export async function getInitialGeneralSelect(userInfo) {
    const generalselectScreen = document.querySelector(".generalselect-screen--select")

    if (generalselectScreen && window.location.href.includes("#generalselect")) {
        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        const generalselectScreenList = generalselectScreen.querySelector(".generalselect-screen__list")

        let currentRole = ""
        userInfo.role.forEach(role => {
            if (role === "principal" || role === "boss" || role === "admin") {
                currentRole = role
            }
        });

        switch (currentRole) {
            case "principal":
                const careerInfo = await getCareerInfo(userInfo.principalCareer)
                generalSelectSectionTitle.innerHTML = `Progreso general<br>${careerInfo.name}`

                generalselectScreenList.innerHTML = `
                
                <div class="visualization-item">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización general</h5>
                    <a class="small-button small-button--secondary" href="#generalall?career_${careerInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos a <span style="font-weight: 600;">nivel global</span> sobre los <span style="font-weight: 600;">docentes</span> del programa <span style="font-weight: 600;">${careerInfo.name}</span>.
                    </p>
                    </section>
                </div>
                <div class="visualization-item visualization-item--pink">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización específica</h5>
                    <a class="small-button small-button--secondary" href="#generalsubjects?${careerInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos de forma <span style="font-weight: 600;">detallada</span> por cada curso del programa <span style="font-weight: 600;">${careerInfo.name}</span>.
                    </p>
                    </section>
                </div>

                `
                break;
        }
    }
}

// Subject general
export async function getInitialGeneralSubjets() {
    const generalselectScreenSubjects = document.querySelector(".generalselect-screen--subjects")
    if (generalselectScreenSubjects && window.location.href.includes("#generalsubjects")) {
        showLoader()
        const careerId = window.location.href.split("?")[1]
        const careerInfo = await getCareerInfo(careerId)
        const subjects = await getCareerSubjects(careerId)
        hideLoader()

        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        generalSelectSectionTitle.innerHTML = `Progreso general<br>${careerInfo.name}`

        const generalSelectSectionDescription = document.querySelector(".generalselect-screen__description")
        generalSelectSectionDescription.innerHTML = `Selecciona el <span style="font-weight: 600;">curso de ${careerInfo.name}</span> que deseas observar el progreso`

        const subjectsForm = generalselectScreenSubjects.querySelector(".memoselectsubject-screen__controls")
        careerInfo.groups.forEach(group => {
            const option = document.createElement('option')
            option.value = group
            option.innerHTML = group
            subjectsForm.group.appendChild(option)
        })

        const copy = [...subjects].sort(sortByAlphabeticAscending)
        renderGeneralSubjects(copy)
        onSortFilterGeneralSubjectListener(subjects)
    }
}

function onSortFilterGeneralSubjectListener(subjects) {
    const generalSubjectsSettingsForm = document.querySelector(".memoselectsubject-screen__controls--general")

    if (window.location.href.includes("#generalsubjects") && generalSubjectsSettingsForm) {
        const subjectsSortSelect = generalSubjectsSettingsForm.alphabetic
        const subjectsFilterSelect = generalSubjectsSettingsForm.group

        generalSubjectsSettingsForm.addEventListener('input', () => {
            sortFilterGeneralSubjects(subjects, subjectsSortSelect, subjectsFilterSelect)
        })
    }
}

function sortFilterGeneralSubjects(subjects, subjectSort, groupFilter) {
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
    renderGeneralSubjects(filterCopy)
}

function renderGeneralSubjects(list) {
    const generalSubjectListContainer = document.querySelector(".generalselect-screen__list--subjects")
    generalSubjectListContainer.innerHTML = ``

    list.forEach(subject => {
        const subjectItem = document.createElement("div")
        subjectItem.className = "memo-subject"
        subjectItem.innerHTML = `
            <h5 class="memo-subject__title">${subject.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#generalspecific?${subject.id}">
                <span>Ver</span>
            </a>
            `
        generalSubjectListContainer.appendChild(subjectItem)
    })
}

// Specific general
export async function renderImproveActionsForSpecificGeneral(period) {

    const generalImproveActionsContainer = document.querySelector('.generalImproveActionsContainer')

    if (generalImproveActionsContainer && window.location.href.includes("#generalimproveactions")) {
        const subjectTitle = document.querySelector('.progresssubject-screen__info--subjectName')
        const periodTitle = document.querySelector('.progresssubject-screen__info--subjectPeriod')

        const subjectId = window.location.hash.split("?")[1]
        const subjectInfo = await getSubcjectInfo(subjectId)

        subjectTitle.innerHTML = subjectInfo.name
        periodTitle.innerHTML = period

        const improveActions = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subjectId)
        if (improveActions.length > 0) {
            if (improveActions[0].answerValue.length > 0) {
                const improveActionsContainer = document.querySelector(".improve-actions__list")
                const emptyContainer = document.querySelector(".improve-actions__empty")

                improveActionsContainer.innerHTML = ``
                improveActionsContainer.classList.remove("hidden")
                emptyContainer.classList.add("hidden")

                const improveActionsList = improveActions[0].answerValue
                improveActionsList.forEach((action, index) => {
                    const actionItem = document.createElement('tr')
                    actionItem.className = "improve-action-item"
                    actionItem.innerHTML = `
                        <td>
                            <div class="improve-action-item__number">
                                <span>${index + 1}</span>
                            </div>
                        </td>
                        <td class="improve-action-item__title">
                            <h5>${action.name}</h5>
                        </td>
                        <td class="improve-action-item__description">
                            <p>${action.description}</p>
                        </td>
                    `
                    improveActionsContainer.appendChild(actionItem)
                })
            }
        }

        const openAddCommentButton = document.querySelector(".openAddCommentButton")
        const addCommentForm = document.querySelector(".addCommentForm")
        openAddCommentButton.addEventListener('click', () => {
            addCommentForm.classList.remove("hidden")
            openAddCommentButton.classList.add("hidden")
        })


        const comment = await getImproveActionComment(subjectId, period)
        if (comment.length > 0) {
            openAddCommentButton.classList.add("hidden")
            const commentContainer = document.querySelector(".improve-actions__commentContainer")
            commentContainer.classList.remove("hidden")
            commentContainer.innerHTML = `
            <p>${comment[0].comment}</p>
            `
        }
    }
}

export async function onSubmitImproveActionComment(userInfo, period) {
    const addCommentForm = document.querySelector(".addCommentForm")

    if (addCommentForm && window.location.href.includes("#generalimproveactions")) {
        addCommentForm.addEventListener("submit", (event) => {
            event.preventDefault()
            const subjectId = window.location.hash.split("?")[1]
            showLoader()
            createImproveActionComment(subjectId, period, userInfo, addCommentForm.comment.value)
        })
    }
}

// All general
export async function getInitialGeneralAll(currentPeriod) {
    const generalAllScreen = document.querySelector(".progresssubject-screen--generalAll")

    if (generalAllScreen && window.location.href.includes("generalall")) {
        const view = window.location.hash.split('?')[1].split('_')[0]
        const viewId = window.location.hash.split('?')[1].split('_')[1]

        showLoader()
        const allAnswers = await getAllAnswersByViewType(view, viewId, currentPeriod)
        hideLoader()

        const totalsQuestions = 12
        const answersArray = []

        /*for (let index = 0; index < 12; index++) {
            const element = array[index];
            
        }
            answersArray[value] = allAnswers.filter(answer => {
                return answer.questionIndex === value
            })
        })

        console.log(answersArray)*/
    }
}

async function getAllAnswers(subjects) {
    car
}

