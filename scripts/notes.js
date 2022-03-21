import { getNotes } from "./modules/firestore.js"
import { renderNotesBoard } from "./noteboard.js"
import { sortByWeek } from "./utils/sort.js"

let currentNoteView = "tablero"
let noteList = []

export async function getInitialNoteList(uid) {
    noteList = await getNotes(uid)
    noteList.sort(sortByWeek)
    //const noteSettingsForm = document.querySelector(".note-settings-form")
    renderNotesList(noteList)
    //onFilterListener(noteList)
}

export function onFilterListener() {
    //const copy = [...noteList]
    const noteSettingsForm = document.querySelector(".note-settings-form")

    if (window.location.href.includes("#notes") && noteSettingsForm) {
        const noteSubjectFilterSelect = noteSettingsForm.subject
        const notePeriodFilterSelect = noteSettingsForm.period
        noteSettingsForm.addEventListener('input', () => {
            let filterCopy = getFilteredNoteList(noteSubjectFilterSelect, notePeriodFilterSelect)
            renderNotesList(filterCopy)
        })
    }
}

function renderNotesList(list) {
    switch (currentNoteView) {
        case "tablero":
            renderNotesBoard(list)
            break;
    }
}

function getFilteredNoteList(subjectFilter, periodFilter) {
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
    return filterCopy
}
