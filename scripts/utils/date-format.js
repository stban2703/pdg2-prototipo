export function parseTimestampToDate(timestamp) {
    let date = new Date(timestamp)
    let day = date.getDate()
    let monthList = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    let month = monthList[date.getMonth()]
    let year = date.getFullYear()
    return `${day} ${month} ${year}`
}

export function parseTimestampToFullDate(timestamp) {
    let date = new Date(timestamp)
    let weekDays = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
    let dayOfWeek = weekDays[date.getDay()]
    let day = date.getDate()
    let monthList = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "Noviembre", "diciembre"]
    let month = monthList[date.getMonth()]
    let year = date.getFullYear()
    return `${dayOfWeek} ${day} de ${month} del ${year}`
}

export function parseDateToTimestamp(date) {
    let timestamp = date.getTime()
    return timestamp
}

export function parseMilitaryTimeToStandard(time) {
    let timeFragments = time.split(":")
    const hours = Number(timeFragments[0])
    const minutes = Number(timeFragments[1])
    let standarHour
    if (hours > 0 && hours <= 12) {
        standarHour = "" + hours;
    } else if (hours > 12) {
        standarHour = "" + (hours - 12);
    } else if (hours === 0) {
        standarHour = "12";
    }
    let formattedMinutes = (minutes < 10) ? ":0" + minutes : ":" + minutes
    let timeValue = standarHour + formattedMinutes + (hours >= 12 ? " p.m." : " a.m.")
    return timeValue
}

export function parseDateFromPickerToTimestamp(date, time) {
    const monthList = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const dateParts = date.split(" ")
    const day = dateParts[0]
    const monthIndex = monthList.findIndex(m => {
        return m === dateParts[1]
    })
    const month = (monthIndex + 1 < 10) ? "0" + (monthIndex + 1) : "" + (monthIndex + 1)
    const year = dateParts[2]
    const stringDate = year + "-" + month + "-" + day
    const formattedDate = new Date(stringDate + "T" + time + ":00")
    const timestamp = formattedDate.getTime()
    return timestamp
}