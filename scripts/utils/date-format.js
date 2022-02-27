export function parseTimestampToDate(timestamp) {
    let date = new Date(timestamp)
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    return `${day}/${month}/${year}`
}