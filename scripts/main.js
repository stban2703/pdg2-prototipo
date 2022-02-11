import { checkAuthState, logOut } from "./modules/auth.js";

const addNoteBtn = document.querySelector(".addNoteBtn")
const notefiles = document.querySelector(".notefiles")

addNoteBtn.addEventListener("click", function() {
    notefiles.classList.toggle("hidden")
})
