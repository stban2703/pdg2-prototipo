import { getImproveActions, updateImproveActions } from "./modules/firestore.js";
import { showLoader } from "./utils/loader.js";

let editAnswerTarget = ""
let improveActionIndex = 0

export async function getInitialImproveActions(userSubjects) {
    const memoimproveactionsScreen = document.querySelector(".memoimproveactions-screen")
    if (memoimproveactionsScreen && window.location.href.includes("#memoimproveactions")) {
        const subjectId = window.location.hash.split("?")[1]
        //const selectedSubject = getSubjectFromId(subjectId, userSubjects)
        const improveActionsAnswers = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subjectId)
        renderImproveActions(improveActionsAnswers)
        editImproveAction(improveActionsAnswers)
    }
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
                const actionItem = document.createElement("div")
                actionItem.className = "improve-action-item"
                actionItem.innerHTML = `
                <section class="improve-action-item__number">
                <span>${index + 1}</span>
                </section>
                <section class="improve-action-item__title">
                <h5>${elem.name}</h5>
                </section>
                <section class="improve-action-item__description improve-action-item__description--bigger">
                <p>${elem.description}</p>
                </section>
                <button type="button" class="small-button small-button--secondary checkImproveActionButton">
                <span>Realizado</span>
                </button>
                <button type="button" class="improve-action-item__controls"
                style="background-image: url('./images/3dots.svg');">
                </button>
                <ul class="improve-action-item__settings improve-action-item__settings--hidden">
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
            })
        })
    }
}