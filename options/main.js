const form = document.getElementById('form');
const allyPower = document.getElementById('ally-power');
if(localStorage.getItem('allyPower') == null)
    localStorage.setItem('allyPower', allyPower.value);
else
    allyPower.value = localStorage.getItem('allyPower');

form.addEventListener('submit', submitFn);

function submitFn(e){
    e.preventDefault();
    localStorage.setItem('allyPower', allyPower.value);
    console.log(localStorage.getItem('allyPower'));
}