import { signIn } from "./modules/auth.js"

const signInForm = document.querySelector(".signInForm")

signInForm.addEventListener("submit", function (event) {
    event.preventDefault()
    const email = signInForm.email.value
    const pass = signInForm.pass.value
    if (email != "" && pass != "") {
        signIn(email, pass)
    } else {
        alert("Por favor, completa los campos")
    }
})