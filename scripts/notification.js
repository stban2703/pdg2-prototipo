export function displayNotificationWindow() {
    const notificationWindow = document.querySelector(".notification-window")
    const notificationHeader = document.querySelector(".notificationHeader")

    if (notificationHeader && notificationWindow) {
        notificationHeader.addEventListener('click', () => {
            notificationWindow.classList.add("notification-window--show")
            document.addEventListener('click', onClickOutsideNotificationWindow);
        })
    }
}

function onClickOutsideNotificationWindow(event) {
    const notificationWindow = document.querySelector(".notification-window")
    const notificationHeader = document.querySelector(".notificationHeader")

    if (notificationWindow) {
        let isClickInsideElement = notificationWindow.contains(event.target);
        let isClickInsideBell = notificationHeader.contains(event.target)

        if (isClickInsideElement || isClickInsideBell) {
            // Nothing happened
        } else {
            notificationWindow.classList.remove("notification-window--show")
            document.removeEventListener('click', onClickOutsideNotificationWindow)
        }
    }
}