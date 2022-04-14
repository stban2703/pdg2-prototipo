export function getSubjectFromId(id, userSubjects) {
    const subject = userSubjects.find((s) => {
        return s.id === id
    })
    return subject
}