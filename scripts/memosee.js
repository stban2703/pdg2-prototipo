import { getCareerInfo, getCareerSubjects, getDepartmentCareers, getDepartments } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js";

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
            <a class="memo-subject__button small-button small-button--secondary" href="#memoseesubjects?${subject.id}">
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