import { parseTimestampToDate } from "./utils/date-format.js";

export async function renderNotesBoard(list) {
    const noteBoard = document.querySelector('.note-board')

    if (noteBoard) {

        const noteBoardListKeep = noteBoard.querySelector(".note-board__list--keep")
        const noteBoardListImprove = noteBoard.querySelector(".note-board__list--improve")
        const noteBoardListRemove = noteBoard.querySelector(".note-board__list--remove")

        noteBoardListKeep.innerHTML = ""
        noteBoardListImprove.innerHTML = ""
        noteBoardListRemove.innerHTML = ""

        list.forEach(note => {
            const noteItem = document.createElement("div")
            noteItem.classList.add("board-note-item")
            noteItem.innerHTML = `
                <div class="board-note-item__color">
                </div>
                <section class="board-note-item__info">
                    <ul class="board-note-item__settings board-note-item__settings--hidden">
                        <li class="board-note-item__settings-item delete-board-note-item"><img src=""><span>Eliminar</span></li>
                        <li class="board-note-item__settings-item"><span>Editar</span></li>
                    </ul>
                    <section class="board-note-item__header">
                        <img class="board-note-item__type" src="./images/board${note.fileType}type-${note.category}.svg" alt="">
                        <h4 class="board-note-item__title">${note.name}</h4>
                        <button class="board-note-item__dotsBtn">
                            
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
                        <a class="board-note-item__editBtn board-edit-button" href = '#notesdetails?${note.id}'>
                            <p>Ver detalle</p>
                        </a>
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

            const boardNoteItemDotsBtn = noteItem.querySelector(".board-note-item__dotsBtn")
            const boardNoteItemSettings = noteItem.querySelector(".board-note-item__settings")

            document.addEventListener('click', (event) => {
                if (event.target == boardNoteItemDotsBtn) {
                    boardNoteItemSettings.classList.remove("board-note-item__settings--hidden")
                } else {
                    boardNoteItemSettings.classList.add("board-note-item__settings--hidden")
                }
            })
        });
    }
}