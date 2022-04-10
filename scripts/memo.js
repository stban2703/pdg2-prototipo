export function renderMemoIntro(user) {
    const memoIntroTitle = document.querySelector(".memointro-screen__intro-title")
    const memoLastEdit = document.querySelector(".memo-last-edit")
    const memointroProgress = document.querySelector(".memo-intro-progress")

    if(memoIntroTitle && window.location.href.includes("#memointro")) {
        if(user.role == "admin") {
            memoIntroTitle.innerHTML = `<span style="font-weight: 600;">${user.name}</span>, si deseas editar el memorando reflexivo da click en “Activar edición”.</h5>`
            memoLastEdit.classList.remove("hidden")
            memointroProgress.classList.add("hidden")
        } else {
            memoIntroTitle.innerHTML = `<span style="font-weight: 600;">${user.name}</span>, es momento de realizar tu reflexión.</h5>`
            memoLastEdit.classList.add("hidden")
            memointroProgress.classList.remove("hidden")
        }
    }
} 