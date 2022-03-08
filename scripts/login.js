import { signIn } from "./modules/auth.js"
import { showLoader } from "./utils/loader.js"

const signInForm = document.querySelector(".signInForm")

signInForm.addEventListener("submit", function (event) {
    event.preventDefault()
    const email = signInForm.email.value
    const pass = signInForm.pass.value
    if (email != "" && pass != "") {
        showLoader()
        signIn(email, pass)
    } else {
        alert("Por favor, completa los campos")
    }
})