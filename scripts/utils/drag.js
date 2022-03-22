export let mouseX
export let mouseY
export let keepRect
export let improveRect
export let removeRect

export function getCategoryColumnsRect() {
    const noteBoard = document.querySelector('.note-board')
    const noteBoardListKeep = noteBoard.querySelector(".note-board__list--keep")
    const noteBoardListImprove = noteBoard.querySelector(".note-board__list--improve")
    const noteBoardListRemove = noteBoard.querySelector(".note-board__list--remove")

    keepRect = noteBoardListKeep.getBoundingClientRect()
    improveRect = noteBoardListImprove.getBoundingClientRect()
    removeRect = noteBoardListRemove.getBoundingClientRect()
}

// Boxes
export function handleDragEnter(e) {
    e.preventDefault();
}

export function handleDragOver(e) {
    e.preventDefault()
    mouseX = e.pageX
    mouseY = e.pageY
    //console.log(mouseX + " " + mouseY)
}

export function handleDragLeave(e) {
}
