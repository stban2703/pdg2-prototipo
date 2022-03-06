import { getNoteDetails } from "./modules/firestore.js";
import { parseTimestampToDate } from "./utils/date-format.js";

export async function renderNoteDetails() {
    const noteDetailsScreen = document.querySelector(".notesdetails-screen")

    if (noteDetailsScreen && window.location.href.includes("#notesdetails")) {
        const noteId = window.location.hash.split("?")[1]
        const note = await getNoteDetails(noteId)

        if (note) {
            const noteVideo = document.querySelector(".note__video")
            const noteImage = document.querySelector(".note__image")
            const noteAudio = document.querySelector(".note__audio")
            const noteText = document.querySelector(".note__text")

            let category = ""
            switch (note.category) {
                case 'keep':
                    category = "Mantener"
                    break;
                case 'improve':
                    category = "Mejorar"
                    break;
                case 'remove':
                    category = "Quitar"
                    break;
            }

            let fileType = ""
            switch (note.fileType) {
                case 'image':
                    fileType = "Imagen"
                    noteImage.classList.remove("hidden")
                    noteImage.setAttribute('src', note.fileReference);
                    break;
                case 'video':
                    fileType = "Video"
                    noteVideo.classList.remove("hidden")
                    noteVideo.setAttribute('src', note.fileReference)
                    break;
                case 'audio':
                    fileType = "Audio"
                    noteAudio.classList.remove("hidden")
                    noteAudio.setAttribute('src', note.fileReference)
                    break;
                case 'text':
                    fileType = "Texto"
                    noteText.classList.remove("hidden")
                    noteText.innerHTML = note.textNote
                    break;
            }

            const noteColorSection = document.querySelector(".note__color")
            noteColorSection.classList.add(`${note.category ? `note__color--${note.category}` : ''}`)

            const noteDetailsSection = document.querySelector(".note__details")
            noteDetailsSection.innerHTML = `
            <p class="note__subtitle">Nombre: <span>${note.name}</span></p>
            <p class="note__subtitle">Curso: <span>${note.subject}</span></p>
            <p class="note__subtitle">Semana: <span>${note.week}</span></p>
            <p class="note__subtitle">Categoría: <span class="note__category ${note.category ? `note__category--${note.category}` : ''}">${category}</span></p>
            <p class="note__subtitle note__subtitle-icon">Archivo: <img src="./images/noteview${note.fileType}.svg" alt=""><span>${fileType}</span></p>
            <div class="note__descriptionSection">
            ${note.descriptionText.length > 0 ? `<p class="note__subtitle">Texto descriptivo:</p>
            <p class="note__descriptionText">${note.descriptionText}</p>` : ''}
            </div>
        `

            const noteDateSection = document.querySelector(".note__date")
            noteDateSection.innerHTML = `Fecha: <span>${parseTimestampToDate(note.date)}</span>`

            const fileTypeSection = document.querySelector(".note__fileType")
            fileTypeSection.innerHTML = `${fileType}:`
        } else {
            const noteDetailsSection = document.querySelector(".note__details")
            noteDetailsSection.innerHTML = `<p class="note__subtitle">No se encontró esta anotación</span></p>`
        }
    }
}