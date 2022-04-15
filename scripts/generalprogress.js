import { getCareerInfo } from "./modules/firestore.js";

export async function getInitialGeneralSelect(userInfo) {
    const generalselectScreen = document.querySelector(".generalselect-screen")

    if (generalselectScreen && window.location.href.includes("#generalselect")) {
        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        const generalselectScreenList = generalselectScreen.querySelector(".generalselect-screen__list")

        let currentRole = ""
        userInfo.role.forEach(role => {
            if(role === "principal" || role === "boss" || role === "admin") {
                currentRole = role
            } 
        });

        switch(currentRole) {
            case "principal":
                const careerInfo = await getCareerInfo(userInfo.principalCareer)
                generalSelectSectionTitle.innerHTML = `Progreso general<br>${careerInfo.name}`

                generalselectScreenList.innerHTML = `
                
                <div class="visualization-item">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización general</h5>
                    <a class="small-button small-button--secondary" href="#generalchart?career_${careerInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos a <span style="font-weight: 600;">nivel global</span> sobre los <span style="font-weight: 600;">docentes</span> del programa <span style="font-weight: 600;">${careerInfo.name}</span>.
                    </p>
                    </section>
                </div>
                <div class="visualization-item visualization-item--pink">
                    <section class="visualization-item__header">
                    <h5 class="visualization-item__title">Visualización específica</h5>
                    <a class="small-button small-button--secondary" href="#generalsubjects?${careerInfo.id}">
                        <span>Ver</span>
                    </a>
                    </section>
                    <section class="visualization-item__content">
                    <p class="visualization-item__description">
                        Datos de forma <span style="font-weight: 600;">detallada</span> por cada curso del programa <span style="font-weight: 600;">${careerInfo.name}</span>.
                    </p>
                    </section>
                </div>

                `
                break;
        }
    }
}

export async function getInitialGeneralCareer() {

}