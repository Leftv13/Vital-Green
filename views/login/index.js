//regEx || Regular Expressions
const passwordRegex =    /^(?=.*[a-z])(?=.*[0-9]).{6,16}$/;
const emailRegex =       /^\S+@\S+\.\S+$/;


//selectores
const emailInput = document.querySelector(`#email`);
const passwordInput = document.querySelector(`#password`)
const formBtn = document.querySelector(`#form-btn`)
const form = document.querySelector(`#formLogin`)
const errorText = document.querySelector("#error-text");



//Validacion
let emailValidation = false;
let passwordValidation = false;



//Funcion
//los parametros son lo que va a ser utilizado dentro de la funcion
//los argumentos son lo que podemos cambiar luego de llamar la funcion, ej los parametros son 1+3 en una 
//funcion, y yo al llamarla puedo cambiar esos parametros ej: 3+3. Esto es el argumento

const validacion = (e, validacion, element) =>{
    //e = evento
    
    const information =e.target.parentElement.children[2];
    //Si se cumple la validacion, se agrega la clase correct, se remueve la clase incorrect y la de informacion
    formBtn.disabled = !emailValidation || !passwordValidation  ? true : false;
    // si uno de estos no cumple las condiciones, es decir no es verdadero entonces el boton queda disabled.
if (validacion) {
    element.classList.add(`correct`);
    element.classList.remove(`incorrect`);
    information.classList.remove(`show-info`);
} else {
    element.classList.add(`incorrect`);
    element.classList.remove(`correct`);
    information.classList.add(`show-info`);
    //si no se cumple la validacion, se anade la clase incorrect y la informacion y se remueve la clase de correct
}
};



emailInput.addEventListener(`input`, e => {
emailValidation = emailRegex.test(e.target.value);
    validacion(e, emailValidation, emailInput);


});


// if = ? | : = else | || = or


    
    
    passwordInput.addEventListener(`input`, e => {
        passwordValidation = passwordRegex.test(e.target.value);
            validacion(e, passwordValidation, passwordInput);
        
        })

    

        //LOGIN LOGIC

        const PAGE_URL = window.location.origin; // Get the current origin (protocol + hostname + port)


form.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();
    const user = {
      email: emailInput.value,
      password: passwordInput.value,
    };
    await axios.post(`${PAGE_URL}/api/login`, user, { withCredentials: true });
    window.location.pathname = `/store/`;
  } catch (error) {
    console.log(error);
    errorText.innerHTML = error.response.data.error;
  }
});

const validation = () => {
  let isEnabled = emailValidation && passwordValidation;
  formBtn.disabled = !isEnabled;
};

emailInput.addEventListener("input", (e) => {
  emailValidation = emailRegex.test(e.target.value);
  validation();
});

passwordInput.addEventListener("input", (e) => {
  passwordValidation = e.target.value.length >= 1;
  validation();
});