import { getAllAnswersBySubjectAndPeriod } from "./modules/firestore.js";
import { sortByQuestionIndex } from "./utils/sort.js";

export async function renderSubjectListHome(subjectList, currentPeriod) {
    const homescreenSubjectList = document.querySelector(".home-screen__subjectList")

    if (homescreenSubjectList) {
        const subjectSummary = []

        for (let index = 0; index < subjectList.length; index++) {
            const subject = subjectList[index];
            const answers = await getAllAnswersBySubjectAndPeriod(subject.id, currentPeriod)
            const object = {
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
            console.log(subjectSummary)
        }

        homescreenSubjectList.innerHTML = ``
        subjectSummary.forEach(subject => {
            const subjectThumbnail = document.createElement('div')
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
    }
}

