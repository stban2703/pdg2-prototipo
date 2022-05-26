export function renderHelp(currentRole) {
    const helpScreen = document.querySelector(".help-screen")
    
    if(helpScreen && window.location.href.includes("#help")) {
        const helpItem = document.querySelector(`.help-screen__${currentRole}`)
        helpItem.classList.remove("hidden")
    }
}