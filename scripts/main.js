import { submitNote } from "./createnote.js";
import { logOut, currentSignedInUser } from "./modules/auth.js";
import { renderNotes } from "./noteboard.js";

// Verifica si el usuario ha  iniciado sesion
let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let currentUser = localUser

if (currentUser != null || currentSignedInUser() != null) {
    currentUser = localUser
    displayHomeUserName()
} else {
    window.location = "login.html"
}

const logoutButton = document.querySelector('.logoutButton')
logoutButton.addEventListener('click', function () {
    logOut()
})

// Verifica la ventana actual en el menu
checkCurrentTab()
window.addEventListener("hashchange", function () {
    checkCurrentTab()
}, false)

// Detectar cambios de pantalla
const pageContent = document.querySelector(".page-content")
let observer = new MutationObserver(function(mutationsList, observer) {
    mutationsList.forEach(e => {
        //console.log(e);
    })
    addPageFuncions()
});
observer.observe(pageContent, {characterData: false, childList: true, attributes: false});

function displayHomeUserName() {
    const homeWelcome = document.querySelector(".header__userName")
    if (homeWelcome) {
        homeWelcome.innerText = localUser.name
    }
}

function addPageFuncions() {
    displayHomeUserName()
    submitNote(currentUser)
    renderNotes(currentUser.id)
}

function checkCurrentTab() {
    const tabs = document.querySelectorAll(".navigation-menu__item")
    let currentTab = window.location.hash.replace("#", "")
    tabs.forEach(t => {
        if (currentTab.includes(t.id.replace("nav", ""))) {
            t.classList.add("navigation-menu__item--selected")
        } else {
            t.classList.remove("navigation-menu__item--selected")
        }
    })
    addPageFuncions()
}