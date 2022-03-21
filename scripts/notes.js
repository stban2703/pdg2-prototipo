import { getNotes } from "./modules/firestore.js"
import { renderNotesBoard } from "./noteboard.js"
import { filterBySubject } from "./utils/filter.js"
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

    if (window.location.href.includes("#notes")) {
        const noteSubjectFilterSelect = noteSettingsForm.subject
        noteSubjectFilterSelect.addEventListener('input', () => {
            console.log(noteSubjectFilterSelect.value)
            if (noteSubjectFilterSelect.value.length > 0) {
                const newNoteList = [...list].filter(e => {
                    if(e.subject == noteSubjectFilterSelect.value) {
                        return true
                    }
                })
                renderNotesList(newNoteList)
            } else {
                renderNotesList(list)
            }
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
