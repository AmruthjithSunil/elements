import {Monster} from "./monster.js";

const enemyStatsBar = document.getElementById('enemy-stats');
const allyStatsBar = document.getElementById('ally-stats');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');
const log = document.getElementById('log');

// Check if certain items are stored in localStorage, and if not, set them to default values
if(localStorage.getItem('allyPower') == null)
    localStorage.setItem('allyPower', 50);
if(localStorage.getItem('teamSize') == null)
    localStorage.setItem('teamSize', 1);

const teamSize = localStorage.getItem('teamSize');

for(let i=1; i<teamSize; i++){
    const monsterButton = document.createElement('button');
    monsterButton.id = 'monster'+i;
    monsterButton.className = 'monster';
    document.getElementById('ally-team').appendChild(monsterButton);
}
const team = document.querySelectorAll('.monster');

const enemyTeam = [];
const allyTeam = [];
for(let i=0; i<teamSize; i++){
    enemyTeam.push(new Monster());
    allyTeam.push(new Monster(localStorage.getItem('allyPower')*1+30));
}

let enemy = enemyTeam[0];
let ally = allyTeam[0];

enemyName.textContent = enemy.name;
allyName.textContent = ally.name;
enemyStatsBar.innerHTML = enemy.statsBar();
allyStatsBar.innerHTML = ally.statsBar();


for(let i=1; i<teamSize; i++){
    team[i-1].textContent = allyTeam[i].name;
    team[i-1].addEventListener('click', swap);
}

for(let i=0; i<4; i++){
    moves[i].textContent = ally.moves[i];
    moves[i].addEventListener('click', attack);
    switch(ally.moves[i].slice(0,-1)){
        case 'Fire': moves[i].style.backgroundColor = 'coral';break;
        case 'Aqua': moves[i].style.backgroundColor = 'lightblue';break;
        case 'Earth': moves[i].style.backgroundColor = 'burlywood';break;
        case 'Nature': moves[i].style.backgroundColor = 'lightgreen';break;
        case 'Shock': moves[i].style.backgroundColor = 'gold';break;
    }
}

moves[ally.strongestMoveAgainst(enemy)].style.color = 'white';

function swap(e){
    const enemyMove = enemy.moves[enemy.strongestMoveAgainst(ally)];
    log.innerHTML = `You switched to ${e.composedPath()[0].textContent}.<br>`;
    {
        const temp = allyTeam[0];
        allyTeam[0] = allyTeam[e.composedPath()[0].id[7]];
        allyTeam[e.composedPath()[0].id[7]] = temp;
    }
    ally = allyTeam[0];
    allyStatsBar.innerHTML = ally.statsBar();
    allyName.textContent = ally.name;
    for(let i=1; i<allyTeam.length; i++)
        team[i-1].textContent = allyTeam[i].name;
    for(let i=0; i<4; i++){
        moves[i].textContent = ally.moves[i];
        moves[i].style.color = 'black';
        moves[i].addEventListener('click', attack);
        switch(ally.moves[i].slice(0,-1)){
            case 'Fire': moves[i].style.backgroundColor = 'coral';break;
            case 'Aqua': moves[i].style.backgroundColor = 'lightblue';break;
            case 'Earth': moves[i].style.backgroundColor = 'burlywood';break;
            case 'Nature': moves[i].style.backgroundColor = 'lightgreen';break;
            case 'Shock': moves[i].style.backgroundColor = 'gold';break;
        }
    }
    moves[ally.strongestMoveAgainst(enemy)].style.color = 'white';
    log.innerHTML += enemy.attacked(ally, enemyMove);
    if(ally.currentHp == 0){
        log.innerHTML += '<br>You lost';
    }
    for(let i=0; i<4; i++)
        moves[i].style.color = 'black';
    moves[ally.strongestMoveAgainst(enemy)].style.color = 'white';
    enemyStatsBar.innerHTML = enemy.statsBar();
    allyStatsBar.innerHTML = ally.statsBar();
}

function attack(e){
    log.innerHTML = '';
    if(ally.speed>enemy.speed){
        log.innerHTML += `${ally.attacked(enemy, e.composedPath()[0].textContent)}<br>`;
        if(enemy.currentHp == 0){
            log.innerHTML += 'You won';
        }else{
            log.innerHTML += enemy.attacked(ally, enemy.moves[enemy.strongestMoveAgainst(ally)]);
            if(ally.currentHp == 0){
                log.innerHTML += '<br>You lost';
            }
        }
    }else{
        log.innerHTML += enemy.attacked(ally, enemy.moves[enemy.strongestMoveAgainst(ally)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
        }else{
            log.innerHTML += `<br>${ally.attacked(enemy, e.composedPath()[0].textContent)}`;
            if(enemy.currentHp == 0){
                log.innerHTML += '<br>You won';
            }
        }
    }
    for(let i=0; i<4; i++)
        moves[i].style.color = 'black';
    moves[ally.strongestMoveAgainst(enemy)].style.color = 'white';
    enemyStatsBar.innerHTML = enemy.statsBar();
    allyStatsBar.innerHTML = ally.statsBar();
}