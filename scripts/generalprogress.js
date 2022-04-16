import { createImproveActionComment, getAllAnswersByPeriod, getAllAnswersByQuestion, getAllAnswersByQuestionAndPeriod, getAllAnswersByViewTypeAndPeriod, getAllAnswersByViewTypeAndQuestion, getCareerInfo, getCareerSubjects, getDepartmentCareers, getDepartmentInfo, getDepartments, getHistoryImproveActions, getImproveActionComment, getImproveActions, getSubcjectInfo } from "./modules/firestore.js";
import { renderBarChart, renderLineChart, renderPieChart } from "./myprogress.js";
import { hideLoader, showLoader } from "./utils/loader.js";
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js";

// Select view general
export async function getInitialGeneralSelect(userInfo) {
    const generalselectScreen = document.querySelector(".generalselect-screen--select")

    if (generalselectScreen && window.location.href.includes("#generalselect")) {
        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        const generalselectScreenList = generalselectScreen.querySelector(".generalselect-screen__list")

        let currentRole = ""

        userInfo.role.forEach(role => {
            if (role === "principal" || role === "boss" || role === "admin") {
                currentRole = role
            }
        });

        switch (currentRole) {
            case "principal":
                const careerInfo = await getCareerInfo(userInfo.principalCareerId)
                generalSelectSectionTitle.innerHTML = `Progreso general<br>${careerInfo.name}`

                generalselectScreenList.innerHTML = `
                
                <div class="visualization-item">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización general</h5>
                    <a class="small-button small-button--secondary" href="#generalall?career_${careerInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos a <span style="font-weight: 600;">nivel global</span> sobre los <span style="font-weight: 600;">docentes</span> del programa <span style="font-weight: 600;">${careerInfo.name}</span>.
                    </p>
                    </section>
                </div>
                <div class="visualization-item visualization-item--pink">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización específica</h5>
                    <a class="small-button small-button--secondary" href="#generalsubjects?${careerInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos de forma <span style="font-weight: 600;">detallada</span> por cada curso del programa <span style="font-weight: 600;">${careerInfo.name}</span>.
                    </p>
                    </section>
                </div>

                `
                break;

            case "boss":
                const departmentInfo = await getDepartmentInfo(userInfo.bossDepartmentId)
                generalSelectSectionTitle.innerHTML = `Progreso general<br>Departamento de ${departmentInfo.name}`

                generalselectScreenList.innerHTML = `
                
                <div class="visualization-item">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización general</h5>
                    <a class="small-button small-button--secondary" href="#generalall?department_${departmentInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos a <span style="font-weight: 600;">nivel global</span> sobre los <span style="font-weight: 600;">docentes</span> del <span style="font-weight: 600;">Departamento de ${departmentInfo.name}</span>.
                    </p>
                    </section>
                </div>
                <div class="visualization-item visualization-item--pink">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización específica</h5>
                    <a class="small-button small-button--secondary" href="#generalcareer?${departmentInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos de forma <span style="font-weight: 600;">detallada</span> por cada curso del <span style="font-weight: 600;">Departamento de ${departmentInfo.name}</span>.
                    </p>
                    </section>
                </div>

                `
                break;

            case "admin":
                generalSelectSectionTitle.innerHTML = `Progreso general<br>Facultad de Ingeniería`

                generalselectScreenList.innerHTML = `
                
                <div class="visualization-item">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización general de la facultad</h5>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos a <span style="font-weight: 600;">nivel global</span> sobre los <span style="font-weight: 600;">docentes</span> de la <span style="font-weight: 600;">Facultad de ingeniería</span>.
                    </p>
                    </section>
                    <a class="small-button small-button--secondary" href="#generalall?faculty_general">
                        <span>Ver</span>
                    </a>
                </div>
                <div class="visualization-item visualization-item--blue">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización general por departamentos</h5>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos de forma <span style="font-weight: 600;">general</span> por cada <span style="font-weight: 600;">departamento</span> perteneciente a la <span style="font-weight: 600;">Facultad de Ingeniería</span>.
                    </p>
                    </section>
                    <a class="small-button small-button--secondary" href="#generaldepartments?general">
                        <span>Ver</span>
                    </a>
                </div>
                <div class="visualization-item visualization-item--pink">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización específica por curso</h5>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos de forma <span style="font-weight: 600;">detallada</span> por cada <span style="font-weight: 600;">curso</span> perteneciente a la <span style="font-weight: 600;">Facultad de Ingeniería</span>.
                    </p>
                    </section>
                    <a class="small-button small-button--secondary" href="#generaldepartments">
                        <span>Ver</span>
                    </a>
                </div>

                `
                break;
        }
    }
}

// Faculty general
export async function getInitialGeneralDepartments() {
    const generalselectScreenDepartments = document.querySelector(".generalselect-screen--departments")
    if (generalselectScreenDepartments && window.location.href.includes("#generaldepartments")) {
        showLoader()
        const departments = await getDepartments()
        const urlParts = window.location.hash.split("?")

        const generalDepartmentListContainer = document.querySelector(".generalselect-screen__list--subjects")
        generalDepartmentListContainer.innerHTML = ``


        departments.forEach(department => {
            const href = urlParts[1] ? `#generalall?department_${department.id}`: `#generalcareer?${department.id}`
            const departmentItem = document.createElement("div")
            departmentItem.className = "memo-subject"
            departmentItem.innerHTML = `
            <h5 class="memo-subject__title">${department.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="${href}">
                <span>Ver</span>
            </a>
            `
            generalDepartmentListContainer.appendChild(departmentItem)
        })
    }
}


// Career general
export async function getInitialGeneralCareer() {
    const generalselectScreenCareer = document.querySelector(".generalselect-screen--careers")
    if (generalselectScreenCareer && window.location.href.includes("#generalcareer")) {
        showLoader()
        const departmentId = window.location.href.split("?")[1]
        const departmentInfo = await getDepartmentInfo(departmentId)
        const careers = await getDepartmentCareers(departmentId)
        hideLoader()

        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        generalSelectSectionTitle.innerHTML = `Progreso general<br>Departamento de ${departmentInfo.name}`

        const generalCareerListContainer = document.querySelector(".generalselect-screen__list--subjects")
        generalCareerListContainer.innerHTML = ``

        careers.forEach(career => {
            const careerItem = document.createElement("div")
            careerItem.className = "memo-subject"
            careerItem.innerHTML = `
            <h5 class="memo-subject__title">${career.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#generalsubjects?${career.id}">
                <span>Ver</span>
            </a>
            `
            generalCareerListContainer.appendChild(careerItem)
        })
    }
}

// Subject general
export async function getInitialGeneralSubjets() {
    const generalselectScreenSubjects = document.querySelector(".generalselect-screen--subjects")
    if (generalselectScreenSubjects && window.location.href.includes("#generalsubjects")) {
        showLoader()
        const careerId = window.location.href.split("?")[1]
        const careerInfo = await getCareerInfo(careerId)
        const subjects = await getCareerSubjects(careerId)
        hideLoader()

        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        generalSelectSectionTitle.innerHTML = `Progreso general<br>${careerInfo.name}`

        const generalSelectSectionDescription = document.querySelector(".generalselect-screen__description")
        generalSelectSectionDescription.innerHTML = `Selecciona el <span style="font-weight: 600;">curso de ${careerInfo.name}</span> que deseas observar el progreso`

        const subjectsForm = generalselectScreenSubjects.querySelector(".memoselectsubject-screen__controls")
        careerInfo.groups.forEach(group => {
            const option = document.createElement('option')
            option.value = group
            option.innerHTML = group
            subjectsForm.group.appendChild(option)
        })

        const copy = [...subjects].sort(sortByAlphabeticAscending)
        renderGeneralSubjects(copy)
        onSortFilterGeneralSubjectListener(subjects)
    }
}

function onSortFilterGeneralSubjectListener(subjects) {
    const generalSubjectsSettingsForm = document.querySelector(".memoselectsubject-screen__controls--general")

    if (window.location.href.includes("#generalsubjects") && generalSubjectsSettingsForm) {
        const subjectsSortSelect = generalSubjectsSettingsForm.alphabetic
        const subjectsFilterSelect = generalSubjectsSettingsForm.group

        generalSubjectsSettingsForm.addEventListener('input', () => {
            sortFilterGeneralSubjects(subjects, subjectsSortSelect, subjectsFilterSelect)
        })
    }
}

function sortFilterGeneralSubjects(subjects, subjectSort, groupFilter) {
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
    renderGeneralSubjects(filterCopy)
}

function renderGeneralSubjects(list) {
    const generalSubjectListContainer = document.querySelector(".generalselect-screen__list--subjects")
    generalSubjectListContainer.innerHTML = ``

    list.forEach(subject => {
        const subjectItem = document.createElement("div")
        subjectItem.className = "memo-subject"
        subjectItem.innerHTML = `
            <h5 class="memo-subject__title">${subject.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#generalspecific?${subject.id}">
                <span>Ver</span>
            </a>
            `
        generalSubjectListContainer.appendChild(subjectItem)
    })
}

// Specific general
export async function renderImproveActionsForSpecificGeneral(period, userInfo) {

    const generalImproveActionsContainer = document.querySelector('.generalImproveActionsContainer')

    if (generalImproveActionsContainer && window.location.href.includes("#generalimproveactions")) {
        const subjectTitle = document.querySelector('.progresssubject-screen__info--subjectName')
        const periodTitle = document.querySelector('.progresssubject-screen__info--subjectPeriod')

        const subjectId = window.location.hash.split("?")[1]
        const subjectInfo = await getSubcjectInfo(subjectId)

        subjectTitle.innerHTML = subjectInfo.name
        periodTitle.innerHTML = period

        const improveActions = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subjectId)
        if (improveActions.length > 0) {
            if (improveActions[0].answerValue.length > 0) {
                const improveActionsContainer = document.querySelector(".improve-actions__list")
                const emptyContainer = document.querySelector(".improve-actions__empty")

                improveActionsContainer.innerHTML = ``
                improveActionsContainer.classList.remove("hidden")
                emptyContainer.classList.add("hidden")

                const improveActionsList = improveActions[0].answerValue
                improveActionsList.forEach((action, index) => {
                    const actionItem = document.createElement('tr')
                    actionItem.className = "improve-action-item"
                    actionItem.innerHTML = `
                        <td>
                            <div class="improve-action-item__number">
                                <span>${index + 1}</span>
                            </div>
                        </td>
                        <td class="improve-action-item__title">
                            <h5>${action.name}</h5>
                        </td>
                        <td class="improve-action-item__description">
                            <p>${action.description}</p>
                        </td>
                    `
                    improveActionsContainer.appendChild(actionItem)
                })
            }
        }

        const openAddCommentButton = document.querySelector(".openAddCommentButton")
        const addCommentForm = document.querySelector(".addCommentForm")

        const commentSection = document.querySelector(".improve-actions__comments")
        userInfo.role.forEach(role => {
            if(role === "principal") {
                commentSection.classList.remove("hidden")
            }
        })

        openAddCommentButton.addEventListener('click', () => {
            addCommentForm.classList.remove("hidden")
            openAddCommentButton.classList.add("hidden")
        })


        const comment = await getImproveActionComment(subjectId, period)
        if (comment.length > 0) {
            openAddCommentButton.classList.add("hidden")
            const commentContainer = document.querySelector(".improve-actions__commentContainer")
            commentContainer.classList.remove("hidden")
            commentContainer.innerHTML = `
            <p>${comment[0].comment}</p>
            `
        }
    }
}

export async function onSubmitImproveActionComment(userInfo, period) {
    const addCommentForm = document.querySelector(".addCommentForm")

    if (addCommentForm && window.location.href.includes("#generalimproveactions")) {
        addCommentForm.addEventListener("submit", (event) => {
            event.preventDefault()
            const subjectId = window.location.hash.split("?")[1]
            showLoader()
            createImproveActionComment(subjectId, period, userInfo, addCommentForm.comment.value)
        })
    }
}

export function onFilterGeneralAllByPeriod() {
    const generalAllFilterForm = document.querySelector(".memoselectsubject-screen__controls--generalAll")
    if (generalAllFilterForm && window.location.href.includes("#generalall")) {
        generalAllFilterForm.period.addEventListener('input', (event) => {
            event.preventDefault()
            renderGeneralAllCharts(event.target.value)
        })
    }
}

// All general
export function getInitialGeneralAll(currentPeriod) {
    const generalAllScreen = document.querySelector(".progresssubject-screen--generalAll")
    if (generalAllScreen && window.location.href.includes("generalall")) {
        renderGeneralAllCharts(currentPeriod)
    }
}

async function renderGeneralAllCharts(currentPeriod) {
    const view = window.location.hash.split('?')[1].split('_')[0]
    const viewId = window.location.hash.split('?')[1].split('_')[1]

    showLoader()
    let viewInfo = {}
    if (view === 'career') {
        viewInfo = await getCareerInfo(viewId)
    } else if (view === 'department') {
        viewInfo = await getDepartmentInfo(viewId)
    }

    let initialTitle = ""
    switch (view) {
        case 'department':
            initialTitle = "Departamento de "
            break;
    }
    document.querySelector(".section-banner__title").innerHTML = `Progreso general<br>${initialTitle}${viewInfo.name}`
    document.querySelector(".progresssubject-screen__info--subjectPeriod").innerHTML = currentPeriod

    let allAnswers = []
    if (view === "faculty") {
        allAnswers = await getAllAnswersByPeriod(currentPeriod)
    } else {
        allAnswers = await getAllAnswersByViewTypeAndPeriod(view, viewId, currentPeriod)
    }
    const answersArray = []

    // All periods question
    let allThirdQuestionAnswers = []
    let allImproveActionsAnswers = []
    if (view === "faculty") {
        allThirdQuestionAnswers = await getAllAnswersByQuestion(3)
        allImproveActionsAnswers = await getAllAnswersByQuestion(10)
    } else {
        allThirdQuestionAnswers = await getAllAnswersByViewTypeAndQuestion(view, viewId, 3)
        allImproveActionsAnswers = await getAllAnswersByViewTypeAndQuestion(view, viewId, 10)
    }
    const allHistoryImproveActionAnswers = []

    // Improve actions chart
    for (let index = 0; index < allImproveActionsAnswers.length; index++) {
        const improveActionAnswer = allImproveActionsAnswers[index];
        const history = await getHistoryImproveActions(improveActionAnswer.subjectId)
        allHistoryImproveActionAnswers.push(history)
    }

    const improveActionQuestionLabels = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1']
    const improveActionsDataSet = []

    improveActionQuestionLabels.forEach((label, index) => {
        const answerList = allImproveActionsAnswers.filter(answer => {
            return answer.period === label
        })

        let checkedByPeriod = 0
        let totalByPeriod = answerList.length

        allHistoryImproveActionAnswers.forEach(h => {
            const checkedList = h.filter(action => {
                return action.period === label
            })

            if (checkedList.length > 0) {
                checkedByPeriod += checkedList.length
                totalByPeriod += checkedList.length
            }
        })

        let percent = 0
        if (totalByPeriod > 0) {
            percent = Math.round((checkedByPeriod / totalByPeriod) * 100)
        }

        improveActionsDataSet[index] = percent
    })

    renderBarChart(improveActionQuestionLabels, improveActionsDataSet, 100, 'Semestre', 'Acciones de mejora', 'improveActionChart', 'Porcentaje de acciones implementadas', 'chartImproveActionQuestionParent')


    const totalsQuestions = 12

    for (let index = 0; index < totalsQuestions; index++) {
        answersArray[index] = allAnswers.filter(answer => {
            return answer.questionIndex === index + 1
        })

    }

    // First question
    const firstQuestionLabels = ['Nunca', 'Al final del semestre', 'Cada corte', 'Mensualmente', 'Semanalmente', 'Cada clase']
    const firtQuestionAllDataSet = []

    firstQuestionLabels.forEach((label, index) => {
        const answerList = [...answersArray[0]].filter((answer) => {
            return answer.answerValue[0] === label
        })
        firtQuestionAllDataSet[index] = answerList.length
    });
    renderBarChart(firstQuestionLabels, firtQuestionAllDataSet, 10, 'Frecuencia', 'Cantidad de respuestas', 'firstQuestionChart', 'Docentes', 'chartFirstQuestionParent')



    // Third question
    const thirdQuestionLabels = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1']
    const thirdQuestionDataSet = []

    thirdQuestionLabels.forEach((label, index) => {
        const answerList = allThirdQuestionAnswers.filter((answer) => {
            return answer.period === label
        })

        if (answerList.length > 0) {
            let sum = 0
            let dataSetValue = 0
            answerList.forEach(answer => {
                sum += parseInt(answer.answerValue[0])
            })
            dataSetValue = (sum / answerList.length).toFixed(1);
            thirdQuestionDataSet[index] = dataSetValue
        } else {
            thirdQuestionDataSet[index] = 0
        }
    });
    renderLineChart(thirdQuestionLabels, thirdQuestionDataSet, 7, 'Semestres', 'Nivel del logro', 'thirdQuestionChart', 'Nivel', 'chartThirdQuestionParent')


    // Fourth question
    const fourtQuestionLabels = []
    answersArray[3].forEach(q => {
        const valueList = q.answerValue
        valueList.forEach(value => {
            const query = fourtQuestionLabels.find(elem => {
                return elem.replace(" ", "").toLowerCase() === value.replace(" ", "").toLowerCase()
            })
            if (!query) {
                fourtQuestionLabels.push(value)
            }
        })
    });

    const fourthQuestionAllDataSet = []
    fourtQuestionLabels.forEach((elem, index) => {
        fourthQuestionAllDataSet[index] = 0
    })

    answersArray[3].forEach(answer => {
        answer.answerValue.forEach(value => {
            let labelIndex = fourtQuestionLabels.findIndex(label => {
                return label === value
            })
            fourthQuestionAllDataSet[labelIndex]++
        })
    })

    renderBarChart(fourtQuestionLabels, fourthQuestionAllDataSet, 10, 'Estrategias', 'Cantidad de respuestas', 'fourthQuestionChart', 'Docentes', 'chartFourthQuestionParent')


    // Fifth question
    const fifthQuestionLabels = []
    const fifthQuestionDataSet = []

    if (answersArray[4].length > 0) {
        answersArray[4].forEach(answer => {
            answer.answerValue.forEach(value => {
                const q = fifthQuestionLabels.find(label => {
                    return label === value.split('|')[0]
                })
                if (!q) {
                    fifthQuestionLabels.push(value.split('|')[0])
                }
            })
        })

        fifthQuestionLabels.forEach((label, index) => {
            let sum = 0
            let dataSetValue = 0

            answersArray[4].forEach(answer => {
                const labelAnswer = answer.answerValue.filter(value => {
                    return value.split('|')[0] === label
                })
                if (labelAnswer.length > 0) {
                    const value = parseInt(labelAnswer[0].split("|")[labelAnswer[0].split("|").length - 1])
                    sum += value
                }
            })
            dataSetValue = (sum / answersArray[4].length).toFixed(1)
            fifthQuestionDataSet[index] = dataSetValue
        })
    }
    renderLineChart(fifthQuestionLabels, fifthQuestionDataSet, 7, 'Estrategias', 'Nivel en el que son adecuadas', 'fifthQuestionChart', 'Nivel', 'chartFifthQuestionParent')


    // Sixth question
    const sixthQuestionLabels = []
    const sixthQuestionDataSet = []

    if (answersArray[4].length > 0) {
        answersArray[4].forEach(answer => {
            answer.answerValue.forEach(value => {
                const q = sixthQuestionLabels.find(label => {
                    return label === value.split('|')[0]
                })
                if (!q) {
                    sixthQuestionLabels.push(value.split('|')[0])
                }
            })
        })

        sixthQuestionLabels.forEach((label, index) => {
            let sum = 0
            let dataSetValue = 0

            answersArray[5].forEach(answer => {
                const labelAnswer = answer.answerValue.filter(value => {
                    return value.split('|')[0] === label
                })
                if (labelAnswer.length > 0) {
                    const value = parseInt(labelAnswer[0].split("|")[labelAnswer[0].split("|").length - 1])
                    sum += value
                }
            })
            dataSetValue = (sum / answersArray[5].length).toFixed(1)
            sixthQuestionDataSet[index] = dataSetValue
        })
    }

    renderLineChart(sixthQuestionLabels, sixthQuestionDataSet, 7, 'Estrategias', 'Nivel en el que son acogidas', 'sixthQuestionChart', 'Nivel', 'chartSixthQuestionParent')


    // Seventh question
    const seventhQuestionLabels = []
    if (answersArray[6]) {
        answersArray[6].forEach(answer => {
            answer.answerValue.forEach(value => {
                const query = seventhQuestionLabels.find(label => {
                    return label === value
                })
                if (!query) {
                    seventhQuestionLabels.push(value)
                }
            })
        })

        const seventhQuestionDataSet = []
        seventhQuestionLabels.forEach((label, index) => {
            seventhQuestionDataSet[index] = 0
        })

        answersArray[6].forEach((answer, index) => {
            answer.answerValue.forEach(value => {
                let labelIndex = seventhQuestionLabels.findIndex(label => {
                    return label === value
                })
                seventhQuestionDataSet[labelIndex]++
            })
        })

        renderBarChart(seventhQuestionLabels, seventhQuestionDataSet, answersArray[6].length, 'Cantidad de respuestas', 'Estrategias recomendadas', 'seventhQuestionChart', 'Votos', 'chartSeventhQuestionParent')
    }


    // Eigth question
    const eigthQuestionLabels = ['Sí', 'No']
    const eigthQuestionDataSet = [0, 0]
    answersArray[7].forEach(answer => {
        const answerValue = answer.answerValue[0]
        const labelIndex = eigthQuestionLabels.findIndex(label => {
            return label === answerValue
        })
        eigthQuestionDataSet[labelIndex]++
    })

    renderPieChart(eigthQuestionLabels, eigthQuestionDataSet, 'eigthQuestionChart', '¿Brindas espacios de retroalimentación?', 'Respuestas en general de los docentes', 'chartEigthQuestionParent')


    // Eleven question
    const elevenQuestionLabels = ['Sí', 'No']
    const elevenQuestionDataSet = [0, 0]

    if (answersArray[10].length > 0) {
        answersArray[10].forEach(answer => {
            const answerValue = answer.answerValue[0]
            const labelIndex = elevenQuestionLabels.findIndex(label => {
                return label === answerValue
            })
            elevenQuestionDataSet[labelIndex]++
        })
    }
    renderPieChart(elevenQuestionLabels, elevenQuestionDataSet, 'elevenQuestionChart', ['¿Los docentes necesitan apoyo por parte de la', 'universidad para el desarrollo de las acciones de mejora?'], 'Respuestas en general de los docentes', 'chartElevenQuestionParent')


    // Twelve question
    const twelveQuestionLabels = ['Formación', 'Material didáctico o pedagógico', 'Material bibliográfico', 'Apoyo de centros u otros departamentos']
    const twelveQuestionDataSet = [0, 0, 0, 0]

    if (answersArray[11].length > 0) {
        answersArray[11].forEach(answer => {
            const answerValue = answer.answerValue[0]
            const labelIndex = twelveQuestionLabels.findIndex(label => {
                return label === answerValue
            })
            if (labelIndex >= 0) {
                twelveQuestionDataSet[labelIndex]++
            }
        })
    }

    renderBarChart(twelveQuestionLabels, twelveQuestionDataSet, answersArray[11].length, 'Tipo de apoyo', 'Respuestas de los docentes', 'twelveQuestionChart', 'Docentes', 'chartTwelveQuestionParent')

    hideLoader()
}

