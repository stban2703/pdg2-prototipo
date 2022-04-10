import { getMemoTemplate, getSubjectMemo } from "./modules/firestore.js"
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js"

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
        } else if(subjectSort.value = "descending") {
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

        const selectedSubject = userSubjects.find((s) => {
            return s.id = subjectId
        })

        console.log(subjectId, selectedSubject.memoPeriod)
        let memoQuestions = await getSubjectMemo(subjectId, selectedSubject.memoPeriod)
        
        if(memoQuestions.length === 0) {
            getMemoTemplate(`memos/periods/${selectedSubject.memoPeriod}/${subjectId}/questions`)
        }
    }
}