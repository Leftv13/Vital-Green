const PAGE_URL = window.location.origin; // Get the current origin (protocol + hostname + port)


const userRegex =    /^[A-Z\u00d1][a-zA-Z-ÿáéíóú\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿáéíóú\u00f1\u00d1\s]*)$/;;
const passwordRegex =    /^(?=.*[a-z])(?=.*[0-9]).{6,16}$/;
const emailRegex =       /^\S+@\S+\.\S+$/;
const phonenumberRegex = /^[0-9]{10,16}$/;

//selectores

import {createNotification} from "../components/notification.js" ;
const usernameInput = document.querySelector(`#username`);
const emailInput = document.querySelector(`#email`);
const userInput = document.getElementById(`name`)
const phoneInput = document.querySelector(`#phone`)
const passwordInput = document.querySelector(`#password`)
const confirmPasswordInput = document.querySelector(`#confirm-password`)
const formBtn = document.querySelector(`#form-btn`)
const form = document.querySelector(`#form`)



//Validacion
let userValidation = false;
let emailValidation = false;
let phoneValidation = false;
let passwordValidation = false;
let confirmPasswordValidation = false;
let countriesValidation = false;



//Funcion
//los parametros son lo que va a ser utilizado dentro de la funcion
//los argumentos son lo que podemos cambiar luego de llamar la funcion, ej los parametros son 1+3 en una 
//funcion, y yo al llamarla puedo cambiar esos parametros ej: 3+3. Esto es el argumento

const validacion = (e, validacion, element) =>{
    //e = evento
    
    const information =e.target.parentElement.children[2];
    //Si se cumple la validacion, se agrega la clase correct, se remueve la clase incorrect y la de informacion
    formBtn.disabled = !userValidation || !emailValidation || !phoneValidation || !passwordValidation || !confirmPasswordValidation ? true : false;
    // si uno de estos no cumple las condiciones, es decir no es verdadero entonces el boton queda disabled.


     if (validacion === ""){
        element.classList.remove(`incorrect`)
        information.classList.remove(`show-info`)
}else if (validacion) {
    element.classList.add(`correct`);
    element.classList.remove(`incorrect`);
    information.classList.remove(`show-info`);
} else {
    element.classList.add(`incorrect`);
    element.classList.remove(`correct`);
    information.classList.add(`show-info`);
    //si no se cumple la validacion, se anade la clase incorrect y la informacion y se remueve la clase de correct
}};



emailInput.addEventListener(`input`, e => {
emailValidation = emailRegex.test(e.target.value);
    validacion(e, emailValidation, emailInput);


});

userInput.addEventListener(`input`, e => {
    userValidation = userRegex.test(e.target.value);
        validacion(e, userValidation, userInput);


    
    
    });

// if = ? | : = else | || = or

phoneInput.addEventListener(`input`, e => {
    phoneValidation= phonenumberRegex.test(e.target.value);
    const information =e.target.parentElement.parentElement.children[2];
   
    if (phoneValidation) {
        phoneInput.classList.add(`correct`);
        phoneInput.classList.remove(`incorrect`);
        information.classList.remove(`show-info`);
    } else {
        phoneInput.classList.add(`incorrect`);
        phoneInput.classList.remove(`correct`);
        information.classList.add(`show-info`);
       
    }
    });
    
    
    passwordInput.addEventListener(`input`, e => {
        passwordValidation = passwordRegex.test(e.target.value);
            validacion(e, passwordValidation, passwordInput);
        
        })

        confirmPasswordInput.addEventListener(`input`, e => {
            confirmPasswordValidation = passwordInput.value === e.target.value;
                validacion(e, confirmPasswordValidation, confirmPasswordInput);
            
            })

            form.addEventListener('submit', async e =>{
                e.preventDefault();
                try {
                    const newUser = {
                        name: userInput.value,
                        email: emailInput.value,
                        password: passwordInput.value,
                        phoneNumber: phoneInput.value 
                    }

                    console.log(newUser);
            
                    const {data} = await axios.post(`${PAGE_URL}/api/users`, newUser);
                   
                    
                    console.log(data.message); 
                    createNotification(false, data.message); 
                    
                    setTimeout(()=>{
                        notification.innerHTML = ''
                    },5000)
            
                    userInput.value = '';
                    emailInput.value = '';
                    phoneInput.value = '';
                    passwordInput.value = '';
                    confirmPasswordInput.value = '';
            
                    
                // validation(nameValidation, false);
                // validation(emailInput, false);
                // validation(passwordValidation, false);
                // validation(matchValidation, false);
            
                } catch (error) {
                    
                    if (error.response) {
                        
                        console.log(error.response.data.message); 
                        createNotification(true, error.response.data.message);
                    } else {
                        
                        console.error("Error de red o conexión:", error.message); 
                        createNotification(true, "No se pudo conectar con el servidor. Intenta de nuevo.");
                    }
                    
                    setTimeout(()=>{
                        notification.innerHTML = ''
                    },5000)


                }
               });

  