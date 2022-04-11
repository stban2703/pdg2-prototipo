import { getMemoTemplate, getSubjectMemo } from "./modules/firestore.js"
import { sortByAlphabeticAscending, sortByAlphabeticDescending, sortByIndex } from "./utils/sort.js"

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
    if (memoSubjectList && window.location.href.includes("#memoselectsubject")) {
        const copy = [...subjectList].sort(sortByAlphabeticAscending)
        renderMemoSubject(copy)
    }
}

function renderMemoSubject(subjectList) {
    const memoSubjectList = document.querySelector(".memoselectsubject-screen__subjectList")

    memoSubjectList.innerHTML = ``
    subjectList.forEach(subject => {
        //console.log(subject.id)
        const memoSubject = document.createElement("div")
        memoSubject.className = "memo-subject"
        memoSubject.innerHTML = `
            <h5 class="memo-subject__title">${subject.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#memosections?${subject.id}">
                <span>Seleccionar</span>
            </a>
            `
        memoSubjectList.appendChild(memoSubject)
    });
}

export function onSortFilterMemoSubjectListener(userSubjects, userGroups) {
    const memoSubjectsSettingsForm = document.querySelector(".memoselectsubject-screen__controls")

    if (window.location.href.includes("#memoselectsubject") && memoSubjectsSettingsForm) {
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

export async function getMemoSectionInfo(userSubjects) {
    const memosectionScreen = document.querySelector(".memosections-screen")

    if (memosectionScreen && window.location.href.includes("#memosections")) {
        const subjectId = window.location.hash.split("?")[1]
        //console.log(subjectId)
        const selectedSubject = getSubjectFromId(subjectId, userSubjects)

        const memosectionsSubjectName = memosectionScreen.querySelector(".memosections-screen__info--subjectName")
        const memosectionsSubjectPeriod = memosectionScreen.querySelector(".memosections-screen__info--subjectPeriod")
        memosectionsSubjectName.innerHTML = selectedSubject.name
        memosectionsSubjectPeriod.innerHTML = selectedSubject.memoPeriod

        let memoQuestions = await getSubjectMemo(subjectId, selectedSubject.memoPeriod)

        if (memoQuestions.length === 0) {
            getMemoTemplate(`memos/periods/${selectedSubject.memoPeriod}/${subjectId}/questions`)
        } else {
            // Obtener grupos
            memoQuestions.sort(sortByIndex)

            const groups = memoQuestions.reduce((groups, item) => ({
                ...groups,
                [item.section]: [...(groups[item.section] || []), item]
            }), {});

            renderMemoSections(groups, selectedSubject.memoPeriod, subjectId)
        }
    }
}

function renderMemoSections(groupList, memoPeriod, subjectId) {
    const memoSectionList = document.querySelector(".memosections-screen__sectionList")
    memoSectionList.innerHTML = ``

    //const groupNames = Object.keys(groups);
    Object.keys(groupList).forEach((group, index) => {
        const memoSectionProgressItem = document.createElement("div")
        memoSectionProgressItem.className = `memo-section-progress-item`

        let currentQuestionId = ""

        // Revisar cada pregunta:
        for (let i = 0; i < groupList[group].length; i++) {
            const question = groupList[group][i];
            if (!question.answerId) {
                currentQuestionId = question.id
                break
            }
        }

        memoSectionProgressItem.innerHTML = `
        <section class="memo-section-progress-item__progress">
            <div class="memo-section-progress-item__number">
                <span>${index + 1}</span>
            </div>
            <div class="memo-section-progress-item__percent">
                <span class="memo-section-progress-item__percentNumber">100%</span>
                <div class="memo-section-progress-item__progressBar">
                    <div class="memo-section-progress-item__currentBar">
                    </div>
                </div>
            </div>
        </section>
        <div class="memo-module" style="background-image: url('./images/circlepatternmemomodules.svg');">
            <a href="#memoquestion?${memoPeriod}_${subjectId}_${currentQuestionId}">
            </a>
            <div class="memo-module__patcheditable">
                <h4 class="memo-module__name">${group}
                </h4>
            </div>
        </div>
        `
        memoSectionList.appendChild(memoSectionProgressItem)
    })
}

function getSubjectFromId(id, userSubjects) {
    const subject = userSubjects.find((s) => {
        return s.id === id
    })
    return subject
}