import { submitTestMemoQuestion } from "./modules/firestore.js"
import { showLoader } from "./utils/loader.js"

export function submitQuestions() {
    const testMemoForm = document.querySelector(".testmemoform")

    if (testMemoForm) {
        testMemoForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const index = testMemoForm.index.value
            const section = testMemoForm.section.value
            const sectionIndex = testMemoForm.sectionIndex.value
            const subsection = testMemoForm.subsection.value
            const subsectionIndex = testMemoForm.subsectionIndex.value
            const question = testMemoForm.question.value
            const type = testMemoForm.type.value
            const justification = testMemoForm.justification.value
            const options = testMemoForm.options.value.split(",")
            const scalemin = testMemoForm.scalemin.value
            const scalemax = testMemoForm.scalemax.value
            const scalemintag = testMemoForm.scalemintag.value
            const scalemaxtag = testMemoForm.scalemaxtag.value
            const matrixrows = testMemoForm.matrixrows.value.split(",")
            const matrixcolumnmin = testMemoForm.matrixcolumnmin.value
            const matrixcolumnmax = testMemoForm.matrixcolumnmax.value
            const matrixcolumnmintag = testMemoForm.matrixcolumnmintag.value
            const matrixcolumnmaxtag = testMemoForm.matrixcolumnmaxtag.value

            const questionObject = {
                index: index,
                section: section,
                sectionIndex: sectionIndex,
                subsection: subsection,
                subsectionIndex: subsectionIndex,
                question: question,
                type: type,
                justification: justification,
                options: options,
                scalemin: scalemin,
                scalemax: scalemax,
                scalemintag: scalemintag,
                scalemaxtag: scalemaxtag,
                matrixrows: matrixrows,
                matrixcolumnmin: matrixcolumnmin,
                matrixcolumnmax: matrixcolumnmax,
                matrixcolumnmintag: matrixcolumnmintag,
                matrixcolumnmaxtag: matrixcolumnmaxtag
            }

            showLoader()
            submitTestMemoQuestion(questionObject)
        })
    }
}