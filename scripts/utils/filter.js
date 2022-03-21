export function filterBySubject(list, filterValue) {
    list.filter(e => {
        if(e.subject == filterValue) {
            return true
        }
    })
    return list
}