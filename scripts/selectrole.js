import { localUser, setLocalStorage } from "./utils/ls.js";

const selectRoleContainer = document.querySelector(".signinup-screen__selectRole")
selectRoleContainer.innerHTML = ""

const userNameContainer = document.querySelector(".signinup-screen__userName")
userNameContainer.innerHTML = localUser.name

localUser.role.forEach(role => {
    const roleItem = document.createElement('div')
    roleItem.className = "select-role"
    roleItem.style.backgroundImage = 'url(images/circlepatternrole.svg)'
    let roleName = "teacher"
    let roleSrc = "teacher"

    switch (role) {
        case "teacher":
            roleName = "Docente"
            roleSrc = "teacher"
            break;

        case "leader":
            roleName = "Líder de bloque"
            roleSrc = "special"
            break;

        case "principal":
            roleName = "Director de programa"
            roleSrc = "special"
            break;

        case "boss":
            roleName = "Jefe de departamento"
            roleSrc = "special"
            break;
    }

    roleItem.innerHTML = `
        <section class="select-role__info">
            <div class="select-role__icon${role !== 'teacher' ? ' select-role__icon--special' : ''}">
                <img src="./images/${roleSrc}roleicon.svg" alt="">
            </div>
            <h5 class="select-role__title">${roleName}</h5>
        </section>
        <section class="select-role__controls">
            <button class="small-button small-button--secondary selectRoleButton">
                <span>Seleccionar</span>
            </button>
        </section>
    `
    selectRoleContainer.appendChild(roleItem)

    const selectRoleButton = roleItem.querySelector(".selectRoleButton")
    selectRoleButton.addEventListener('click', () => {
        setLocalStorage('currentRole', role)
        window.location = "index.html"
    })
});
