export function changeFontSize() {
    const settingItemChangeFontSize = document.querySelector(".setting-item__changeFontSize")

    if (settingItemChangeFontSize && window.location.href.includes("#settings")) {
        const increaseFontSizeButton = settingItemChangeFontSize.querySelector(".increaseFontButton")
        const reduceFontSizeButton = settingItemChangeFontSize.querySelector(".reduceFontButton")

        increaseFontSizeButton.addEventListener('click', () => {
            const html = document.querySelector("html")
            const style = window.getComputedStyle(html, null).getPropertyValue('font-size');
            const fontSize = parseFloat(style);

            if (fontSize < 20) {
                html.style.fontSize = (fontSize + 0.5) + "px"
            }
        })

        reduceFontSizeButton.addEventListener('click', () => {
            const html = document.querySelector("html")
            const style = window.getComputedStyle(html, null).getPropertyValue('font-size');
            const fontSize = parseFloat(style);

            if (fontSize > 1) {
                html.style.fontSize = (fontSize - 0.5) + "px"
            }
        })
    }
}
