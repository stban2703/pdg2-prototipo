import { getAllAnswersBySubjectAndPeriod, getDepartments } from "./modules/firestore.js";
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
        }
    }
}

export async function renderListHome(subjectList, currentPeriod, roles) {
    const homescreenSubjectList = document.querySelector(".home-screen__subjectList")

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
            console.log(allSubjectsProgress)

            const progressContainer = document.querySelector(".memo-thumbnail__progress")
            progressContainer.innerHTML = `
        <div class="memo-pie custom-pie"
            data-pie='{ "colorSlice": "#979DFF", "percent": ${allSubjectsProgress}, "colorCircle": "#EDF2FF", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#979DFF", "round": true, "stroke": 10 }'>
        </div>
        `
            const circle = new CircularProgressBar(`memo-pie`)
            circle.initial()
        }
        else if (roles.includes("admin")) {
            const departments = await getDepartments()
            console.log(departments)
        }
        hideLoader()
    }
}

