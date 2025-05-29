//Selectors
const  shopIcon = document.querySelector(`#shopicon`);
const cart = document.querySelector(`.cart`);
const table = document.querySelector(`#tableBody`);
const btn = document.querySelectorAll(`.prodBtn`);
const rtable = document.querySelector(`#removeTable`);
const goUp = document.querySelector(`#goUp`);


btn.forEach(btn => {
    btn.addEventListener(`click` , e =>{
        const img =e.target.parentElement.parentElement.children[0].innerHTML;
        const title = e.target.parentElement.children[0].innerHTML;
        const qtty = e.target.parentElement.children[2].innerHTML;
        const price = e.target.parentElement.children[3].innerHTML;

        // const exist = [...table.children].find(element => element.children[1].innerHTML === title);

        // if (exist ) {
        //     exist.children[3].innerHTML = Number(exist.children[3].innerHTML + 1)

            
        // === : compara la igualdad del valor y el tipo del dato
        // == : compara solo el valor

        // } else {

        //     const row = document.createElement(`tr`)

        //     row.innerHTML = `
        //     <td>${img}</td>
        //     <td>${title}</td>
        //     <td>${price}</td>
        //     <td>${qtty}</td>
        //     <td><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
        //     <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        //     </svg>
        //     </td>
        //     `
        // table.append(row)
        // }

        const row = document.createElement(`tr`)

            row.innerHTML = `
            <td>${img}</td>
            <td>${title}</td>
            <td>${price}</td>
            <td>${qtty}</td>
            <td><svg xmlns="http://www.w3.org/2000/svg" class="delBtn" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </td>
            `
            row.children[4].addEventListener(`click`, e =>{
                e.currentTarget.parentElement.remove()
            })

        table.append(row)

       
  })
});

//Events
shopIcon.addEventListener(`click`,e =>{
    cart.classList.toggle(`showcart`);
});

//aqui estoy seleccionando los elementos del html para luego usarlos en el javascript
//esta arrow function sirve para mostrar el carrito de compras, agregandole la clase showcart

rtable.addEventListener(`click`, e => {
table.innerHTML = ""
})
//all events have a function

goUp.style.display = `none`;
window.addEventListener(`scroll`, () =>{
    if(this.scrollY > 500){
        goUp.style.display = `block`
    }else{
        goUp.style.display = `none`;
    }

})

goUp.onclick = function ( ) {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}