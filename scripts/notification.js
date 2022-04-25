import { parseTimestampToDate } from "./utils/date-format.js";
import { sortByDateDescending } from "./utils/sort.js";
import { asteriskToBold } from "./utils/text-format.js";

export function displayNotificationCounter(notificationList) {
    const notificationCounterContainer = document.querySelector(".header__notificationNumber")
    const notificationCounter = document.querySelector(".header__notificationNumber span")
    if (notificationCounter) {
        const unreadList = [...notificationList].filter((elem) => {
            return elem.status === "unread"
        })
        notificationCounter.innerHTML = unreadList.length
        if (unreadList.length > 0) {
            notificationCounterContainer.classList.remove("hidden")
        } else {
            notificationCounterContainer.classList.add("hidden")
        }
    }
}

export function renderNotificationWindowList(notificationList) {
    const notificationWindowList = document.querySelector(".notification-window__list")
    if (notificationWindowList) {
        const copy = [...notificationList].sort(sortByDateDescending)
        if (copy.length > 0) {
            notificationWindowList.innerHTML = ``
            copy.forEach(elem => {
                const item = document.createElement("div")
                item.className = `notification-item${elem.status === 'read' ? ' notification-item--read' : ''}`

                let previewMessage = ""

                switch (elem.type) {
                    case "meeting":
                        previewMessage = `
                        ¡Recuerda que la reunión reflexiva es esta semana el día ${parseTimestampToDate(elem.date)} a las ${elem.time}!
                        `
                        break;

                    case "note":
                        previewMessage = `
                        ¡Recuerda que tienes que mejorar estos aspectos!
                        `
                        break;

                    case "advance":
                        previewMessage = `
                        ¡Recuerda avanzar con tu memorando, estamos en semana ${elem.week}!
                        `
                        break;

                    case "memo":
                        previewMessage = `
                        ¡Recuerda completar tu memorando reflexivo!
                        `
                        break;

                    default:
                        previewMessage = `
                    Vista previa de una notificación en la ventana
                    `
                        break;
                }

                item.innerHTML = `
            <p class="notification-item__summary">
                ${previewMessage}
            </p>
            <a href="#notification?${elem.id}" class="small-button small-button--secondary">
                <span>Ver más</span>
            </a>
            `
                notificationWindowList.appendChild(item)
            })
        }
    }
}

export function renderNotificationScreenList(notificationList) {
    const notificationScreenList = document.querySelector(".notification-screen__listContainer")
    if (notificationScreenList) {
        const copy = [...notificationList].sort(sortByDateDescending)

        if (copy.length > 0) {
            notificationScreenList.innerHTML = ``
            copy.forEach(elem => {
                const item = document.createElement("div")
                item.className = `notification-item${elem.status === 'read' ? ' notification-item--read' : ''}`

                const notificationId = window.location.hash.split("?")[1]
                if (elem.id === notificationId) {
                    item.classList.add("notification-item--selected")
                }

                let previewMessage = ""

                switch (elem.type) {
                    case "meeting":
                        previewMessage = `
                        ¡Recuerda que la reunión reflexiva es esta semana el día ${parseTimestampToDate(elem.date)} a las ${elem.time}!
                    `
                        break;

                    case "note":
                        previewMessage = `¡Recuerda que tienes que mejorar estos aspectos!`
                        break;

                    case "advance":
                        previewMessage = `
                        ¡Recuerda avanzar con tu memorando, estamos en semana ${elem.week}!
                        `
                        break;

                    case "memo":
                        previewMessage = `
                        ¡Recuerda completar tu memorando reflexivo!
                        `
                        break;

                    default:
                        previewMessage = `
                    Vista previa de una notificación en la ventana
                    `
                        break;
                }

                item.innerHTML = `
            <p class="notification-item__summary">
                ${previewMessage}
            </p>
            <a href="#notification?${elem.id}" class="small-button small-button--secondary">
                <span>seleccionar</span>
            </a>
            `
                notificationScreenList.appendChild(item)
            })
        }
    }
}

export function renderNotificationDetails(notificationList) {
    const notificationDetailsSection = document.querySelector(".notification-screen__details")

    if (notificationDetailsSection) {
        const notificationId = window.location.hash.split("?")[1]
        console.log(notificationId)
        const info = notificationList.find(elem => {
            return elem.id === notificationId
        })

        if (info) {
            const notificationWindow = document.createElement("div")
            notificationWindow.className = "notification-screen__detailsWindow"
            let message = ""
            let addionalButton = ""
            notificationDetailsSection.innerHTML = ``

            switch (info.type) {
                case 'meeting':
                    message = asteriskToBold(`Tu *bloque ${info.group}* ha programado una *reunión reflexiva* para el día *${parseTimestampToDate(info.date)}* a las *${info.time}* ¡Te esperamos, para juntos seguir *mejorando la calidad* de la *educación* brindada por la universidad!`)

                    addionalButton = `
                <a href="#meetingdetails?${info.meetingId}" class="small-button small-button--secondary">
                    <span>Ver detalle de la reunión</span>
                </a>
                `
                    break;
                case 'note':
                    message = asteriskToBold(`Es muy importante estar una *mejora constante* por lo cual te recomendamos revisar tus *anotaciones* clasificados con la etiqueta de *“Mejorar”*`)

                    addionalButton = `
                <a href="#notes" class="small-button small-button--secondary">
                    <span>Ir a tablero</span>
                </a>
                `
                    break;

                case "memo":
                    message = asteriskToBold(`
                    Nos encontramos en el *período límite* para enviar el *memorando relfexivo diligenciado*, por lo cual te recomendamos realizarlo lo más pronto posible. 

                    ¡Recuerda que este *proceso de mejora* requiere de la ayuda de todos los docentes!
                        `)
                    break;

                case "advance":
                    message =
                        asteriskToBold(`
                    Nos encontramos en la *semana ${info.week}* del semestre, te recomendamos que avances con tu espacio de reflexión, siempre es bueno adelantar trabajo :)
                        `)
                    break;
            }

            notificationWindow.innerHTML = `
            <p class="notification-screen__detailsText">
                ${message}
            </p>
            <section class="notification-screen__detailsControls">
                <button class="small-button small-button--primary readNotificationButton">
                    <span>Marcar como leído</span>
                </button>
                ${addionalButton}
            </section>
        `
            notificationDetailsSection.appendChild(notificationWindow)
        }
    }
}

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
