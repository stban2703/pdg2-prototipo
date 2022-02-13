import { logOut } from "./modules/auth.js"

const logoutButton = document.querySelector('.logoutButton')

logoutButton.addEventListener('click', function() {
    logOut()
})