import { userSubjects } from "./main.js"
import { getNotes } from "./modules/firestore.js"
import { renderNotesBoard } from "./noteboard.js"
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

        const noteSettingsForm = document.querySelector(".note-settings-form")
        if (window.location.href.includes("#notes") && noteSettingsForm) {
            const noteSubjectFilterSelect = noteSettingsForm.subject
            const notePeriodFilterSelect = noteSettingsForm.period
            filterNoteList(uid, noteSubjectFilterSelect, notePeriodFilterSelect)
        }
    }
}

export function onFilterListener(uid) {
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
    switch (currentNoteView) {
        case "tablero":
            renderNotesBoard(userId, list)
            break;
    }
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
