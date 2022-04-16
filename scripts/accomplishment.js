import { getAllAnswersBySubjectsAndPeriod, getGroupInfo, getGroupSubjects, getTeacherById, getUserSubjects, updateTeacherAccomplishment } from "./modules/firestore.js"
import { hideLoader, showLoader } from "./utils/loader.js"


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
        });

        const completeList = accomplishmentScreenContentList.querySelector(".accomplishment-screen__columnList--complete")
        const incompleteList = accomplishmentScreenContentList.querySelector(".accomplishment-screen__columnList--incomplete")

        completeList.innerHTML = ``
        incompleteList.innerHTML = ``

        switch (currentRole) {
            case "leader":
                const groupInfo = await getGroupInfo(userInfo.leaderGroupId)
                const groupSubjects = await getGroupSubjects(viewId)
                let completeCounter = 0
                let incompleteCounter = 0

                const teacherList = []
                for (let index = 0; index < groupInfo.teachers.length; index++) {
                    const id = groupInfo.teachers[index];
                    const teacher = await getTeacherById(id)
                    teacherList.push(teacher)
                    if(teacher.accomplishment >= 100) {
                        completeCounter++
                    } else {
                        incompleteCounter++
                    }
                }

                teacherList.forEach(teacher => {
                    let teacherSubjectsNames = ''
                    teacher.subjects.forEach(id => {
                        const q = groupSubjects.find(subject => {
                            return subject.id === id
                        })
                        teacherSubjectsNames += `${q.name}<br>`
                    })
                    const teacherItem = document.createElement('div')
                    teacherItem.className = `accomplishment-teacher${teacher.accomplishment === 100 ? ' accomplishment-teacher--secondary' : ''}`
                    teacherItem.innerHTML = `
                    <img src="./images/accomplishmentteacher.svg" alt="">
                    <section class="accomplishment-teacher__info">
                        <h5 class="accomplishment-teacher__name">${teacher.name.split(" ")[0]} ${teacher.lastname.split(" ")[0]}</h5>
                        <p class="accomplishment-teacher__subject">${teacherSubjectsNames}</p>
                    </section>
                    `
                    if(teacher.accomplishment === 100) {
                        completeList.appendChild(teacherItem)
                    } else {
                        incompleteList.appendChild(teacherItem)
                    }
                })

                const completeNumberContainer = document.querySelector(".accomplishment-counter__number--complete")
                const incompleteNumberContainer = document.querySelector(".accomplishment-counter__number--incomplete")
                completeNumberContainer.innerHTML = `${completeCounter}/${teacherList.length}`
                incompleteNumberContainer.innerHTML = `${incompleteCounter}`

                break;
        }

        hideLoader()
    }
}

export async function submitUserAccomplishment(userSubjects, currentPeriod) {
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

        let ls = window.localStorage;
        let localUser = JSON.parse(ls.getItem('currentuser'))
        await updateTeacherAccomplishment(localUser.id, totalPercent)
    }
}