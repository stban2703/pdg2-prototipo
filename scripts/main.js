import { onSelectMeetingMode, submitMeeting } from "./createmeeting.js";
import { createAgreement, getMeetingInfoForMinute, submitMeetingMinutes } from "./createmeetingminutes.js";
import { submitNote } from "./createnote.js";
import { renderMeetingMinutesDetails } from "./meetingminutes.js";
import { renderMeetingDetails, renderMeetings } from "./meetings.js";
import { changeMemoEditFormPage, onContentEditableEnter, renderMemoEditValues, updateMemoPseudoInputsValueLocally } from "./memoedit.js";
import { logOut, getCurrentSignedInUser } from "./modules/auth.js";
import { renderNoteDetails } from "./notedetails.js";
import { getInitialNoteList, onFilterListener } from "./notes.js";

// Verifica si el usuario ha  iniciado sesion
let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let currentUser = localUser

if (currentUser != null || getCurrentSignedInUser() != null) {
    currentUser = localUser
    displayHomeUserName()
} else {
    window.location = "login.html"
}
export const userInfo = currentUser

// Memorando
let memoProperties = {
    objective: "*Recuerda que el objetivo del memorando reflexivo es:*<br><br>La importancia de realizar un acto de reflexión es que se lleva a una constante renovación lo cual tiene un impacto en la calidad de la educación que se le brinda a los estudiantes y ayuda a satisfacer sus necesidades.",
    importance: "*Es un momento para:*<br><br>Explorar diferentes aspectos y dificultades que se identificaron dentro del curso para luego crear un plan de acción y poder mejorar."
}

// Cerrar sesion
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
let observer = new MutationObserver(function (mutationsList, observer) {
    mutationsList.forEach(e => {
        //console.log(e);
    })
    addPageFuncions()
});
observer.observe(pageContent, { characterData: false, childList: true, attributes: false });


// Mostrar nombre del usuario en pantalla principal
function displayHomeUserName() {
    const homeWelcome = document.querySelector(".header__userName")
    if (homeWelcome) {
        homeWelcome.innerText = localUser.name
    }
}


// Agrega las funciones de cada pantalla
function addPageFuncions() {
    displayHomeUserName()
    submitNote(currentUser)
    getInitialNoteList(currentUser.id)
    onFilterListener(currentUser.id)
    renderNoteDetails()
    renderMeetings()
    renderMeetingDetails()
    onSelectMeetingMode()
    submitMeeting()
    createAgreement()
    getMeetingInfoForMinute()
    submitMeetingMinutes()
    renderMeetingMinutesDetails()
    changeMemoEditFormPage()
    onContentEditableEnter()
    updateMemoPseudoInputsValueLocally(memoProperties)
    renderMemoEditValues(memoProperties)
    goBack()
}


// Verifica la pantalla actual
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


function goBack() {
    const backButton = document.querySelector(".back-button")
    if (backButton) {
        backButton.addEventListener('click', () => {
            history.back()
        })
    }
}