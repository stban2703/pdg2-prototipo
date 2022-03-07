

export function onCheckbox() {
    const createMeetingMinutesForm = document.querySelector('.createmeetingminutes-form');
    const assistants = createMeetingMinutesForm.elements['assistants[]']

    createMeetingMinutesForm.addEventListener('submit', (event) => {
        event.preventDefault()
        let assistantsList = []

        assistants.forEach(e => {
            if(e.checked) {
                console.log(e.value)
            }
        })
    })
}