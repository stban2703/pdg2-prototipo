export function showItem(selector) {
    document.querySelector(selector).classList.remove("hidden")
}

export function hideItem(selector) {
    document.querySelector(selector).classList.add("hidden")
}