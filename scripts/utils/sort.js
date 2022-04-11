export function sortByWeek(a, b) {
    return a.week - b.week;
}

export function sortByDate(a, b) {
    return a.date - b.date;
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