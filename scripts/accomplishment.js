import { getAllAnswersBySubjectAndPeriod, getDepartments, getSubjectsByView, getTeacherById, updateTeacherAccomplishment } from "./modules/firestore.js"
import { hideLoader, showLoader } from "./utils/loader.js"
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js"


export async function getInititalAccomplishmentDepartmentList() {
    const accomplishmentScreenDeparmenttList = document.querySelector(".accomplishment-screen__departmentList")
    if (accomplishmentScreenDeparmenttList && window.location.href.includes("#accomplishmentdashboard")) {
        showLoader()
        const departments = await getDepartments()
        const departmentAccomplishmnetList = []
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

            let totalCounter = completeCounter + incompleteCounter
            if (totalCounter > 0) {
                departmentProgress = Math.round((completeCounter / totalCounter) * 100)
            } else {
                departmentProgress = 0
            }

            const object = {
                name: department.name,
                id: department.id,
                progress: departmentProgress
            }
            departmentAccomplishmnetList.push(object)
        }
        renderAccomplishmentDepartmentList(departmentAccomplishmnetList)
        hideLoader()
    }
}

function renderAccomplishmentDepartmentList(list) {
    const accomplishmentScreenDeparmenttList = document.querySelector(".accomplishment-screen__departmentList")
    accomplishmentScreenDeparmenttList.innerHTML = ``

    let allDepartmentsProgress = 0
    list.forEach((department, index) => {
        allDepartmentsProgress += department.progress
        const departmentItem = document.createElement('div')
        departmentItem.className = "accomplishment-department"
        departmentItem.innerHTML = `
        <section class="accomplishment-department__info">
            <h5 class="accomplishment-department__title">Departamento de <span style="font-weight: 600;">${department.name}</span></h5>
            <div class="accomplishment-department__pieContainer">
                <div class="deparment-pie-${index} custom-pie"
                        data-pie='{ "colorSlice": "#979DFF", "percent": ${department.progress}, "colorCircle": "#EDF2FF", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#979DFF", "round": true, "stroke": 10 }'>
                </div>
            </div>
        </section>
        <a class="accomplishment-department__button small-button small-button--secondary"
                href="#accomplishmentlist?department_${department.id}">
                <span>Seleccionar</span>
        </a>
        `
        accomplishmentScreenDeparmenttList.appendChild(departmentItem)

        const circle = new CircularProgressBar(`deparment-pie-${index}`)
        circle.initial()
    })


    allDepartmentsProgress = Math.round((allDepartmentsProgress / (list.length * 100)) * 100)
    const generalItem = document.createElement('div')
    generalItem.className = "accomplishment-department"
    generalItem.innerHTML = `
        <section class="accomplishment-department__info">
            <h5 class="accomplishment-department__title">Cumplimiento de la <span style="font-weight: 600;">Facultad de Ingeniería</span></h5>
            <div class="accomplishment-department__pieContainer">
                <div class="general-pie custom-pie"
                        data-pie='{ "colorSlice": "#FDB572", "percent": ${allDepartmentsProgress}, "colorCircle": "#FFF2E5", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#FDB572", "round": true, "stroke": 10 }'>
                </div>
            </div>
        </section>
        `
    accomplishmentScreenDeparmenttList.prepend(generalItem)
    const circle = new CircularProgressBar(`general-pie`)
    circle.initial()
}


export async function getInitialAccomplishmentList(userInfo) {
    const accomplishmentScreenContentList = document.querySelector(".accomplishment-screen__content--list")

    if (accomplishmentScreenContentList && window.location.href.includes("#accomplishmentlist")) {
        const view = window.location.hash.split("?")[1].split("_")[0]
        const viewId = window.location.hash.split("?")[1].split("_")[1]

        showLoader()
        const sectionTitle = document.querySelector(".section-banner__title")

        let currentRole = ""
        userInfo.role.forEach(role => {
            if (role === "leader") {
                sectionTitle.innerHTML = `Cumplimiento de tu bloque<br>de ${userInfo.leaderGroup}`
                currentRole = role
            }

            if (role === "principal") {
                sectionTitle.innerHTML = `Cumplimiento de<br> ${userInfo.principalCareer}`
                currentRole = role
            }

            if (role === "boss") {
                sectionTitle.innerHTML = `Cumplimiento del departamento<br>de ${userInfo.bossDepartment}`
                currentRole = role
            }

            if (role === "admin") {
                sectionTitle.innerHTML = `Cumplimiento del departamento de tu facultad`
                currentRole = role
            }
        });

        // Accomplishment counter
        let completeCounter = 0
        let incompleteCounter = 0
        const completeNumberContainer = document.querySelector(".accomplishment-counter__number--complete")
        const incompleteNumberContainer = document.querySelector(".accomplishment-counter__number--incomplete")

        // Get list
        const subjects = await getSubjectsByView(`${view}Id`, viewId)
        const teachersIds = []

        if (currentRole === "admin") {
            document.querySelector(".accomplishment-screen__currentDepartmentTitle").innerHTML = `Departamento: ${subjects[0].department}`
        }

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

        const accomplishmentList = []
        teachers.forEach(t => {
            t.accomplishment >= 100 ? completeCounter++ : incompleteCounter++

            let object = {
                name: `${t.name.split(" ")[0]} ${t.lastname.split(" ")[0]}`,
                accomplishment: t.accomplishment,
                subjectsNames: [],
                career: "",
                groups: [],
            }

            console.log(t)

            subjects.forEach(subject => {
                const q = t.subjects.find(ts => {
                    return ts === subject.id
                })
                if (q) {
                    object.subjectsNames.push(subject.name)
                    object.career = subject.career
                    const gQ = object.groups.find(g => {
                        return g === subject.group
                    })
                    if (!gQ) {
                        object.groups.push(subject.group)
                    }
                }
            })
            accomplishmentList.push(object)
        })

        completeNumberContainer.innerHTML = `${completeCounter}/${teachers.length}`
        incompleteNumberContainer.innerHTML = `${incompleteCounter}`
        renderAccomplishmentTeachers(accomplishmentList)
        renderAccomplishmentFilters(accomplishmentList, subjects, currentRole)
        hideLoader()
    }
}

function renderAccomplishmentFilters(accomplishmentList, subjectList, role) {
    const accomplishmentListControls = document.querySelector(".memoselectsubject-screen__controls--accomplishmentControls")
    const careersList = []
    const groupsList = []

    subjectList.forEach(subject => {
        const cQ = careersList.find(career => {
            return career === subject.career
        })
        if (!cQ) {
            careersList.push(subject.career)
        }
        const gQ = groupsList.find(group => {
            return group === subject.group
        })
        if (!gQ) {
            groupsList.push(subject.group)
        }
    })

    careersList.forEach(career => {
        const option = document.createElement('option')
        option.value = career
        option.innerHTML = career
        accomplishmentListControls.career.appendChild(option)
    })

    groupsList.forEach(group => {
        const option = document.createElement('option')
        option.value = group
        option.innerHTML = group
        accomplishmentListControls.group.appendChild(option)
    })

    accomplishmentListControls.alphabetic.classList.remove("hidden")
    switch (role) {
        case "boss":
            accomplishmentListControls.career.classList.remove("hidden")
            accomplishmentListControls.group.classList.remove("hidden")
            break;
        case "admin":
            accomplishmentListControls.career.classList.remove("hidden")
            accomplishmentListControls.group.classList.remove("hidden")
            break;
        case "principal":
            accomplishmentListControls.group.classList.remove("hidden")
            break;
    }

    accomplishmentListControls.addEventListener('input', () => {
        sortFilterAccomplishmentTeachers(accomplishmentList, accomplishmentListControls.alphabetic, accomplishmentListControls.career, accomplishmentListControls.group)
    })
}

function sortFilterAccomplishmentTeachers(accomplishmentList, alphabeticSort, careerFilter, groupFilter) {
    let filterCopy = [...accomplishmentList]

    if (alphabeticSort.value.length > 0) {
        if (alphabeticSort.value == "ascending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticAscending)
        } else if (alphabeticSort.value = "descending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticDescending)
        }
    }

    if (careerFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.career == careerFilter.value) {
                return true
            }
        })
    }

    if (groupFilter.value.length > 0) {
        const targetGroup = groupFilter.value
        filterCopy = [...filterCopy].filter(elem => {
            return elem.groups.includes(targetGroup)
        })
    }
    renderAccomplishmentTeachers(filterCopy)
}

function renderAccomplishmentTeachers(list) {
    const completeList = document.querySelector(".accomplishment-screen__columnList--complete")
    const incompleteList = document.querySelector(".accomplishment-screen__columnList--incomplete")
    completeList.innerHTML = ``
    incompleteList.innerHTML = ``

    list.forEach(teacher => {
        const teacherItem = document.createElement('div')
        teacherItem.className = `accomplishment-teacher${teacher.accomplishment === 100 ? ' accomplishment-teacher--secondary' : ''}`
        teacherItem.innerHTML = `
        <img src="./images/accomplishmentteacher.svg" alt="">
        <section class="accomplishment-teacher__info">
            <h5 class="accomplishment-teacher__name">${teacher.name}</h5>
            <p class="accomplishment-teacher__subject">${teacher.subjectsNames.join("<br>")}</p>
        </section>
        `
        if (teacher.accomplishment === 100) {
            completeList.appendChild(teacherItem)
        } else {
            incompleteList.appendChild(teacherItem)
        }
    })
}

export async function submitUserAccomplishment(userSubjects, currentPeriod) {
    if (userSubjects.length > 0) {
        let allQuestionsAnswers = []
        for (let index = 0; index < userSubjects.length; index++) {
            const subject = userSubjects[index];
            const subjectAnswers = await getAllAnswersBySubjectAndPeriod(subject.id, currentPeriod)
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

        let ls = window.localStorage;
        let localUser = JSON.parse(ls.getItem('currentuser'))
        await updateTeacherAccomplishment(localUser.id, totalPercent)
    }
}