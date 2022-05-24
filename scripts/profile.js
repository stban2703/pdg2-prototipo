import { logOut } from "./modules/auth.js";
import { setLocalStorage } from "./utils/ls.js";


export function renderProfileInfo(userInfo, currentRole) {
    const profileScreen = document.querySelector(".profile-screen")

    if (profileScreen) {

        let roleName = "Docente"

        switch (currentRole) {
            case "leader":
                roleName = "Líder de bloque"
                break;

            case "principal":
                roleName = "Director de programa"
                break;

            case "boss":
                roleName = "Jefe de departamento"
                break;

            case "admin":
                roleName = "Directora MECA"
                break;
        }

        const profileInfoContainer = profileScreen.querySelector(".profile-info")
        profileInfoContainer.innerHTML = `
        <section class="profile-info__iconSection">
            <div class="profile-info__icon${currentRole !== 'teacher' ? ' profile-info__icon--special' : ''}">
                <img src="./images/${currentRole === 'teacher' ? 'teacher' : 'special'}roleicon.svg" alt="">
            </div>
            <h5 class="profile-info__role">${roleName}</h5>
        </section>
        <section class="profile-info__detailSection">
            <h5 class="profile-info__name">${userInfo.name} ${userInfo.lastname}</h5>
            <p class="profile-info__department">Departamento de Diseño de Innovación</p>
            <p class="profile-info__email">${userInfo.email}</p>
            <button class="small-button small-button--secondary profileLogoutButton">
                <span>Cerrar sesión</span>
            </button>
        </section>
        `

        const profileLogoutButton = document.querySelector(".profileLogoutButton")
        profileLogoutButton.addEventListener('click', () => {
            logOut()
        })
    }
}

export function renderAlternativeRole(userInfo, currentRole) {
    const profileScreen = document.querySelector(".profile-screen")

    if (profileScreen) {
        const roleIndex = userInfo.role.findIndex(role => {
            return role === currentRole
        })

        let alternativeRole = ""

        if (roleIndex === userInfo.role.length - 1) {
            alternativeRole = userInfo.role[0]
        } else {
            alternativeRole = userInfo.role[roleIndex + 1]
        }

        let roleName = "Docente"

        switch (alternativeRole) {
            case "leader":
                roleName = "Líder de bloque"
                break;

            case "principal":
                roleName = "Director de programa"
                break;

            case "boss":
                roleName = "Jefe de departamento"
                break;

            case "admin":
                roleName = "Directora MECA"
                break;
        }

        if (userInfo.role.length > 1) {
            const alternativeRoleItem = document.createElement("div")
            alternativeRoleItem.className = "profile-select-role"
            alternativeRoleItem.innerHTML = `
            <section class="profile-select-role__iconSection">
                <div class="profile-select-role__icon${alternativeRole !== 'teacher' ? ' profile-select-role__icon--special' : ''}">
                    <img src="./images/${alternativeRole !== 'teacher' ? 'special' : 'teacher'}roleicon.svg" alt="">
                </div>
            </section>
            <section class="profile-select-role__infoSection">
                <p class="profile-select-role__title">${roleName}</p>
                <button class="small-button small-button--secondary selectRoleButton">
                    <span>Cambiar</span>
                </button>
            </section>
            `
            document.querySelector(".profile-screen__alternativeRoles").appendChild(alternativeRoleItem)

            const changeRoleButton = alternativeRoleItem.querySelector(".selectRoleButton")
            changeRoleButton.addEventListener('click', () => {
                setLocalStorage('currentRole', alternativeRole)
                window.location.reload()
            })
        } else {
            document.querySelectorAll(".profile-screen__section")[1].classList.add("hidden")
        }
    }
}