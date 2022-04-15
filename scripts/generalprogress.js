import { getCareerInfo, getCareerSubjects } from "./modules/firestore.js";
import { hideLoader, showLoader } from "./utils/loader.js";
import { sortByAlphabeticAscending, sortByAlphabeticDescending } from "./utils/sort.js";

export async function getInitialGeneralSelect(userInfo) {
    const generalselectScreen = document.querySelector(".generalselect-screen--select")

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


// Subject general
export async function getInitialGeneralSubjets() {
    const generalselectScreenSubjects = document.querySelector(".generalselect-screen--subjects")
    if (generalselectScreenSubjects && window.location.href.includes("#generalsubjects")) {
        showLoader()
        const careerId = window.location.href.split("?")[1]
        const careerInfo = await getCareerInfo(careerId)
        const subjects = await getCareerSubjects(careerId)
        hideLoader()

        const generalSelectSectionTitle = document.querySelector(".section-banner__title")
        generalSelectSectionTitle.innerHTML = `Progreso general<br>${careerInfo.name}`

        const generalSelectSectionDescription = document.querySelector(".generalselect-screen__description")
        generalSelectSectionDescription.innerHTML = `Selecciona el <span style="font-weight: 600;">curso de ${careerInfo.name}</span> que deseas observar el progreso`

        const subjectsForm = generalselectScreenSubjects.querySelector(".memoselectsubject-screen__controls")
        careerInfo.groups.forEach(group => {
            const option = document.createElement('option')
            option.value = group
            option.innerHTML = group
            subjectsForm.group.appendChild(option)
        })

        const copy = [...subjects].sort(sortByAlphabeticAscending)
        renderGeneralSubjects(copy)
        onSortFilterGeneralSubjectListener(subjects)
    }
}

function onSortFilterGeneralSubjectListener(subjects) {
    const generalSubjectsSettingsForm = document.querySelector(".memoselectsubject-screen__controls--general")

    if (window.location.href.includes("#generalsubjects") && generalSubjectsSettingsForm) {
        const subjectsSortSelect = generalSubjectsSettingsForm.alphabetic
        const subjectsFilterSelect = generalSubjectsSettingsForm.group

        generalSubjectsSettingsForm.addEventListener('input', () => {
            sortFilterGeneralSubjects(subjects, subjectsSortSelect, subjectsFilterSelect)
        })
    }
}

function sortFilterGeneralSubjects(subjects, subjectSort, groupFilter) {
    let filterCopy = [...subjects]

    if (subjectSort.value.length > 0) {
        if (subjectSort.value == "ascending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticAscending)
        } else if (subjectSort.value = "descending") {
            filterCopy = [...filterCopy].sort(sortByAlphabeticDescending)
        }
    }

    if (groupFilter.value.length > 0) {
        filterCopy = [...filterCopy].filter(e => {
            if (e.group == groupFilter.value) {
                return true
            }
        })
    }
    renderGeneralSubjects(filterCopy)
}

function renderGeneralSubjects(list) {
    const generalSubjectListContainer = document.querySelector(".generalselect-screen__list--subjects")
    generalSubjectListContainer.innerHTML = ``

    list.forEach(subject => {
        const subjectItem = document.createElement("div")
        subjectItem.className = "memo-subject"
        subjectItem.innerHTML = `
            <h5 class="memo-subject__title">${subject.name}</h5>
            <a class="memo-subject__button small-button small-button--secondary" href="#generalspecific?${subject.id}">
                <span>Ver</span>
            </a>
            `
        generalSubjectListContainer.appendChild(subjectItem)
    })
}


// Render specific general