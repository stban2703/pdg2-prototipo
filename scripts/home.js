export function renderSubjectListHome(subjectList) {
    const homescreenSubjectList = document.querySelector(".home-screen__subjectList")

    if(homescreenSubjectList) {
        homescreenSubjectList.innerHTML = ``
        subjectList.forEach(subject => {
            const subjectThumbnail = document.createElement('div')
            subjectThumbnail.className = "subject-thumbnail"
            subjectThumbnail.innerHTML = `
            <section class="subject-thumbnail__info">
                <section class="subject-thumbnail__icon-title">
                    <img class="subject-thumbnail__icon" src="./images/subjectgenericicon.svg" alt="">
                    <h5 class="subject-thumbnail__title">${subject.name}</h5>
                </section>
                <p class="subject-thumbnail__percent">
                    100%
                </p>
            </section>
            <section class="subject-thumbnail__progress">
                <p class="subject-thumbnail__subtitle">Memorando completado</p>
                <div class="subject-thumbnail__progressBar">
                    <div class="subject-thumbnail__currentBar">
                    </div>
                </div>
            </section>
            `
            homescreenSubjectList.appendChild(subjectThumbnail)
        });
    }
}

