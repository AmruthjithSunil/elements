class Team{
    constructor(size = 1, power = 80){
        this.team = [];
        this.left = size;
        for(let i=0; i < size; i++)
            this.team.push(new Monster(power));
        this.active = this.team[0];
    }
    swap(a, b){
        const temp = this.team[a];
        this.team[a] = this.team[b];
        this.team[b] = temp;
    }
}

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

let enemy = new Team(teamSize);
let ally = new Team(teamSize, localStorage.getItem('allyPower')*1+30);

enemyName.textContent = enemy.active.name;
allyName.textContent = ally.active.name;
enemyStatsBar.innerHTML = enemy.active.statsBar();
allyStatsBar.innerHTML = ally.active.statsBar();

function movesetDesign(){
    for(let i=0; i<4; i++){
        moves[i].textContent = ally.active.moves[i];
        moves[i].style.color = 'black';
        moves[i].addEventListener('click', attack);
        switch(ally.active.moves[i].slice(0,-1)){
            case 'Fire': moves[i].style.backgroundColor = 'coral';break;
            case 'Aqua': moves[i].style.backgroundColor = 'lightblue';break;
            case 'Earth': moves[i].style.backgroundColor = 'burlywood';break;
            case 'Nature': moves[i].style.backgroundColor = 'lightgreen';break;
            case 'Shock': moves[i].style.backgroundColor = 'gold';break;
        }
    }
    moves[ally.active.strongestMoveAgainst(enemy.active)].style.color = 'white';
}

for(let i=1; i<teamSize; i++){
    team[i-1].textContent = ally.team[i].name;
    team[i-1].addEventListener('click', swap);
}

movesetDesign();

function swap(e){
    const enemyMove = enemy.active.moves[enemy.active.strongestMoveAgainst(ally.active)];
    log.innerHTML = `You switched to ${e.composedPath()[0].textContent}.<br>`;
    ally.swap(0, e.composedPath()[0].id[7])
    ally.active = ally.team[0];
    allyStatsBar.innerHTML = ally.active.statsBar();
    allyName.textContent = ally.active.name;
    for(let i=1; i<ally.team.length; i++)
        team[i-1].textContent = ally.team[i].name;
    movesetDesign();
    log.innerHTML += enemy.active.attacked(ally.active, enemyMove);
    if(ally.active.currentHp == 0){
        log.innerHTML += '<br>You lost';
    }
    for(let i=0; i<4; i++)
        moves[i].style.color = 'black';
    moves[ally.active.strongestMoveAgainst(enemy.active)].style.color = 'white';
    enemyStatsBar.innerHTML = enemy.active.statsBar();
    allyStatsBar.innerHTML = ally.active.statsBar();
}

function attack(e){
    log.innerHTML += '<br>';
    if(ally.active.speed>enemy.active.speed){
        log.innerHTML += `${ally.active.attacked(enemy.active, e.composedPath()[0].textContent)}<br>`;
        if(enemy.active.currentHp == 0){
            log.innerHTML += 'You won';
        }else{
            log.innerHTML += enemy.active.attacked(ally.active, enemy.active.moves[enemy.active.strongestMoveAgainst(ally.active)]);
            if(ally.active.currentHp == 0){
                log.innerHTML += '<br>You lost';
            }
        }
    }else{
        log.innerHTML += enemy.active.attacked(ally.active, enemy.active.moves[enemy.active.strongestMoveAgainst(ally.active)]);
        if(ally.active.currentHp == 0){
            log.innerHTML += '<br>You lost';
        }else{
            log.innerHTML += `<br>${ally.active.attacked(enemy.active, e.composedPath()[0].textContent)}`;
            if(enemy.active.currentHp == 0){
                log.innerHTML += '<br>You won';
            }
        }
    }
    movesetDesign();
    enemyStatsBar.innerHTML = enemy.active.statsBar();
    allyStatsBar.innerHTML = ally.active.statsBar();
}