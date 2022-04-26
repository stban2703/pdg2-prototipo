import { getInitialAccomplishmentList, getInititalAccomplishmentDepartmentList } from "./accomplishment.js";
import { onSelectMeetingMode, submitMeeting } from "./createmeeting.js";
import { createAgreement, getMeetingInfoForMinute, submitMeetingMinutes } from "./createmeetingminutes.js";
import { submitNote } from "./createnote.js";
import { getInitialGeneralAll, getInitialGeneralCareer, getInitialGeneralDepartments, getInitialGeneralSelect, getInitialGeneralSubjets, onFilterGeneralAllByPeriod, onSubmitImproveActionComment, renderImproveActionsForSpecificGeneral } from "./generalprogress.js";
import { renderListHome, showShortcuts } from "./home.js";
import { getInitialHistoryImproveActions, getInitialImproveActions, renderGoToImproveActionHistoryButton, renderImproveActionComment } from "./improveactions.js";
import { changeMemoseeAnswerTab, getInitialMemoseeSubjects, renderMemoseeAnswersQuestions, renderMemoseeAnswerTab, renderMemoseeCareers, renderMemoseeDepartments } from "./memosee.js";
import { renderMeetingMinutesDetails } from "./meetingminutes.js";
import { getInitialMeetings, renderMeetingDetails } from "./meetings.js";
import { renderMemoIntro, getInitialMemoSubjects, onSortFilterMemoSubjectListener, getMemoSectionInfo, renderGoToImproveActionsButton, getAllSubjectsProgress } from "./memo.js";
import { addMemoSectionFormFunctions, changeMemoEditFormPage, onContentEditableEnter, renderMemoEditValues, updateMemoPseudoInputsValueLocally } from "./memoedit.js";
import { handleMemoAddActionForm, memoQuestionGoBack, renderMemoNotes, renderMemoQuestion, submitMemoQuestionForm } from "./memoquestion.js";
import { logOut, getCurrentSignedInUser } from "./modules/auth.js";
import { getInitialProgressInfo } from "./myprogress.js";
import { renderNoteDetails } from "./notedetails.js";
import { changeNotesView, getInitialNoteList, onFilterListener } from "./notes.js";
import { submitQuestions } from "./testmemoform.js";
import { getInitialMyGroupSubjects } from "./mygroup.js";
import { displayNotificationCounter, displayNotificationWindow, renderNotificationDetails, renderNotificationScreenList, renderNotificationWindowList, setAllNotificationAsRead } from "./notification.js";

import { firebase } from "./modules/firebase.js";
import {
    getFirestore, collection, query, onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { submitTestSubject } from "./modules/firestore.js";

const firestore = getFirestore(firebase)


// Verifica si el usuario ha  iniciado sesion
let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let localSubjects = JSON.parse(ls.getItem('subjectList'))
let localPeriod = JSON.parse(ls.getItem('currentPeriod'))
let currentUser = localUser
let currentSubjects = localSubjects
let currentPeriod = localPeriod

if (currentUser != null || getCurrentSignedInUser() != null) {
    currentUser = localUser
    displayHomeUserName()
} else {
    window.location = "login.html"
}

export const userInfo = currentUser
export const userSubjects = currentSubjects

// Check user roles
currentUser.role.forEach(role => {

    if (role === 'leader') {
        document.querySelector('#navaccomplishment').classList.remove('hidden')
        document.querySelector('#navaccomplishment').setAttribute('href', `#accomplishmentlist?group_${userInfo.leaderGroupId}`)
        document.querySelector('#navmygroup').classList.remove('hidden')
        document.querySelector('#navmygroup').setAttribute('href', `#mygroup?${userInfo.leaderGroupId}`)
    }

    if (role === 'principal') {
        document.querySelector('#navgeneral').classList.remove('hidden')
        document.querySelector('#navgeneral').setAttribute('href', `#generalselect?${role}_${userInfo.principalCareerId}`)
        document.querySelector('#navaccomplishment').classList.remove('hidden')
        document.querySelector('#navaccomplishment').setAttribute('href', `#accomplishmentlist?career_${userInfo.principalCareerId}`)
    }

    if (role === 'boss') {
        document.querySelector('#navaccomplishment').classList.remove('hidden')
        document.querySelector('#navaccomplishment').setAttribute('href', `#accomplishmentlist?department_${userInfo.bossDepartmentId}`)
        document.querySelector('#navgeneral').classList.remove('hidden')
        document.querySelector('#navgeneral').setAttribute('href', `#generalselect?${role}_${userInfo.bossDepartment}`)
    }

    if (role === 'admin') {
        document.querySelector('#navnotes').classList.add("hidden")
        document.querySelector('#navprogress').classList.add('hidden')
        document.querySelector('#navaccomplishment').classList.remove('hidden')
        document.querySelector('#navaccomplishment').setAttribute('href', `#accomplishmentdashboard`)
        document.querySelector('#navgeneral').classList.remove('hidden')
        document.querySelector('#navgeneral').setAttribute('href', `#generalselect?${role}_general`)

    }
})

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

addPageFuncions()
// Verifica la ventana actual en el menu
checkCurrentTab()
window.addEventListener("hashchange", function () {
    checkCurrentTab()
}, false)



// Notification
const notifications = []
const q = query(collection(firestore, `users/${currentUser.id}/notifications`));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
    /*querySnapshot.forEach((doc) => {
        notifications.push(doc.data());
    });
    console.log("listener")*/
    querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            notifications.push(change.doc.data());
        }
        if (change.type === "modified") {
            console.log(change.doc.data().id)
            console.log(notifications)
            const modifiedIndex = notifications.findIndex(elem => {
                return elem.id === change.doc.data().id
            })
            console.log(modifiedIndex)
            notifications[modifiedIndex] = change.doc.data()
        }
        if (change.type === "removed") {
            //console.log("Removed: ", change.doc.data());
        }
    });
    ///
    displayNotificationCounter(notifications)
    renderNotificationWindowList(notifications)
    renderNotificationScreenList(notifications)
    renderNotificationDetails(notifications, currentUser.id)
    setAllNotificationAsRead(notifications, currentUser.id)

});



// Detectar cambios de pantalla
const pageContent = document.querySelector(".page-content")
let observer = new MutationObserver(function (mutationsList, observer) {
    mutationsList.forEach(e => {
        if (e.addedNodes.length > 0) {
            addPageFuncions()
            displayNotificationCounter(notifications)
            renderNotificationWindowList(notifications)
            renderNotificationScreenList(notifications)
            renderNotificationDetails(notifications, currentUser.id)
            setAllNotificationAsRead(notifications, currentUser.id)
        }
    })
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
    showShortcuts(currentUser.role)
    renderListHome(currentSubjects, currentPeriod, currentUser.role, userInfo)///Sin actualizar

    //Note functions
    submitNote(currentUser, currentSubjects)// Sin problemas
    getInitialNoteList(currentUser.id)
    onFilterListener(currentUser.id, currentSubjects) // Sin problemas
    renderNoteDetails()
    changeNotesView()

    // Meeting functions
    getInitialMeetings(currentUser)
    renderMeetingDetails()
    onSelectMeetingMode()
    submitMeeting(currentUser)

    // Minutes functions
    createAgreement()
    getMeetingInfoForMinute(currentUser)
    submitMeetingMinutes()
    renderMeetingMinutesDetails()

    // Memo functions
    getAllSubjectsProgress(currentSubjects, currentPeriod) // LISTO
    renderMemoIntro(currentUser)
    getInitialMemoSubjects(currentSubjects) // SIN PROBLEMAS
    onSortFilterMemoSubjectListener(currentSubjects, currentUser.groups) // LISTO
    getMemoSectionInfo(currentSubjects, currentPeriod) // LISTO
    renderMemoQuestion()
    submitMemoQuestionForm(currentSubjects)
    renderMemoNotes(currentUser.id)
    handleMemoAddActionForm()

    // Memo see
    renderMemoseeDepartments()
    renderMemoseeCareers()
    getInitialMemoseeSubjects()
    changeMemoseeAnswerTab()
    renderMemoseeAnswerTab()
    renderMemoseeAnswersQuestions(currentPeriod)

    // Improve actions functions
    renderGoToImproveActionsButton()
    getInitialImproveActions() // LISTO
    renderGoToImproveActionHistoryButton()
    getInitialHistoryImproveActions()
    renderImproveActionComment(currentPeriod)

    // Progress funtions
    getInitialProgressInfo(currentPeriod) // LISTO

    // General progress functions
    getInitialGeneralSelect(currentUser)
    getInitialGeneralCareer()
    getInitialGeneralSubjets()
    renderImproveActionsForSpecificGeneral(currentPeriod, currentUser)
    onSubmitImproveActionComment(currentUser, currentPeriod)
    getInitialGeneralAll(currentPeriod)
    onFilterGeneralAllByPeriod()
    getInitialGeneralDepartments()

    // Accomplishment functions
    getInitialAccomplishmentList(currentUser)
    getInititalAccomplishmentDepartmentList()

    // My group functions
    getInitialMyGroupSubjects()

    // Memo form edit functions
    changeMemoEditFormPage()
    onContentEditableEnter()
    updateMemoPseudoInputsValueLocally(memoProperties)
    renderMemoEditValues(memoProperties)
    addMemoSectionFormFunctions()
    submitQuestions()

    // Notification
    displayNotificationWindow()

    // Back-return
    goBack()
    memoQuestionGoBack()


    // Test
    //submitTestSubject()
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
    if (!window.location.hash) {
        tabs[0].classList.add("navigation-menu__item--selected")
    }
    //addPageFuncions()
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