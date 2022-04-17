import { getAllAnswersBySubjectsAndPeriod, getCurrentPeriod, getMemoTemplate, getOptionsFromAnswers, getSubjectMemo } from "./modules/firestore.js"
import { getSubjectFromId } from "./utils/getters.js";
import { sortByAlphabeticAscending, sortByAlphabeticDescending, sortByIndex } from "./utils/sort.js"

export async function getAllSubjectsProgress(userSubjects, currentPeriod) {
    const allSubjectsProgress = document.querySelector(".allSubjectsProgress")

    if (allSubjectsProgress && window.location.href.includes("#memointro")) {
        if (userSubjects.length > 0) {
            let allQuestionsAnswers = []
            for (let index = 0; index < userSubjects.length; index++) {
                const subject = userSubjects[index];
                const subjectAnswers = await getAllAnswersBySubjectsAndPeriod(subject.id, currentPeriod)
                allQuestionsAnswers = allQuestionsAnswers.concat(subjectAnswers)
            }

            let totalQuestions = 12 * userSubjects.length

            let answeredQuestions = allQuestionsAnswers.length

            // Optional answer
            let totalOptionals = 2 * userSubjects.length
            let actualOptionals = 0


            let recoveredOptional = 0

            allQuestionsAnswers.forEach(elem => {
                if (elem.questionIndex === 8 || elem.questionIndex === 11) {
                    recoveredOptional++
                    if (elem.answerValue[0] === "No") {
                        answeredQuestions--
                        actualOptionals++
                    }
                }
            })

            let totalPercent = 0
            if (recoveredOptional !== totalOptionals) {
                totalPercent = (answeredQuestions / (totalQuestions - actualOptionals - (totalOptionals - recoveredOptional)) * 100)
            } else {
                totalPercent = (answeredQuestions / (totalQuestions - actualOptionals) * 100)
            }

            allSubjectsProgress.innerHTML = `
        <h4 class="memo-edit-info__title">Tu progeso:</h4>
        <div class="pie custom-pie" data-pie='{ "colorSlice": "#979DFF", "percent": ${totalPercent}, "colorCircle": "#EDF2FF", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#979DFF", "round": true, "stroke": 10 }'></div>
        <p class="memo-edit-info__date">Completado</p>
        <a href="#memoselectsubject" class="small-button small-button--primary">
            <span>Continuar</span>
        </a>
        `
            const circle = new CircularProgressBar("pie");
            circle.initial();
        }

    }
}

export function renderMemoIntro(user) {
    const memoIntroTitle = document.querySelector(".memointro-screen__intro-title")
    const memoLastEdit = document.querySelector(".memo-last-edit")
    const memointroProgress = document.querySelector(".memo-intro-progress")

    if (memoIntroTitle && window.location.href.includes("#memointro")) {
        if (user.role == "admin") {
            memoIntroTitle.innerHTML = `<span style="font-weight: 600;">${user.name}</span>, si deseas editar el memorando reflexivo da click en “Activar edición”.</h5>`
            memoLastEdit.classList.remove("hidden")
            memointroProgress.classList.add("hidden")
        } else {
            memoIntroTitle.innerHTML = `<span style="font-weight: 600;">${user.name}</span>, es momento de realizar tu reflexión.</h5>`
            memoLastEdit.classList.add("hidden")
            memointroProgress.classList.remove("hidden")
        }
    }
}

export function getInitialMemoSubjects(subjectList) {
    const memoSubjectList = document.querySelector(".memoselectsubject-screen__subjectList")
    if (memoSubjectList && (window.location.href.includes("#memoselectsubject") || window.location.href.includes("#progressselectsubject"))) {
        const copy = [...subjectList].sort(sortByAlphabeticAscending)
        renderMemoSubject(copy)
    }
}

export function renderGoToImproveActionsButton() {
    const goToImproveActionsButton = document.querySelector('.goToImproveActionsButton')
    if (goToImproveActionsButton && window.location.href.includes("#memosections")) {
        const subjectId = window.location.hash.split("?")[1]
        goToImproveActionsButton.href = `#memoimproveactions?${subjectId}`
    }
}

function renderMemoSubject(subjectList) {
    const memoSubjectList = document.querySelector(".memoselectsubject-screen__subjectList")
    memoSubjectList.innerHTML = ``

    let anchor = ""
    if (window.location.href.includes("#memoselectsubject")) {
        anchor = "memosections"
    } else {
        anchor = "progresssubject"
    }

    subjectList.forEach(subject => {
        //console.log(subject.id)
        const memoSubject = document.createElement("div")
        memoSubject.className = "memo-subject"
        memoSubject.innerHTML = `
            <h5 class="memo-subject__title">${subject.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#${anchor}?${subject.id}">
                <span>Seleccionar</span>
            </a>
            `
        memoSubjectList.appendChild(memoSubject)
    });
}

export function onSortFilterMemoSubjectListener(userSubjects, userGroups) {
    const memoSubjectsSettingsForm = document.querySelector(".memoselectsubject-screen__controls")

    if ((window.location.href.includes("#memoselectsubject") || window.location.href.includes("#progressselectsubject")) && memoSubjectsSettingsForm) {
        const memoSubjectsSortSelect = memoSubjectsSettingsForm.alphabetic
        const memoSubjectsFilterSelect = memoSubjectsSettingsForm.group

        userGroups.forEach(e => {
            const groupOption = document.createElement('option')
            groupOption.value = e
            groupOption.innerHTML = e
            memoSubjectsFilterSelect.appendChild(groupOption)
        })

        memoSubjectsSettingsForm.addEventListener('input', () => {
            sortFilterMemoSubjects(userSubjects, memoSubjectsSortSelect, memoSubjectsFilterSelect)
        })
    }
}

function sortFilterMemoSubjects(userSubjects, subjectSort, groupFilter) {
    let filterCopy = [...userSubjects]

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
    renderMemoSubject(filterCopy)
}

export async function getMemoSectionInfo(userSubjects, currentPeriod) {
    const memosectionScreen = document.querySelector(".memosections-screen")

    if (memosectionScreen && window.location.href.includes("#memosections")) {
        const subjectId = window.location.hash.split("?")[1]
        //console.log(subjectId)
        const selectedSubject = getSubjectFromId(subjectId, userSubjects)

        const memosectionsSubjectName = memosectionScreen.querySelector(".memosections-screen__info--subjectName")
        const memosectionsSubjectPeriod = memosectionScreen.querySelector(".memosections-screen__info--subjectPeriod")
        memosectionsSubjectName.innerHTML = selectedSubject.name
        memosectionsSubjectPeriod.innerHTML = currentPeriod

        let memoQuestions = await getSubjectMemo(subjectId, currentPeriod)

        if (memoQuestions.length === 0) {
            getMemoTemplate(`memos/periods/${currentPeriod}/${subjectId}/questions`)
        } else {
            // Obtener grupos
            memoQuestions.sort(sortByIndex)

            const groups = memoQuestions.reduce((groups, item) => ({
                ...groups,
                [item.section]: [...(groups[item.section] || []), item]
            }), {});

            renderMemoSections(memoQuestions, groups, currentPeriod, subjectId)
        }
    }
}

async function renderMemoSections(memoQuestions, groupList, memoPeriod, subjectId) {
    const memoSectionList = document.querySelector(".memosections-screen__sectionList")
    memoSectionList.innerHTML = ``

    //const groupNames = Object.keys(groups);
    const question8Answer = await getOptionsFromAnswers(memoQuestions[7].id, subjectId, memoPeriod)
    const question11Answer = await getOptionsFromAnswers(memoQuestions[10].id, subjectId, memoPeriod)

    // Section counter and progress
    let firstSectionLength = 7
    let secondSectionLength = 2
    let thirdSectionLength = 3

    const firstSectionQuestions = groupList['Autorreflexión']
    const secondSectionQuestions = groupList['Retroalimentación obtenida sobre el curso']
    const thirdSectionQuestions = groupList['Plan de acción']

    // First section
    let firstSectionCounter = 0
    firstSectionQuestions.forEach(q => {
        if (q.answerId) {
            firstSectionCounter++
        }
    })
    const firstSectionPercent = Math.round((firstSectionCounter / firstSectionLength) * 100)


    // Second section
    let secondSectionCounter = 0
    secondSectionQuestions.forEach(q => {
        if (q.answerId) {
            secondSectionCounter++
        }
    })

    if (question8Answer[0] === "No") {
        if (secondSectionCounter > 1) {
            secondSectionCounter--
        }
        secondSectionLength--
    }
    const secondSectionPercent = Math.round((secondSectionCounter / secondSectionLength) * 100)


    // Third section
    let thirdSectionCounter = 0
    thirdSectionQuestions.forEach(q => {
        if (q.answerId) {
            thirdSectionCounter++
        }
    })

    if (question11Answer[0] === "No") {
        if (thirdSectionCounter > 2) {
            thirdSectionCounter--
        }
        thirdSectionLength--
    }
    const thirdSectionPercent = Math.round((thirdSectionCounter / thirdSectionLength) * 100)

    // Pie graphic
    const generalMemoProgressPercent = (firstSectionPercent + secondSectionPercent + thirdSectionPercent) / 3;
    const progressContainer = document.querySelector(".memoprogress-item--general")
    progressContainer.innerHTML = `
    <p class="memoprogress-item__title">Avance del curso:</p>
    <div class="pie custom-pie" data-pie='{ "colorSlice": "#FDB572", "percent": ${generalMemoProgressPercent}, "colorCircle": "#FFF2E5", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#FDB572", "round": true, "stroke": 10}'></div>
    `
    const circle = new CircularProgressBar("pie");
    circle.initial();

    /// Render
    Object.keys(groupList).forEach((group, index) => {
        const memoSectionProgressItem = document.createElement("div")
        memoSectionProgressItem.className = `memo-section-progress-item`

        let currentQuestionId = ""

        // Revisar cada pregunta:
        for (let i = 0; i < groupList[group].length; i++) {
            const question = groupList[group][i];
            if (!question.answerId) {
                if (index === 1 && question8Answer[0] === "No") {
                    currentQuestionId = groupList[group][i - 1].id
                    break
                } else if (index === 2 && question11Answer[0] === "No") {
                    currentQuestionId = groupList[group][i - 1].id
                    break
                } else {
                    currentQuestionId = question.id
                    break
                }
                /*} else if(i == groupList[group].length - 1 && question.answerId) {
                    currentQuestionId = lastOpenedQuestionId*/
            } else if (i === groupList[group].length - 1 && question.answerId) {
                if (index === 1) {
                    if (question8Answer[0] === "Sí") {
                        currentQuestionId = memoQuestions[8].id
                    } else {
                        currentQuestionId = memoQuestions[7].id
                    }
                } else if (index === 2) {
                    if (question11Answer[0] === "Sí") {
                        currentQuestionId = memoQuestions[11].id
                    } else {
                        currentQuestionId = memoQuestions[10].id
                    }
                } else {
                    currentQuestionId = question.id
                }
            }
        }

        let sectionProgress = 0
        switch (index) {
            case 0:
                sectionProgress = firstSectionPercent
                break;
            case 1:
                sectionProgress = secondSectionPercent
                break;
            case 2:
                sectionProgress = thirdSectionPercent
                break;
        }

        memoSectionProgressItem.innerHTML = `
        <section class="memo-section-progress-item__progress">
            <div class="memo-section-progress-item__number">
                <span>${index + 1}</span>
            </div>
            <div class="memo-section-progress-item__percent">
                <span class="memo-section-progress-item__percentNumber">${sectionProgress}%</span>
                <div class="memo-section-progress-item__progressBar">
                    <div class="memo-section-progress-item__currentBar" style="width:${sectionProgress}%">
                    </div>
                </div>
            </div>
        </section>
        <div class="memo-module" style="background-image: url('./images/circlepatternmemomodules.svg');">
            <a class="memo-module__anchor">
            </a>
            <div class="memo-module__patcheditable">
                <h4 class="memo-module__name">${group}
                </h4>
            </div>
        </div>
        `
        memoSectionList.appendChild(memoSectionProgressItem)

        const anchor = memoSectionProgressItem.querySelector(".memo-module__anchor")
        switch (index) {
            case 0:
                anchor.setAttribute('href', `#memoquestion?${memoPeriod}_${subjectId}_${currentQuestionId}`)
                break;
            case 1:
                if (firstSectionPercent >= 100) {
                    anchor.setAttribute('href', `#memoquestion?${memoPeriod}_${subjectId}_${currentQuestionId}`)
                } else {
                    memoSectionProgressItem.querySelector(".memo-module").classList.add("memo-module--locked")
                }
                break;
            case 2:
                if (firstSectionPercent >= 100 && secondSectionPercent >= 100) {
                    anchor.setAttribute('href', `#memoquestion?${memoPeriod}_${subjectId}_${currentQuestionId}`)
                } else {
                    memoSectionProgressItem.querySelector(".memo-module").classList.add("memo-module--locked")
                }
                break;
        }
    })
}
