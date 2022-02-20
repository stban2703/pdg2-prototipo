import { signUp } from "./modules/auth.js"

const signUpForm = document.querySelector('.signUpForm')

signUpForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const name = signUpForm.name.value
    const lastname = signUpForm.lastname.value
    const email = signUpForm.email.value
    const pass = signUpForm.pass.value
    const confirmpass = signUpForm.confirmpass.value
    if (name != "" && lastname != "" && email != "" && pass != "") {
        if (pass === confirmpass) {
            if (pass.length >= 8) {
                signUp(email, pass, name, lastname)
            } else {
                alert("La contraseña debe tener almenos 8 caracteres")
            }
        } else {
            alert("Las contraseñas no coinciden")
        }
    } else {
        alert("Por favor, completa todos los campos")
    }
})