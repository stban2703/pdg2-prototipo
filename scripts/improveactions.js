import { getImproveActions } from "./modules/firestore.js";

export async function getInitialImproveActions(userSubjects) {
    const memoimproveactionsScreen = document.querySelector(".memoimproveactions-screen")
    if (memoimproveactionsScreen && window.location.href.includes("#memoimproveactions")) {
        const subjectId = window.location.hash.split("?")[1]
        const selectedSubject = getSubjectFromId(subjectId, userSubjects)
        const improveActions = await getImproveActions("a0tOgnI8yoiCW0BvJK2k", subjectId, selectedSubject.memoPeriod)
        console.log(improveActions)
        renderImproveActions(improveActions)
    }
}

function renderImproveActions(list) {
    const emptyMessage = document.querySelector(".improve-actions__empty")
    const improveActionList = document.querySelector(".improve-actions__list")

    improveActionList.innerHTML = ``
    if (list.length == 0) {
        emptyMessage.classList.remove("hidden")
        improveActionList.classList.add("hidden")
    } else {
        emptyMessage.classList.add("hidden")
        improveActionList.classList.remove("hidden")
        list.forEach((elem, index) => {
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
                <li class="improve-action-item__settings-item delete-improve-action-item">
                    <img class="improve-action-item__settings-item__normal-icon" src="./images/deletenoteicon.svg">
                    <img class="improve-action-item__settings-item__hover-icon" src="./images/deletenoteiconwhite.svg">
                    <span>Eliminar</span></li>
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

            const deleteImproveActionButton = actionItem.querySelector(".delete-improve-action-item")
            deleteImproveActionButton.addEventListener("click", () => {
            })

            const editImproveActionButton = actionItem.querySelector(".edit-improve-action-item")
            editImproveActionButton.addEventListener("click", () => {
                
            })
        })
    }
}

function getSubjectFromId(id, userSubjects) {
    const subject = userSubjects.find((s) => {
        return s.id === id
    })
    return subject
}