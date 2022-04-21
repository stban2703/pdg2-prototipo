import { getGroupSubjects } from "./modules/firestore.js"
import { hideLoader, showLoader } from "./utils/loader.js"
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js"


export async function getInitialMyGroupSubjects() {
    const myGroupSubjects = document.querySelector(".memosee-screen__selectList--groupSubjects")

    if (myGroupSubjects && window.location.href.includes("#mygroup")) {
        showLoader()
        const groupId = window.location.hash.split("?")[1]
        const subjects = await getGroupSubjects(groupId)
        renderMyGroupSubjects(subjects)
        onSortMygroupSubjectListener(subjects)
    }
    hideLoader()
}

function renderMyGroupSubjects(list) {
    const myGroupSubjects = document.querySelector(".memosee-screen__selectList--groupSubjects")
    myGroupSubjects.innerHTML = ``

    list.forEach(subject => {
        const subjectItem = document.createElement("div")
        subjectItem.className = "memo-subject"
        subjectItem.innerHTML = `
        <h5 class="memo-subject__title">${subject.name}</h5>
        <a class="memo-subject__button small-button small-button--secondary" href="#memoseeanswers?${subject.id}">
            <span>Seleccionar</span>
        </a>
    `
        myGroupSubjects.appendChild(subjectItem)
    });
}

function onSortMygroupSubjectListener(subjects) {
    const myGroupSubjectsControl = document.querySelector(".memoselectsubject-screen__controls--mygroup")

    if (window.location.href.includes("#mygroup") && myGroupSubjectsControl) {
        const subjectsSortSelect = myGroupSubjectsControl.alphabetic

        myGroupSubjectsControl.addEventListener('input', () => {
            sortMyGroupSubjects(subjects, subjectsSortSelect)
        })
    }
}

function sortMyGroupSubjects(subjects, subjectSort) {
    let filterCopy = [...subjects]

    if (subjectSort.value.length > 0) {
        if (subjectSort.value == "ascending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticAscending)
        } else if (subjectSort.value = "descending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticDescending)
        }
    }
    renderMyGroupSubjects(filterCopy)
}