import { getNotes } from "./modules/firestore.js"
import { renderNotesBoard } from "./noteboard.js"
import { sortByWeek } from "./utils/sort.js"

let currentNoteView = "tablero"

export async function getInitialNoteList(uid) {
    const noteList = await getNotes(uid)
    const copy = [...noteList].sort(sortByWeek)
    renderNotesList(copy)
    filterNoteList(copy)
}

function filterNoteList(list) {
    const noteSettingsForm = document.querySelector(".note-settings-form")

    if (window.location.href.includes("#notes") && noteSettingsForm) {
        const noteSubjectFilterSelect = noteSettingsForm.subject
        const notePeriodFilterSelect = noteSettingsForm.period

        noteSettingsForm.addEventListener('input', () => {
            let filterCopy = [...list]

            if (noteSubjectFilterSelect.value.length > 0) {
                filterCopy = [...filterCopy].filter(e => {
                    if(e.subject == noteSubjectFilterSelect.value) {
                        return true
                    }
                })
            }

            if (notePeriodFilterSelect.value.length > 0) {
                filterCopy = [...filterCopy].filter(e => {
                    if(e.period == notePeriodFilterSelect.value) {
                        return true
                    }
                })
            }

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
