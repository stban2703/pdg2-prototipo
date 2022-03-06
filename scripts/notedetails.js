import { getNoteDetails } from "./modules/firestore.js";

export async function renderNoteDetails() {
    const noteDetailsSection = document.querySelector(".notesdetails-screen")

    if (noteDetailsSection && window.location.href.includes("#notesdetails")) {
        const noteId = window.location.hash.split("?")[1]
        const note = await getNoteDetails(noteId)
        console.log(note)
    }
}