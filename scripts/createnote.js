import { checkAuthState, logOut } from "./modules/auth.js";

const filetype = location.search.replace("?", "");
const createNoteFiles = document.querySelector(".createNote__files")
const textFileSection = createNoteFiles.querySelector(".textfile")
const videoFileSection = createNoteFiles.querySelector(".videofile")

switch (filetype) {
    case "text":
        textFileSection.classList.remove("hidden")
        break;
    case "video":
        videoFileSection.classList.remove("hidden")
        break;
}