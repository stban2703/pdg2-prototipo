export function showLoader() {
    const loader = document.querySelector('.loader')
    loader.classList.remove('hidden')
}

export function hideLoader() {
    const loader = document.querySelector('.loader')
    loader.classList.add('hidden')
}