export const localStorage = window.localStorage;
export const localUser = JSON.parse(localStorage.getItem('currentuser'))
export const localSubjects = JSON.parse(localStorage.getItem('subjectList'))
export const localPeriod = JSON.parse(localStorage.getItem('currentPeriod'))