export const ls = window.localStorage;
export const localUser = JSON.parse(ls.getItem('currentuser'))
export const localSubjects = JSON.parse(ls.getItem('subjectList'))
export const localPeriod = JSON.parse(ls.getItem('currentPeriod'))
export const localRole = JSON.parse(ls.getItem('currentRole'))

export function setLocalStorage(tag, value) {
    ls.setItem(tag, value)
}