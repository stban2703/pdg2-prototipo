import { parseTimestampToDate } from "./utils/date-format.js"

export async function renderNotesWeek(list) {
    const noteWeek = document.querySelector(".note-week")

    const noteWeekList = document.querySelectorAll(".note-week__list")
    noteWeekList.forEach(elem => {
        elem.innerHTML = ``
    })

    if(noteWeek) {
        list.forEach((note) => {
            const noteItem = document.createElement("div")
            noteItem.classList.add("week-note-item")
            noteItem.innerHTML = `
            <div class="week-note-item__color">
            </div>
            <section class="week-note-item__info">
                <section class="week-note-item__header">
                    <img class="week-note-item__type"
                        src="./images/board${note.fileType}type-${note.category}.svg" alt="">
                    <h4 class="week-note-item__title">${note.name}</h4>
                </section>
                <div class="week-note-item__summary">
                    <section class="week-note-item__details">
                        <p class="week-note-item__subtitle">Curso: <span>${note.subject}</span></p>
                        <p class="week-note-item__subtitle">Fecha:
                            <span>${parseTimestampToDate(note.date)}</span>
                        </p>
                        <p class="week-note-item__subtitle">Semana: <span>${note.week}</span></p>
                    </section>
                    <section class="week-note-item__controls">
                        <a class="week-note-item__editBtn board-edit-button" href='#notesdetails?${note.id}'>
                            <p>Ver detalle</p>
                        </a>
                    </section>
                </div>
            </section>
            `

            switch (note.category) {
                case "keep":
                    noteItem.classList.add("week-note-item--keep")
                    break;
                case "improve":
                    noteItem.classList.add("week-note-item--improve")
                    break;
                case "remove":
                    noteItem.classList.add("week-note-item--remove")
                    break;
            }

            document.querySelector(`#note-week-${note.week}`).appendChild(noteItem)
        })

        noteWeekList.forEach(elem => {
            if(elem.childElementCount === 0) {
                elem.innerHTML = `
                <div class="week-note-item week-note-item--empty">
                    <section class="week-note-item__emptyContent">
                        <img src="./images/emptyweekicon.svg" alt="">
                        <p class="week-note-item__emptyText">No hay anotaciones para esta semana</p>
                    </section>
                </div>
                `
            }
        })
    }
}