

export function renderProfileInfo(userInfo, currentRole) {
    const profileScreen = document.querySelector(".profile-screen")

    if (profileScreen) {

        let roleName = "teacher"

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
            <div class="profile-info__icon">
                <img src="./images/teacherroleicon.svg" alt="">
            </div>
            <h5 class="profile-info__role">${roleName}</h5>
        </section>
        <section class="profile-info__detailSection">
            <h5 class="profile-info__name">${userInfo.name} ${userInfo.lastname}</h5>
            <p class="profile-info__department">Departamento de Diseño de Innovación</p>
            <p class="profile-info__email">${userInfo.email}</p>
        </section>
        `
    }
}