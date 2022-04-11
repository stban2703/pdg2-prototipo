import { getMemoQuestion } from "./modules/firestore.js"

export async function renderMemoQuestion() {
    const memoQuestionScreen = document.querySelector(".memoquestion-screen")

    if (memoQuestionScreen && window.location.href.includes("#memoquestion")) {
        const urlQuery = window.location.hash.split("?")[1]
        const urlQueryParts = urlQuery.split("_")
        const period = urlQueryParts[0]
        const subjectId = urlQueryParts[1]
        const questionId = urlQueryParts[2]

        const questionInfo = await getMemoQuestion(period, subjectId, questionId)
        console.log(questionInfo)

        const memoQuestionSectionTitle = memoQuestionScreen.querySelector(".memoquestion-screen__title")
        const memoQuestionSubsectionTitle = memoQuestionScreen.querySelector(".memoquestion-form__title")
        memoQuestionSectionTitle.innerHTML = questionInfo.section
        memoQuestionSubsectionTitle.innerHTML = questionInfo.subsection
    }
}