import { checkAuthState, logOut, currentSignedInUser } from "./modules/auth.js";
import { firebase } from "./modules/firebase.js";
import {
    getFirestore,
    collection,
    query,
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
const db = getFirestore(firebase)

let ls = window.localStorage;
let localUser = JSON.parse(ls.getItem('currentuser'))
let currentUser = localUser
let noteList = []
if (currentUser != null || currentSignedInUser() != null) {
    getNotes(currentUser.id)
} else {
    window.location = "login.html"
}


async function getNotes(uid) {
    const q = query(collection(db, "notes"), where("userId", "==", "" + uid))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const note = doc.data()
        noteList.push(note)
        console.log(note.id)
    });
    console.log(noteList)
    renderBoardItems(noteList)
}

function renderBoardItems(list) {
    let copy = [...list]
    const keepColumn = document.querySelector(".boardColumn__list--keep")
    const improveColumn = document.querySelector(".boardColumn__list--improve")
    const removeColumn = document.querySelector(".boardColumn__list--remove")

    keepColumn.innerHTML = ``
    improveColumn.innerHTML = ``
    removeColumn.innerHTML = ``

    copy.forEach((elem, i) => {
        const boardItemDiv = document.createElement('div')
        boardItemDiv.classList.add("columnNoteItem")
        boardItemDiv.innerHTML = `
        <section class="columnNoteItem__info">
            <section class="columnNoteItem__icon">
                <img src="./images/videonoteview.svg" alt="">
            </section>
            <section class="columnNoteItem__summary">
                <p>Nombre: ${elem.name}</p>
                <p>Curso: ${elem.subject}</p>
                <p>Fecha: 27/01/2022</p>
            </section>
        </section>
        <section class="columnNoteItem__control">
            <div class="columnNoteItem__arrow columnNoteItem__arrow--left">
                <img src="" alt="">
            </div>
            <button class="button columnNoteItem__button button columnNoteItem__button button--board button--dark">
                <p>Ver detalle</p>
            </button>
            <div class="columnNoteItem__arrow columnNoteItem__arrow--right">
                <img src="" alt="">
            </div>
        </section>
        `
        switch (elem.category) {
            case "keep":
                keepColumn.appendChild(boardItemDiv)
                break
            case "improve":
                improveColumn.appendChild(boardItemDiv)
                break
            case "remove":
                removeColumn.appendChild(boardItemDiv)
                break
        }
    })
}