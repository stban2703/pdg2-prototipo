import { getHistoryImproveActions, getImproveActionComment, getImproveActions, submitCheckedImproveAction, updateImproveActions } from "./modules/firestore.js";
import { parseTimestampToDate } from "./utils/date-format.js";
import { showLoader } from "./utils/loader.js";

let editAnswerTarget = ""
let improveActionIndex = 0
let historyImproveActions = []

export async function getInitialImproveActions() {
    const memoimproveactionsScreen = document.querySelector(".memoimproveactions-screen")
    if (memoimproveactionsScreen && window.location.href.includes("#memoimproveactions")) {
        const subjectId = window.location.hash.split("?")[1].split("_")[0]
        const improveActionsAnswers = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subjectId)
        renderImproveActions(improveActionsAnswers)
        editImproveAction(improveActionsAnswers)
        setPieGraphicForImproveActions(improveActionsAnswers, subjectId)
    }
}

export async function renderImproveActionComment(currentPeriod) {
    const memoimproveactionsScreen = document.querySelector(".memoimproveactions-screen")
    if (memoimproveactionsScreen && window.location.href.includes("#memoimproveactions")) {
        const subjectId = window.location.hash.split("?")[1].split("_")[0]
        const queryComment = window.location.hash.split("?")[1].split("_")[1]

        const comments = await getImproveActionComment(subjectId, currentPeriod)
        const commentEmpty = document.querySelector(".commentEmpty")
        const commentName = document.querySelector(".commentName")
        const commentDate = document.querySelector(".commentDate")
        const commentText = document.querySelector(".commentText")

        if(comments[0]) {
            commentEmpty.classList.add("hidden")
            commentName.classList.remove("hidden")
            commentName.innerHTML = comments[0].userName
            commentDate.classList.remove("hidden")
            commentDate.innerHTML = parseTimestampToDate(comments[0].date)
            commentText.classList.remove("hidden")
            commentText.innerHTML = comments[0].comment
        }

        if(queryComment) {
            const commentSection = document.querySelector(".memoimproveactions-screen__commentSection")
            commentSection.scrollIntoView(true)
        }
    }
}

async function setPieGraphicForImproveActions(answersList, subjectId) {
    const generalList = []

    if (answersList.length > 0) {
        answersList.forEach(answer => {
            answer.answerValue.forEach(elem => {
                generalList.push(elem)
            })
        })
    }

    const checkedActionsList = await getHistoryImproveActions(subjectId)

    if (checkedActionsList.length > 0) {
        checkedActionsList.forEach(elem => {
            generalList.push(elem)
        })
    }

    let percent = 0
    if (generalList.length === 0) {
        percent = 0
    } else {
        percent = (checkedActionsList.length / generalList.length) * 100
    }

    const progressContainer = document.querySelector(".memoprogress-item--improveactions")
    progressContainer.innerHTML = `
    <p class="memoprogress-item__title">Tu progreso de mejoras:</p>
    <div class="pie custom-pie" data-pie='{ "colorSlice": "#979DFF", "percent": ${percent}, "colorCircle": "#EDF2FF", "strokeWidth": 15, "size": 100, "fontSize": "2.5rem", "fontWeight": 500, "fontColor": "#979DFF", "round": true, "stroke": 10}'></div>
    `
    const circle = new CircularProgressBar("pie");
    circle.initial();
}

function editImproveAction(list) {
    const editImproveActionForm = document.querySelector(".editImproveActionForm")
    editImproveActionForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const newValue = {
            name: editImproveActionForm.improveactionname.value,
            description: editImproveActionForm.improveactiondescription.value
        }
        const periodListIndex = list.findIndex((elem) => {
            return elem.id === editAnswerTarget
        })

        list[periodListIndex].answerValue[improveActionIndex] = newValue
        showLoader()
        updateImproveActions(editAnswerTarget, list[periodListIndex].answerValue)
    })
}

function renderImproveActions(list) {
    const emptyMessage = document.querySelector(".improve-actions__empty")
    const improveActionList = document.querySelector(".improve-actions__list")
    const editImproveActionForm = document.querySelector(".editImproveActionForm")
    const improveActionViews = document.querySelectorAll(".improveactionview")

    improveActionList.innerHTML = ``
    if (list.length == 0) {
        emptyMessage.classList.remove("hidden")
        improveActionList.classList.add("hidden")
    } else {
        emptyMessage.classList.add("hidden")
        improveActionList.classList.remove("hidden")
        list.forEach((answer) => {
            answer.answerValue.forEach((elem, index) => {
                const actionItem = document.createElement("tr")
                actionItem.className = "improve-action-item"
                actionItem.innerHTML = `
                <td>
                    <div class="improve-action-item__number">
                        <span>${index + 1}</span>
                    </div>
                </td>
                <td class="improve-action-item__title">
                    <h5>${elem.name}</h5>
                </td>
                <td class="improve-action-item__description">
                    <p>${elem.description}</p>
                </td>
                <td style="width: fit-content;">
                    <button type="button" class="small-button small-button--secondary checkImproveActionButton">
                        <span>Realizado</span>
                    </button>
                </td>
                <td style="width: fit-content;">
                    <button type="button" class="improve-action-item__controls"
                        style="background-image: url('./images/3dots.svg');">
                    </button>
                </td>
                <ul class="improve-action-item__settings improve-action-item__settings--hidden">
                <li class="improve-action-item__settings-item delete-improve-action-item">
                    <img class="improve-action-item__settings-item__normal-icon" src="./images/deletenoteicon.svg">
                    <img class="improve-action-item__settings-item__hover-icon" src="./images/deletenoteiconwhite.svg">
                    <span>Eliminar</span>
                </li>
                <li class="improve-action-item__settings-item edit-improve-action-item">
                    <img class="improve-action-item__settings-item__normal-icon" src="./images/editicon.svg">
                    <img class="improve-action-item__settings-item__hover-icon" src="./images/editiconwhite.svg">
                    <span>Editar</span>
                </li>
                </ul>
                `
                improveActionList.appendChild(actionItem)

                // Item settings menu
                const improveActionsDotsBtn = actionItem.querySelector(".improve-action-item__controls")
                const improveActionItemSettings = actionItem.querySelector(".improve-action-item__settings")

                improveActionsDotsBtn.addEventListener('click', () => {
                    improveActionItemSettings.classList.toggle("improve-action-item__settings--hidden")
                    improveActionsDotsBtn.classList.toggle("improve-action-item__controls--activated")
                })

                // Delete from firestore
                const deleteImproveActionButton = actionItem.querySelector(".delete-improve-action-item")
                deleteImproveActionButton.addEventListener("click", () => {
                    editAnswerTarget = answer.id
                    improveActionIndex = index

                    const periodListIndex = list.findIndex((elem) => {
                        return elem.id === editAnswerTarget
                    })

                    const copy = [...list[periodListIndex].answerValue]
                    copy.splice(improveActionIndex, 1)
                    showLoader()
                    updateImproveActions(editAnswerTarget, copy)
                })

                // Edit on firestore
                const editImproveActionButton = actionItem.querySelector(".edit-improve-action-item")
                editImproveActionButton.addEventListener("click", () => {
                    editAnswerTarget = answer.id
                    improveActionIndex = index
                    improveActionViews.forEach(elem => {
                        elem.classList.add("hidden")
                    })
                    editImproveActionForm.classList.remove("hidden")
                    editImproveActionForm.improveactionname.value = elem.name
                    editImproveActionForm.improveactiondescription.value = elem.description
                })

                // Check improve action
                const checkImproveActionButton = actionItem.querySelector(".checkImproveActionButton")
                checkImproveActionButton.addEventListener("click", () => {
                    editAnswerTarget = answer.id
                    improveActionIndex = index

                    const periodListIndex = list.findIndex((elem) => {
                        return elem.id === editAnswerTarget
                    })

                    const copy = [...list[periodListIndex].answerValue]
                    copy.splice(improveActionIndex, 1)
                    showLoader()
                    submitCheckedImproveAction(answer.questionId, answer.id, answer.subjectId, answer.period,
                        list[periodListIndex].answerValue[improveActionIndex].name, list[periodListIndex].answerValue[improveActionIndex].description, copy)
                })
            })
        })
    }
}

export function renderGoToImproveActionHistoryButton() {
    const goToImproveActionsHistoryButton = document.querySelector('.goToImproveActionsHistoryButton')
    if (goToImproveActionsHistoryButton && window.location.href.includes("#memoimproveactions")) {
        const subjectId = window.location.hash.split("?")[1]
        goToImproveActionsHistoryButton.href = `#memohistoryimproveactions?${subjectId}`
    }
}

export async function getInitialHistoryImproveActions() {
    const memohistoryImproveActionsScreen = document.querySelector(".memohistoryimproveactions-screen")
    if (memohistoryImproveActionsScreen && window.location.href.includes("#memohistoryimproveactions")) {
        const subjectId = window.location.hash.split("?")[1]
        historyImproveActions = await getHistoryImproveActions(subjectId)
        renderHistoryImproveActions(historyImproveActions)

        // Filter
        const historyFilterControls = memohistoryImproveActionsScreen.querySelector(".memohistoryimproveactions-screen__controls")
        const periodFilter = historyFilterControls.period
        periodFilter.addEventListener('input', () => {
            filterImproveActionsHistory(periodFilter)
        })
    }
}

function renderHistoryImproveActions(list) {
    const improveActionsLisHistory = document.querySelector(".improve-actions__list--history")
    const emptyMessage = document.querySelector(".improve-actions__empty")

    improveActionsLisHistory.innerHTML = ``
    if (list.length == 0) {
        emptyMessage.classList.remove("hidden")
        improveActionsLisHistory.classList.add("hidden")
    } else {
        emptyMessage.classList.add("hidden")
        improveActionsLisHistory.classList.remove("hidden")
        list.forEach((elem, index) => {
            const historyItem = document.createElement('tr')
            historyItem.className = "improve-action-item"
            historyItem.innerHTML = `
            <td>
            <div class="improve-action-item__number">
            <span>${index + 1}</span>
            </div>
            <td>
            <section class="improve-action-item__title">
            <h5>${elem.name}</h5>
            </td>
            <td class="improve-action-item__description improve-action-item__description--bigger">
            <p>${elem.description}</p>
            </td>
            <td class="improve-action-item__date">
            <p>${parseTimestampToDate(elem.date)}</p>
            </td>
            `
            improveActionsLisHistory.appendChild(historyItem)
        })
    }
}

function filterImproveActionsHistory(periodFilter) {
    let filterCopy = [...historyImproveActions]

    if (periodFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.period == periodFilter.value) {
                return true
            }
        })
    }
    renderHistoryImproveActions(filterCopy)
}
