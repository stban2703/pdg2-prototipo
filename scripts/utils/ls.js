export const ls = window.localStorage;
export const localUser = JSON.parse(ls.getItem('currentuser'))
export const localSubjects = JSON.parse(ls.getItem('subjectList'))
export const localPeriod = JSON.parse(ls.getItem('currentPeriod'))
export const localRole = ls.getItem('currentRole')
export const localFontSize = ls.getItem('currentFontSize')

export function setLocalStorage(tag, value) {
    ls.setItem(tag, value)
}