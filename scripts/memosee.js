import { getCareerSubjects, getDepartmentCareers, getDepartments } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";

export async function renderMemoseeDepartments() {
    const memoseeDepartments = document.querySelector(".memosee-screen__selectList--departments")

    if(memoseeDepartments && window.location.href.includes("#memoseedepartments")) {
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

    if(memoseeCareers && window.location.href.includes("#memoseecareers")) {
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
    
    if(memoseeCareers && window.location.href.includes("#memoseesubjects")) {
        const careerId = window.location.hash.split("?")[1]
        const subjects = await getCareerSubjects(careerId)

        
    }
}