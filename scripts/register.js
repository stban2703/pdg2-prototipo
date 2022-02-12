import { signUp } from "./modules/auth.js"

const signUpForm = document.querySelector('.signUpForm')

signUpForm.addEventListener('submit', function(event) {
    event.preventDefault()
    const name = signUpForm.name.value
    const lastname = signUpForm.lastname.value
    const email = signUpForm.email.value
    const pass = signUpForm.pass.value
    if(name != "" && lastname != "" && email != "" && pass != ""){
        signUp(email, pass, name, lastname)
    }
})