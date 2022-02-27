import { getNotes } from "./modules/firestore.js";
import { parseTimestampToDate } from "./utils/date-format.js";
import { sortByWeek } from "./utils/sort.js";

export async function renderNotes(uid) {
    const noteBoard = document.querySelector('.note-board')

    if (noteBoard && window.location.href.includes("#notes")) {

        const noteBoardListKeep = noteBoard.querySelector(".note-board__list--keep")
        const noteBoardListImprove = noteBoard.querySelector(".note-board__list--improve")
        const noteBoardListRemove = noteBoard.querySelector(".note-board__list--remove")

        noteBoardListKeep.innerHTML = ""
        noteBoardListImprove.innerHTML = ""
        noteBoardListRemove.innerHTML = ""

        const noteList = await getNotes(uid)
        const copy = [...noteList].sort(sortByWeek)
    
        copy.forEach(note => {
            const noteItem = document.createElement("div")
            noteItem.classList.add("board-note-item")
            noteItem.innerHTML = `
                <div class="board-note-item__color">
                </div>
                <section class="board-note-item__info">
                    <section class="board-note-item__header">
                        <img class="board-note-item__type" src="./images/board${note.fileType}type-${note.category}.svg" alt="">
                        <h4 class="board-note-item__title">${note.name}</h4>
                        <button class="board-note-item__dotsBtn">
                            <img src="./images/3dots.svg" alt="">
                        </button>
                    </section>
                    <section class="board-note-item__details">
                        <p class="board-note-item__subtitle">Curso: <span>${note.subject}</span></p>
                        <p class="board-note-item__subtitle">Fecha: <span>${parseTimestampToDate(note.date)}</span></p>
                        <p class="board-note-item__subtitle">Semana: <span>${note.week}</span></p>
                    </section>
                    <section class="board-note-item__controls">
                        <button class="board-note-item__moveBtn board-note-item__moveBtn--left">
                            <img src="./images/leftarrow.svg" alt="">
                        </button>
                        <button class="board-note-item__editBtn board-edit-button">
                            <p>Editar</p>
                        </button>
                        <button class="board-note-item__moveBtn board-note-item__moveBtn--right">
                            <img src="./images/rightarrow.svg" alt="">
                        </button>
                    </section>
                </section>
            `

            switch (note.category) {
                case "keep":
                    noteItem.classList.add("board-note-item--keep")
                    noteBoardListKeep.appendChild(noteItem)
                    break;
                case "improve":
                    noteItem.classList.add("board-note-item--improve")
                    noteBoardListImprove.appendChild(noteItem)
                    break;
                case "remove":
                    noteItem.classList.add("board-note-item--remove")
                    noteBoardListRemove.appendChild(noteItem)
                    break;
            }
        });
    }
}


/*async function getNotes(uid) {
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
}*/