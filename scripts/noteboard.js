import { deleteNote, updateNoteCategory } from "./modules/firestore.js";
import { parseTimestampToDate } from "./utils/date-format.js";
import { getCategoryColumnsRect, handleDragEnter, handleDragLeave, handleDragOver, improveRect, keepRect, mouseX, mouseY, removeRect } from "./utils/drag.js";
import { showLoader } from "./utils/loader.js";

let selectedNote = null

export async function renderNotesBoard(list) {
    const noteBoard = document.querySelector('.note-board')

    if (noteBoard) {
        const allNoteList = noteBoard.querySelectorAll(".note-board__list")
        const noteBoardListKeep = noteBoard.querySelector(".note-board__list--keep")
        const noteBoardListImprove = noteBoard.querySelector(".note-board__list--improve")
        const noteBoardListRemove = noteBoard.querySelector(".note-board__list--remove")

        // Drop items on columns functions
        allNoteList.forEach(e => {
            e.addEventListener('dragenter', handleDragEnter);
            e.addEventListener('dragover', handleDragOver);
            e.addEventListener('dragleave', handleDragLeave);
            e.addEventListener('drop', event => {
                event.stopPropagation(); // stops the browser from redirecting.
                if (mouseX > keepRect.x && mouseX < keepRect.x + keepRect.width &&
                    mouseY > keepRect.y && mouseY < keepRect.y + keepRect.height) {
                    //console.log("Keep")
                    updateNoteCategory(selectedNote.id, selectedNote.category, "keep")
                }

                if (mouseX > improveRect.x && mouseX < improveRect.x + improveRect.width &&
                    mouseY > improveRect.y && mouseY < improveRect.y + improveRect.height) {
                    //console.log("Improve")
                    updateNoteCategory(selectedNote.id, selectedNote.category, "improve")
                }

                if (mouseX > removeRect.x && mouseX < removeRect.x + removeRect.width &&
                    mouseY > removeRect.y && mouseY < removeRect.y + removeRect.height) {
                    //console.log("Remove")
                    updateNoteCategory(selectedNote.id, selectedNote.category, "remove")
                }
                selectedNote = null
                return false;
            });
        })

        noteBoardListKeep.innerHTML = ""
        noteBoardListImprove.innerHTML = ""
        noteBoardListRemove.innerHTML = ""

        list.forEach((note, index) => {
            const noteItem = document.createElement("div")
            noteItem.id = index + ""
            noteItem.classList.add("board-note-item")
            noteItem.setAttribute('draggable', 'true')
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

            // Drag item functions
            noteItem.addEventListener('dragstart', e => {
                noteItem.style.opacity = '0.3';
                selectedNote = note
            });
            noteItem.addEventListener('dragend', e => {
                noteItem.style.opacity = '1';
            });


            // Arrows functions
            const boardNoteItemLeftBtn = noteItem.querySelector(".board-note-item__moveBtn--left")
            const boardNoteItemRightBtn = noteItem.querySelector(".board-note-item__moveBtn--right")

            boardNoteItemLeftBtn.addEventListener('click', () => {
                if(note.category == "improve") {
                    updateNoteCategory(note.id, note.category, "keep")
                }

                if(note.category == "remove") {
                    updateNoteCategory(note.id, note.category, "improve")
                }
            })

            boardNoteItemRightBtn.addEventListener('click', () => {
                if(note.category == "keep") {
                    updateNoteCategory(note.id, note.category, "improve")
                }

                if(note.category == "improve") {
                    updateNoteCategory(note.id, note.category, "remove")
                }
            })

            
            // Item settings menu
            const boardNoteItemDotsBtn = noteItem.querySelector(".board-note-item__dotsBtn")
            const boardNoteItemSettings = noteItem.querySelector(".board-note-item__settings")

            document.addEventListener('click', (event) => {
                if (event.target == boardNoteItemDotsBtn) {
                    boardNoteItemSettings.classList.remove("board-note-item__settings--hidden")
                } else {
                    boardNoteItemSettings.classList.add("board-note-item__settings--hidden")
                }
            })

            const deleteBoardNoteItemBtn = noteItem.querySelector(".delete-board-note-item")
            deleteBoardNoteItemBtn.addEventListener('click', (e) => {
                showLoader()
                deleteNote(note.id, note.fileType)
            })
        });
    }
    getCategoryColumnsRect()
}