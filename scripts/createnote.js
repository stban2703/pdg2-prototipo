import { checkAuthState, logOut } from "./modules/auth.js";
import { submitNote } from "./modules/firestore.js";
import { submitFile } from "./modules/storage.js";

const filetype = location.search.replace("?", "");
const createNoteFiles = document.querySelector(".createNote__files")
const textFileSection = createNoteFiles.querySelector(".textfile")
const videoFileSection = createNoteFiles.querySelector(".videofile")
const noteForm = document.querySelector('.noteForm')

switch (filetype) {
    case "text":
        textFileSection.classList.remove("hidden")
        break;
    case "video":
        videoFileSection.classList.remove("hidden")
        break;
}

noteForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const name = noteForm.name.value
    const week = noteForm.week.value
    const subject = noteForm.subject.value
    if (videoFileSection) {
        const file = noteForm.file.files[0]
        submitNote("stban1401", name, week, subject, file)
    }
})

