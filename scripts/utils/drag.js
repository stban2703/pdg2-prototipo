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

// Item
/*export function handleDragStart(e) {
    //e.dataTransfer.setData('text/plain', e.target.id);
    //this.style.opacity = '0';
}*/

export function handleDragEnd(e) {
    this.style.opacity = '1';
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

/*export function handleDrop(e) {
    e.stopPropagation(); // stops the browser from redirecting.

    if (mouseX > keepRect.x && mouseX < keepRect.x + keepRect.width &&
        mouseY > keepRect.y && mouseY < keepRect.y + keepRect.height) {
        //const id = e.dataTransfer.getData('text/plain');
        console.log("Keep")
    }

    if (mouseX > improveRect.x && mouseX < improveRect.x + improveRect.width &&
        mouseY > improveRect.y && mouseY < improveRect.y + improveRect.height) {
        //const id = e.dataTransfer.getData('text/plain');
        console.log("Improve")
    }

    if (mouseX > removeRect.x && mouseX < removeRect.x + removeRect.width &&
        mouseY > removeRect.y && mouseY < removeRect.y + removeRect.height) {
        //const id = e.dataTransfer.getData('text/plain');
        console.log("Remove")
    }
    return false;
}*/
