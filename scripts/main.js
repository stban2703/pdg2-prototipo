import { onSelectMeetingMode, submitMeeting } from "./createmeeting.js";
import { createAgreement, getMeetingInfoForMinute, submitMeetingMinutes } from "./createmeetingminutes.js";
import { submitNote } from "./createnote.js";
import { renderSubjectListHome } from "./home.js";
import { getInitialImproveActions } from "./improveactions.js";
import { renderMeetingMinutesDetails } from "./meetingminutes.js";
import { renderMeetingDetails, renderMeetings } from "./meetings.js";
import { renderMemoIntro, getInitialMemoSubjects, onSortFilterMemoSubjectListener, getMemoSectionInfo, renderGoToImproveActionsButton } from "./memo.js";
import { addMemoSectionFormFunctions, changeMemoEditFormPage, onContentEditableEnter, renderMemoEditValues, updateMemoPseudoInputsValueLocally } from "./memoedit.js";
import { handleMemoAddActionForm, memoQuestionGoBack, renderMemoNotes, renderMemoQuestion, submitMemoQuestionForm } from "./memoquestion.js";
import { logOut, getCurrentSignedInUser } from "./modules/auth.js";
import { renderNoteDetails } from "./notedetails.js";
import { changeNotesView, getInitialNoteList, onFilterListener } from "./notes.js";
import { submitQuestions } from "./testmemoform.js";

// Verifica si el usuario ha  iniciado sesion
let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let localSubjects = JSON.parse(ls.getItem('subjectList'))
let currentUser = localUser
let currentSubjects = localSubjects

if (currentUser != null || getCurrentSignedInUser() != null) {
    currentUser = localUser
    displayHomeUserName()
} else {
    window.location = "login.html"
}

export const userInfo = currentUser
export const userSubjects = currentSubjects

// Memorando
let memoProperties = {
    objective: "*Recuerda que el objetivo del memorando reflexivo es:*<br><br>La importancia de realizar un acto de reflexión es que se lleva a una constante renovación lo cual tiene un impacto en la calidad de la educación que se le brinda a los estudiantes y ayuda a satisfacer sus necesidades.",
    importance: "*Es un momento para:*<br><br>Explorar diferentes aspectos y dificultades que se identificaron dentro del curso para luego crear un plan de acción y poder mejorar.",
    sections: [
        {
            id: "autorreflexion",
            index: 0,
            name: "Autorreflexión",
            questions: []
        },
        {
            id: "retroalimentacion",
            index: 1,
            name: "Retroalimentación obtenida sobre el curso",
            questions: []
        },
        {
            id: "plandeaccion",
            index: 2,
            name: "Plan de acción",
            questions: []
        }
    ]
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
    //mutationsList.forEach(e => {/*console.log(e);*/})
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
    // Home functions
    displayHomeUserName()
    renderSubjectListHome(currentSubjects)

    //Note functions
    submitNote(currentUser, currentSubjects)
    getInitialNoteList(currentUser.id)
    onFilterListener(currentUser.id, currentSubjects)
    renderNoteDetails()
    changeNotesView()

    // Meeting functions
    renderMeetings()
    renderMeetingDetails()
    onSelectMeetingMode()
    submitMeeting()

    // Minutes functions
    createAgreement()
    getMeetingInfoForMinute()
    submitMeetingMinutes()
    renderMeetingMinutesDetails()

    // Memo functions
    renderMemoIntro(currentUser)
    getInitialMemoSubjects(currentSubjects)
    onSortFilterMemoSubjectListener(currentSubjects, userInfo.groups)
    getMemoSectionInfo(currentSubjects)
    renderMemoQuestion()
    submitMemoQuestionForm()
    renderMemoNotes(currentUser.id)
    handleMemoAddActionForm()

    // Improve actions functions
    renderGoToImproveActionsButton()
    getInitialImproveActions(currentSubjects)

    // Memo form edit functions
    changeMemoEditFormPage()
    onContentEditableEnter()
    updateMemoPseudoInputsValueLocally(memoProperties)
    renderMemoEditValues(memoProperties)
    addMemoSectionFormFunctions()
    submitQuestions()

    // Back-return
    goBack()
    memoQuestionGoBack()
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
            const editImproveActionForm = document.querySelector(".editImproveActionForm")
            if (window.location.href.includes("#memoimproveactions?") && editImproveActionForm) {
                if (!editImproveActionForm.classList.contains("hidden")) {
                    const improveActionViews = document.querySelectorAll(".improveactionview")
                    improveActionViews.forEach(elem => {
                        elem.classList.remove("hidden")
                    })
                    editImproveActionForm.classList.add("hidden")
                } else {
                    history.back()
                }
            } else {
                history.back()
            }
        })
    }
}