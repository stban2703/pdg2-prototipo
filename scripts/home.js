import { getAllAnswersBySubjectAndPeriod, getCareerInfo, getDepartmentCareers, getDepartments, getGroupInfo, getSubjectsByDepartmentId, getSubjectsByView, getTeacherById } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";
import { sortByQuestionIndex } from "./utils/sort.js";

export function showShortcuts(roles) {
    const homeScreenShortCuts = document.querySelector(".home-screen__shortcuts")

    if (homeScreenShortCuts) {
        if (roles.includes("admin")) {
            const lastSubjectShortcut = homeScreenShortCuts.querySelector(".home-screen__lastSubject")
            lastSubjectShortcut.classList.add("hidden")

            const notesShortcut = homeScreenShortCuts.querySelector(".home-screen__notes")
            notesShortcut.classList.add("hidden")

            const homeSubjects = document.querySelector(".home-screen__subjects")
            homeSubjects.classList.add("hidden")

            document.querySelector('.home-screen__departments').classList.remove("hidden")
        }
    }
}

export async function renderListHome(subjectList, currentPeriod, roles, userInfo) {
    const homescreenSubjectList = document.querySelector(".home-screen__subjectList")
    const homeDepartmentList = document.querySelector(".home-screen__departmentList")

    if (homescreenSubjectList) {
        showLoader()
        if (!roles.includes("admin")) {
            const subjectSummary = []

            for (let index = 0; index < subjectList.length; index++) {
                const subject = subjectList[index];
                const answers = await getAllAnswersBySubjectAndPeriod(subject.id, currentPeriod)
                const object = {
                    id: subject.id,
                    name: subject.name,
                    progress: 0
                }

                if (answers.length > 0) {
                    answers.sort(sortByQuestionIndex)

                    let totalAnswers = 12
                    let answeredQuestion = 0

                    if (answers[7] && answers[7].answerValue[0] === "No") {
                        totalAnswers--
                    }

                    if (answers[10] && answers[10].answerValue[0] === "No") {
                        totalAnswers--
                    }

                    answers.forEach(answer => {
                        if (answer.answerValue[0]) {
                            answeredQuestion++
                        }
                    })

                    const progress = Math.round((answeredQuestion / totalAnswers) * 100)
                    object.progress = progress
                }

                subjectSummary.push(object)
            }

            homescreenSubjectList.innerHTML = ``
            subjectSummary.forEach(subject => {
                const subjectThumbnail = document.createElement('a')
                subjectThumbnail.setAttribute('href', `#memosections?${subject.id}`)
                subjectThumbnail.className = "subject-thumbnail " + subject.id
                subjectThumbnail.innerHTML = `
            <section class="subject-thumbnail__info">
                <section class="subject-thumbnail__icon-title">
                    <img class="subject-thumbnail__icon" src="./images/subjectgenericicon.svg" alt="">
                    <h5 class="subject-thumbnail__title">${subject.name}</h5>
                </section>
                <p class="subject-thumbnail__percent">
                    ${subject.progress}%
                </p>
            </section>
            <section class="subject-thumbnail__progress">
                <p class="subject-thumbnail__subtitle">Memorando completado</p>
                <div class="subject-thumbnail__progressBar">
                    <div class="subject-thumbnail__currentBar" style="width: ${subject.progress}%">
                    </div>
                </div>
            </section>
            `
                homescreenSubjectList.appendChild(subjectThumbnail)
            });

            let sum = 0
            subjectSummary.forEach(s => {
                sum += s.progress
            })

            let allSubjectsProgress = Math.round((sum / (subjectSummary.length * 100)) * 100)

            const progressContainer = document.querySelector(".memo-thumbnail__progress")
            progressContainer.innerHTML = `
        <div class="memo-pie custom-pie"
            data-pie='{ "colorSlice": "#979DFF", "percent": ${allSubjectsProgress}, "colorCircle": "#EDF2FF", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#979DFF", "round": true, "stroke": 10 }'>
        </div>
            `
            const circle = new CircularProgressBar(`memo-pie`)
            circle.initial()

            if (roles.includes("boss") || roles.includes("principal") || roles.includes("leader")) {
                const roleShortcutSection = document.querySelector(".home-screen__roleShortcuts")
                roleShortcutSection.classList.remove("hidden")
                const roleShortcutsTitle = document.querySelector(".roleShortcutsTitle")
                const roleShortCutSectionList = document.querySelector(".home-screen__roleShortcutsList")

                roleShortCutSectionList.innerHTML = ``

                let roleItems = []
                let initialHref = ""

                if (roles.includes("boss")) {
                    roleShortcutsTitle.innerHTML = `Departamento de ${userInfo.bossDepartment}`
                    roleItems = await getDepartmentCareers(userInfo.bossDepartmentId)
                    initialHref = "#generalsubjects?"
                    roleItems.forEach(item => {
                        const roleElement = document.createElement("div")
                        roleElement.className = "roleShortcut-thumbnail"

                        roleElement.style.backgroundImage = "url('./images/rolethumbnailbackground.svg')"
                        roleElement.innerHTML = `
                        <section class="roleShortcut-thumbnail__abbreviation">
                            <h4 class="roleShortcut-thumbnail__title">${item.abbreviation}</h4>
                        </section>
                        <section class="roleShortcut-thumbnail__info">
                            <section class="roleShortcut-thumbnail__titles">
                                <h5 class="roleShortcut-thumbnail__subtitle">Cursos</h5>
                                <p class="roleShortcut-thumbnail__name">${item.name}</p>
                            </section>
                            <a class="small-button small-button--secondary" href="${initialHref}${item.id}">
                                <span>Ver</span>
                            </a>
                        </section>
                        `
                        roleShortCutSectionList.appendChild(roleElement)
                    })

                } else if (roles.includes("principal")) {
                    roleItems = await getCareerInfo(userInfo.principalCareerId)
                    roleShortcutsTitle.innerHTML = `Tu carrera`
                    const roleElement = document.createElement("div")
                    roleElement.className = "roleShortcut-thumbnail"
                    initialHref = "#generalsubjects?"
                    roleElement.style.backgroundImage = "url('./images/rolethumbnailbackground.svg')"
                    roleElement.innerHTML = `
                        <section class="roleShortcut-thumbnail__abbreviation">
                            <h4 class="roleShortcut-thumbnail__title">${roleItems.abbreviation}</h4>
                        </section>
                        <section class="roleShortcut-thumbnail__info">
                            <section class="roleShortcut-thumbnail__titles">
                                <h5 class="roleShortcut-thumbnail__subtitle">Cursos</h5>
                                <p class="roleShortcut-thumbnail__name">${roleItems.name}</p>
                            </section>
                            <a class="small-button small-button--secondary" href="${initialHref}${roleItems.id}">
                                <span>Ver</span>
                            </a>
                        </section>`
                    roleShortCutSectionList.appendChild(roleElement)
                } else if (roles.includes("leader")) {
                    roleItems = await getGroupInfo(userInfo.leaderGroupId)
                    roleShortcutsTitle.innerHTML = `Tu bloque`

                    const roleElement = document.createElement("div")
                    roleElement.className = "roleShortcut-thumbnail"
                    initialHref = "#mygroup?"
                    roleElement.style.backgroundImage = "url('./images/rolethumbnailbackground.svg')"

                    roleElement.innerHTML = `
                        <section class="roleShortcut-thumbnail__abbreviation">
                            <h4 class="roleShortcut-thumbnail__title">${roleItems.abbreviation}</h4>
                        </section>
                        <section class="roleShortcut-thumbnail__info">
                            <section class="roleShortcut-thumbnail__titles">
                                <h5 class="roleShortcut-thumbnail__subtitle">Bloque</h5>
                                <p class="roleShortcut-thumbnail__name">${roleItems.name}</p>
                            </section>
                            <a class="small-button small-button--secondary" href="${initialHref}${roleItems.id}">
                                <span>Ver</span>
                            </a>
                        </section>`
                    roleShortCutSectionList.appendChild(roleElement)
                }
            }
        } else if (roles.includes("admin")) {
            const departments = await getDepartments()
            const departmentProgressList = []

            for (let index = 0; index < departments.length; index++) {
                const department = departments[index];
                const subjects = await getSubjectsByView(`departmentId`, department.id)
                const teachersIds = []

                subjects.forEach(subject => {
                    const q = teachersIds.find(id => {
                        return subject.teacherId === id
                    })
                    if (!q) {
                        teachersIds.push(subject.teacherId)
                    }
                })

                const teachers = []
                for (let index = 0; index < teachersIds.length; index++) {
                    const id = teachersIds[index];
                    const q = await getTeacherById(id)
                    teachers.push(q)
                }

                let departmentProgress = 0
                let completeCounter = 0
                let incompleteCounter = 0

                teachers.forEach(t => {
                    t.accomplishment >= 100 ? completeCounter++ : incompleteCounter++
                })

                departmentProgress = Math.round((completeCounter / (completeCounter + incompleteCounter)) * 100)

                const object = {
                    name: department.name,
                    id: department.id,
                    progress: departmentProgress
                }
                console.log(object)
                departmentProgressList.push(object)
            }

            homeDepartmentList.innerHTML = ``

            departmentProgressList.forEach(department => {
                const departmentThumbnail = document.createElement("div")
                departmentThumbnail.className = "deparment-thumbnail"
                departmentThumbnail.innerHTML = `
                    <section class="deparment-thumbnail__info">
                        <section class="deparment-thumbnail__icon-title">
                            <h5 class="deparment-thumbnail__title">${department.name}</h5>
                        </section>
                        <p class="deparment-thumbnail__percent">
                        ${department.progress}%
                        </p>
                    </section>
                    <section class="deparment-thumbnail__progress">
                        <p class="deparment-thumbnail__subtitle">Memorando completado</p>
                        <div class="deparment-thumbnail__progressBar">
                            <div class="deparment-thumbnail__currentBar" style="width: ${department.progress}%">
                            </div>
                        </div>
                    </section>
                    <section class="deparment-thumbnail__controls">
                        <a href="#accomplishmentlist?department_${department.id}" class="small-button small-button--secondary">
                            <span>Ver</span>
                        </a>
                    </section>
                `
                homeDepartmentList.appendChild(departmentThumbnail)
            })


            let sum = 0
            departmentProgressList.forEach(d => {
                sum += d.progress
            })

            let allDepartmentProgress = Math.round((sum / (departmentProgressList.length * 100)) * 100)

            const progressContainer = document.querySelector(".memo-thumbnail__progress")
            progressContainer.innerHTML = `
        <div class="memo-pie custom-pie"
            data-pie='{ "colorSlice": "#979DFF", "percent": ${allDepartmentProgress}, "colorCircle": "#EDF2FF", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#979DFF", "round": true, "stroke": 10 }'>
        </div>
        `
            const circle = new CircularProgressBar(`memo-pie`)
            circle.initial()
        }
        hideLoader()
    }
}

