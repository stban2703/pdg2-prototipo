import { checkAuthState, logOut, currentSignedInUser } from "./modules/auth.js";

let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let currentUser = localUser
if (currentUser != null || currentSignedInUser() != null) {
    currentUser = localUser
    const homeWelcome = document.querySelector(".home__welcome")
    if (homeWelcome) {
        homeWelcome.innerHTML = `Hola, ${localUser.name}`
    }
}else {
    window.location = "login.html"
}

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


