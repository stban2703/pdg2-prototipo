import { checkAuthState, logOut } from "./modules/auth.js";

const addNoteBtn = document.querySelector(".addNoteBtn")
const notefiles = document.querySelector(".notefiles")

addNoteBtn.addEventListener("click", function () {
    notefiles.classList.toggle("hidden")
})

const textBtn = notefiles.querySelector(".text")
const audioBtn = notefiles.querySelector(".audio")
const cameraBtn = notefiles.querySelector(".camera")
const videoBtn = notefiles.querySelector(".video")

textBtn.addEventListener("click", function (event) {
    window.location = 'createnote.html?text'
})

videoBtn.addEventListener("click", function (event) {
    window.location = 'createnote.html?video'
})
