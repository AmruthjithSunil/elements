const form = document.getElementById('form');
const allyPower = document.getElementById('ally-power');
const teamSize = document.getElementById('team-size');

if(localStorage.getItem('allyPower') == null)
    localStorage.setItem('allyPower', allyPower.value);
else
    allyPower.value = localStorage.getItem('allyPower');

if(localStorage.getItem('teamSize') == null)
    localStorage.setItem('teamSize', teamSize.value);
else
    teamSize.value = localStorage.getItem('teamSize');

form.addEventListener('submit', submitFn);

function submitFn(e){
    e.preventDefault();
    localStorage.setItem('allyPower', allyPower.value);
    localStorage.setItem('teamSize', teamSize.value);
}