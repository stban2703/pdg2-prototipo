import { signUp } from "./modules/auth.js"

const signUpForm = document.querySelector('.signUpForm')

signUpForm.addEventListener('submit', function(event) {
    event.preventDefault()
    const name = signUpForm.fullname.value
    const email = signUpForm.email.value
    const pass = signUpForm.pass.value
    console.log(name + " " + email + " " + pass)
    if(name != "" && email != "" && pass != ""){
        signUp(email, pass, name)
    }
})