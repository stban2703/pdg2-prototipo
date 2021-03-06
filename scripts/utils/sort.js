export function sortByWeek(a, b) {
    return a.week - b.week;
}

export function sortByDateAscending(a, b) {
    return a.date - b.date;
}

export function sortByDateDescending(a, b) {
    return b.date - a.date;
}

export function sortByAlphabeticAscending(a, b) {
    if (a.name > b.name) {
        return 1;
    }
    if (a.name < b.name) {
        return -1;
    }
    return 0;
}

export function sortByAlphabeticDescending(a, b) {
    if (a.name < b.name) {
        return 1;
    }
    if (a.name > b.name) {
        return -1;
    }
    return 0;
}

export function sortByIndex(a, b) {
    return parseInt(a.index) - parseInt(b.index);
}

export function sortByQuestionIndex(a, b) {
    return a.questionIndex - b.questionIndex
}