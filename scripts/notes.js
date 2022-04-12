import { getNotes } from "./modules/firestore.js"
import { renderNotesBoard } from "./noteboard.js"
import { renderNotesListView } from "./notelist.js"
import { hideLoader, showLoader } from "./utils/loader.js"
import { sortByWeek } from "./utils/sort.js"

let currentNoteView = "tablero"
let noteList = []

export async function getInitialNoteList(uid) {
    if (window.location.href.includes("#notes") && !window.location.href.includes("details")) {
        showLoader()
        noteList = await getNotes(uid)
        noteList.sort(sortByWeek)
        //renderNotesList(noteList)

        const viewsButtons = document.querySelectorAll(".notes-view-button")
        onChangeView(viewsButtons)

        const noteSettingsForm = document.querySelector(".note-settings-form")
        if (window.location.href.includes("#notes") && noteSettingsForm) {
            const noteSubjectFilterSelect = noteSettingsForm.subject
            const notePeriodFilterSelect = noteSettingsForm.period
            filterNoteList(uid, noteSubjectFilterSelect, notePeriodFilterSelect)
        }
    }
}


export function changeNotesView() {
    const noteViewsControl = document.querySelector(".note-screen__views")
    if (window.location.href.includes("#notes") && !window.location.href.includes("details") && noteViewsControl) {
        const viewsButtons = noteViewsControl.querySelectorAll(".notes-view-button")
        viewsButtons.forEach((e, i) => {
            e.addEventListener('click', () => {
                switch(i) {
                    case 0:
                        currentNoteView = "tablero"
                        onChangeView(viewsButtons)
                        break;

                    case 1:
                        currentNoteView = "lista"
                        onChangeView(viewsButtons)
                        break;

                    case 2:
                        currentNoteView = "semana"
                        break;
                }
            })
        })
    }
}

function onChangeView(buttonList) {
    buttonList.forEach(elem => {
        if(elem.id == currentNoteView) {
            elem.classList.add("notes-view-button--selected")
        } else {
            elem.classList.remove("notes-view-button--selected")
        }
    })

    const noteviews = document.querySelectorAll(".noteview")
    noteviews.forEach(elem => {
        if(elem.id.includes(currentNoteView)) {
            elem.classList.remove("hidden")
        } else {
            elem.classList.add("hidden")
        }
    })
}

export function onFilterListener(uid, userSubjects) {
    const noteSettingsForm = document.querySelector(".note-settings-form")

    if (window.location.href.includes("#notes") && noteSettingsForm) {
        const noteSubjectFilterSelect = noteSettingsForm.subject
        const notePeriodFilterSelect = noteSettingsForm.period

        userSubjects.forEach(e => {
            const subjectOption = document.createElement('option')
            subjectOption.value = e.name
            subjectOption.innerHTML = e.name
            noteSubjectFilterSelect.appendChild(subjectOption)
        })

        noteSettingsForm.addEventListener('input', () => {
            filterNoteList(uid, noteSubjectFilterSelect, notePeriodFilterSelect)
        })
    }
}

function renderNotesList(userId, list) {
    hideLoader()
    renderNotesBoard(userId, list)
    renderNotesListView(list)
    /*switch (currentNoteView) {
        case "tablero":
            renderNotesBoard(userId, list)
            break;
        case "lista":
            renderNotesListView(list)
            break;
    }*/
}

function filterNoteList(userId, subjectFilter, periodFilter) {
    let filterCopy = [...noteList]
    if (subjectFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.subject == subjectFilter.value) {
                return true
            }
        })
    }

    if (periodFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.period == periodFilter.value) {
                return true
            }
        })
    }
    renderNotesList(userId, filterCopy)
}
