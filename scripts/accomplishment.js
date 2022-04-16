import { getAllAnswersBySubjectsAndPeriod, getGroupInfo, getTeacherById, updateTeacherAccomplishment } from "./modules/firestore.js"
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

        switch (currentRole) {
            case "leader":
                const groupInfo = await getGroupInfo(userInfo.leaderGroupId)

                const teacherList = []
                for (let index = 0; index < groupInfo.teachers.length; index++) {
                    const id = groupInfo.teachers[index];
                    const teacher = await getTeacherById(id)
                    teacherList.push(teacher)
                }
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