import { deleteNote, updateNoteCategory } from "./modules/firestore.js";
import { parseTimestampToDate } from "./utils/date-format.js";
import { getCategoryColumnsRect, handleDragEnter, handleDragLeave, handleDragOver, improveRect, keepRect, mouseX, mouseY, removeRect } from "./utils/drag.js";
import { showLoader } from "./utils/loader.js";

let selectedBoardNote = null

export async function renderNotesBoard(userId, list) {
    const noteBoard = document.querySelector('.note-board')

    if (noteBoard) {
        const allNoteList = noteBoard.querySelectorAll(".note-board__list")
        const noteBoardListKeep = noteBoard.querySelector(".note-board__list--keep")
        const noteBoardListImprove = noteBoard.querySelector(".note-board__list--improve")
        const noteBoardListRemove = noteBoard.querySelector(".note-board__list--remove")

        function handleDrop(event) {
            event.stopPropagation(); // stops the browser from redirecting.
            if (mouseX > keepRect.x && mouseX < keepRect.x + keepRect.width &&
                mouseY > keepRect.y && mouseY < keepRect.y + keepRect.height) {
                //console.log("Keep")
                try {
                    updateNoteCategory(userId, selectedBoardNote.id, selectedBoardNote.category, "keep")
                } catch (error) {
                    console.log(error)
                }
            }

            if (mouseX > improveRect.x && mouseX < improveRect.x + improveRect.width &&
                mouseY > improveRect.y && mouseY < improveRect.y + improveRect.height) {
                //console.log("Improve")
                try {
                    updateNoteCategory(userId, selectedBoardNote.id, selectedBoardNote.category, "improve")
                } catch (error) {
                    console.log(error)
                }
            }

            if (mouseX > removeRect.x && mouseX < removeRect.x + removeRect.width &&
                mouseY > removeRect.y && mouseY < removeRect.y + removeRect.height) {
                //console.log("Remove")
                try {
                    updateNoteCategory(userId, selectedBoardNote.id, selectedBoardNote.category, "remove")
                } catch (error) {
                    console.log(error)
                }
            }
            selectedBoardNote = null
            return false;
        }

        allNoteList.forEach(e => {
            e.removeEventListener('dragenter', handleDragEnter);
            e.removeEventListener('dragover', handleDragOver);
            e.removeEventListener('dragleave', handleDragLeave);
            e.removeEventListener('drop', handleDrop);
        })

        // Drop items on columns functions
        allNoteList.forEach(e => {
            e.addEventListener('dragenter', handleDragEnter);
            e.addEventListener('dragover', handleDragOver);
            e.addEventListener('dragleave', handleDragLeave);
            e.addEventListener('drop', handleDrop);
        })

        noteBoardListKeep.innerHTML = ""
        noteBoardListImprove.innerHTML = ""
        noteBoardListRemove.innerHTML = ""

        if (list.length > 0) {
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
                        <li class="board-note-item__settings-item delete-board-note-item">
                            <img class="board-note-item__settings-item__normal-icon" src="./images/deletenoteicon.svg">
                            <img class="board-note-item__settings-item__hover-icon" src="./images/deletenoteiconwhite.svg">
                            <span>Eliminar</span></li>
                        <li class="board-note-item__settings-item">
                            <img class="board-note-item__settings-item__normal-icon" src="./images/editicon.svg">
                            <img class="board-note-item__settings-item__hover-icon" src="./images/editiconwhite.svg">
                            <span>Editar</span>
                        </li>
                    </ul>
                    <section class="board-note-item__header">
                        <img class="board-note-item__type" src="./images/board${note.fileType}type-${note.category}.svg" alt="">
                        <h4 class="board-note-item__title">${note.name}</h4>
                        <button class="board-note-item__dotsBtn" style="background-image: url('./images/3dots.svg');">
                            
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
                    selectedBoardNote = note
                });
                noteItem.addEventListener('dragend', e => {
                    noteItem.style.opacity = '1';
                });


                // Arrows functions
                const boardNoteItemLeftBtn = noteItem.querySelector(".board-note-item__moveBtn--left")
                const boardNoteItemRightBtn = noteItem.querySelector(".board-note-item__moveBtn--right")

                boardNoteItemLeftBtn.addEventListener('click', () => {
                    if (note.category == "improve") {
                        updateNoteCategory(userId, note.id, note.category, "keep")
                    }

                    if (note.category == "remove") {
                        updateNoteCategory(userId, note.id, note.category, "improve")
                    }
                })

                boardNoteItemRightBtn.addEventListener('click', () => {
                    if (note.category == "keep") {
                        updateNoteCategory(userId, note.id, note.category, "improve")
                    }

                    if (note.category == "improve") {
                        updateNoteCategory(userId, note.id, note.category, "remove")
                    }
                })


                // Item settings menu
                const boardNoteItemDotsBtn = noteItem.querySelector(".board-note-item__dotsBtn")
                const boardNoteItemSettings = noteItem.querySelector(".board-note-item__settings")

                boardNoteItemDotsBtn.addEventListener('click', () => {
                    boardNoteItemSettings.classList.toggle("board-note-item__settings--hidden")
                    boardNoteItemDotsBtn.classList.toggle("board-note-item__dotsBtn--activated")
                })

                /*document.addEventListener('click', (event) => {
                    if (event.target == boardNoteItemDotsBtn) {
                        boardNoteItemSettings.classList.remove("board-note-item__settings--hidden")
                    } else {
                        boardNoteItemSettings.classList.add("board-note-item__settings--hidden")
                    }
                })*/

                const deleteBoardNoteItemBtn = noteItem.querySelector(".delete-board-note-item")
                deleteBoardNoteItemBtn.addEventListener('click', (e) => {
                    showLoader()
                    console.log(note.id)
                    deleteNote(userId, note.id, note.fileType)
                })
            });
        } else {
            noteBoardListImprove.innerHTML = `
            <div class="board-empty-item">
                <p class="board-empty-item__message">Aún no tienes anotaciones agregadas</p>
                <p class="board-empty-item__tip">Si deseas <span style="font-weight: 600;">agregar una anotación</span> da click en el botón de “Crear anotación”</p>
            </div>
            `   
        }
    }
    getCategoryColumnsRect()
}