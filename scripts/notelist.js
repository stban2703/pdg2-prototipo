import { parseTimestampToDate } from "./utils/date-format.js";

export async function renderNotesListView(list) {
    const noteList = document.querySelector(".note-list")

    if (noteList) {
        const noteListBody = noteList.querySelector(".note-list__body")
        noteListBody.innerHTML = ``

        list.forEach((note, index) => {

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
            

            const notelistRow = document.createElement("tr")
            notelistRow.className = "note-list__bodyRow note-list__row"
            notelistRow.innerHTML = `
                    <td class="note-list__column">
                        <div class="note-list__number">
                            <span>${index + 1}</span>
                        </div>
                    </td>
                    <td class="note-list__title note-list__title--long">
                        <span>${note.name}</span>
                    </td>
                    <td class="note-list__title note-list__title--long">
                        <span>${note.subject}</span>
                    </td>
                    <td class="note-list__title note-list__title--nowrap">
                        <span>${parseTimestampToDate(note.date)}</span>
                    </td>
                    <td class="note-list__title">
                        <span style="margin-left: 1rem">${note.week}</span>
                    </td>
                    <td class="note-list__column">
                        <div class="note-list__category note-list__category--${note.category}">
                            ${category}
                        </div>
                    </td>
                    <td class="note-list__column">
                        <a class="board-note-item__editBtn board-edit-button" href="#notesdetails?${note.id}">
                            <span>Ver detalle</span>
                        </a>
                    </td>
            `
            noteListBody.appendChild(notelistRow)
        });
    }
}