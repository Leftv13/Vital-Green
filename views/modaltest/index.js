//Selectors 
const closeBtn = document.getElementById('close');
const openBtn = document.getElementById('open');
const modalContainer = document.getElementById('modalContainer');

//Event Listeners

openBtn.addEventListener('click', () =>{
    modalContainer.classList.remove('hid');

});

closeBtn.addEventListener('click', () =>{
    modalContainer.classList.add('hid');

});
