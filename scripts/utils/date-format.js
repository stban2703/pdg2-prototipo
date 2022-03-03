export function parseTimestampToDate(timestamp) {
    let date = new Date(timestamp)
    let day = date.getDate()
    let monthList = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    let month = monthList[date.getMonth()]
    let year = date.getFullYear()
    return `${day} ${month} ${year}`
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