

export function getInitialAccomplishmentList(userInfo) {
    const accomplishmentScreenContentList = document.querySelector(".accomplishment-screen__content--list")

    if(accomplishmentScreenContentList && window.location.href.includes("#accomplishmentlist")) {
        const view = window.location.hash.split("?")[1].split("_")[0]
        const viewId = window.location.hash.split("?")[1].split("_")[1]
        
        const sectionTitle = document.querySelector(".section-banner__title")

        userInfo.role.forEach(role => {
            if(role === "leader") {
                sectionTitle.innerHTML = `Cumplimiento de tu bloque<br>de ${userInfo.leaderGroup}`
            }
        });
    }
}