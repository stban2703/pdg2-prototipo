export const localStorage = window.localStorage;
export const localUser = JSON.parse(ls.getItem('currentuser'))
export const localSubjects = JSON.parse(ls.getItem('subjectList'))
export const localPeriod = JSON.parse(ls.getItem('currentPeriod'))