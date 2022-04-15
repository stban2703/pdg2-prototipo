export function showLoader() {
    const loader = document.querySelector('.custom-loader')
    loader.classList.remove('hidden')
}

export function hideLoader() {
    const loader = document.querySelector('.custom-loader')
    loader.classList.add('hidden')
}