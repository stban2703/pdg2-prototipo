import { getNotes } from "./modules/firestore.js"
import { renderNotesBoard } from "./noteboard.js"
import { hideLoader, showLoader } from "./utils/loader.js"
import { sortByWeek } from "./utils/sort.js"

let currentNoteView = "tablero"
let noteList = []

export async function getInitialNoteList(uid) {
    showLoader()
    noteList = await getNotes(uid)
    noteList.sort(sortByWeek)
    //renderNotesList(noteList)

    const noteSettingsForm = document.querySelector(".note-settings-form")
    if (window.location.href.includes("#notes") && noteSettingsForm) {
        const noteSubjectFilterSelect = noteSettingsForm.subject
        const notePeriodFilterSelect = noteSettingsForm.period
        filterNoteList(noteSubjectFilterSelect, notePeriodFilterSelect)
    }
}

export function onFilterListener() {
    const noteSettingsForm = document.querySelector(".note-settings-form")

    if (window.location.href.includes("#notes") && noteSettingsForm) {
        const noteSubjectFilterSelect = noteSettingsForm.subject
        const notePeriodFilterSelect = noteSettingsForm.period
        noteSettingsForm.addEventListener('input', () => {
            filterNoteList(noteSubjectFilterSelect, notePeriodFilterSelect)
        })
    }
}

function renderNotesList(list) {
    hideLoader()
    switch (currentNoteView) {
        case "tablero":
            renderNotesBoard(list)
            break;
    }
}

function filterNoteList(subjectFilter, periodFilter) {
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
    renderNotesList(filterCopy)
}
