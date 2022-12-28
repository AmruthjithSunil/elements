const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');
const log = document.getElementById('log');

if(localStorage.getItem('allyPower') == null)
    localStorage.setItem('allyPower', 50);
const teamSize = 3;
for(let i=1; i<teamSize; i++){
    const monsterButton = document.createElement('button');
    monsterButton.id = 'monster'+i;
    monsterButton.className = 'monster';
    document.getElementById('ally-team').appendChild(monsterButton);
}
const team = document.querySelectorAll('.monster');

const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];
const moveNames = ['Fire0', 'Aqua0', 'Earth0', 'Nature0', 'Shock0',
                   'Fire1', 'Aqua1', 'Earth1', 'Nature1', 'Shock1']

class Monster{
    constructor(average = 80){
        this.totalHp = random((average-10)*9,(average+10)*9);
        this.currentHp = this.totalHp;
        this.speed = random(average-20, average+20);
        this.types = [typeNames[random(0,5)], typeNames[random(0,5)]];
        this.attack = [random(average-20, average+20), random(average-20, average+20)];
        this.defence = [random(average-20, average+20), random(average-20, average+20)];
        this.stamina = 100;
        this.energy = 100;
        this.average = this.average();
        this.name = this.name();
        this.moves = this.randomMoves();
    }
    average(){
        let sum = this.totalHp/9;
        sum += this.speed;
        sum += (this.attack[0]+this.attack[1])/2;
        sum += (this.defence[0]+this.defence[1])/2;
        return Math.round(sum/4);
    }
    name(){
        if(this.types[0] == this.types[1])
            return `Pure${this.types[0]}${this.average}`;
        return `${this.types[0]}${this.types[1]}${this.average}`;
    }
    randomMoves() {
        const moves = [`${this.types[0]}0`, `${this.types[0]}1`];
        if(this.types[0] != this.types[1]){
            moves.push(`${this.types[1]}${random(0,2)}`);
            const movesIndex = [moveNames.indexOf(moves[0]), moveNames.indexOf(moves[1])];
            movesIndex.push(moveNames.indexOf(moves[2]));
            moves.push(moveNames[random(0, 10, movesIndex)]);
            return moves;
        }
        const movesIndex = [moveNames.indexOf(moves[0]), moveNames.indexOf(moves[1])];
        moves.push(moveNames[random(0, 10, movesIndex)]);
        movesIndex.push(moveNames.indexOf(moves[2]));
        moves.push(moveNames[random(0, 10, movesIndex)]);        
        return moves;
    }
    statsBar(){
        return  `Stamina : ${this.stamina}
        <br>Energy : ${this.energy}
        <br>Hp:${this.currentHp}/${this.totalHp} Sp:${this.speed}
        <br>Atk:${this.attack[0]} Sp.Atk:${this.attack[1]}
        <br>Df:${this.defence[0]} Sp.Df:${this.defence[1]}`;
    }
    recoverStaminaEnergy(){
        this.stamina += 20;
        this.energy += 20;
        if(this.stamina > 100)
            this.stamina = 100;
        if(this.energy > 100)
            this.energy = 100;
    }
    stab(move){
        if(this.types[0] == this.types[1]){
            if(this.types[0] == move)
                return 1.5;
            return 1;
        }
        if(this.types[0] == move)
            return 1.4;
        if(this.types[1] == move)
            return 1.3;
        return 1;
    }
}

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
enemyHealthBar.innerHTML = enemy.statsBar();
allyHealthBar.innerHTML = ally.statsBar();


for(let i=1; i<teamSize; i++){
    team[i-1].textContent = allyTeam[i].name;
    team[i-1].addEventListener('click', switchFn);
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

moves[strongest(ally, enemy)].style.color = 'white';

function strongest(attacker, defender){
    let index = 0;
    let strong = damageDealt(attacker, defender, attacker.moves[index]);
    for(let i=1; i<4; i++){
        let temp = damageDealt(attacker, defender, attacker.moves[i]);
        if(temp > strong){
            strong = temp;
            index = i;
        }
    }
    return index;
}

function switchFn(e){
    const enemyMove = enemy.moves[strongest(enemy, ally)];
    log.innerHTML = `You switched to ${e.path[0].textContent}.<br>`;
    {
        let temp = allyTeam[0];
        allyTeam[0] = allyTeam[e.path[0].id[7]];
        allyTeam[e.path[0].id[7]] = temp;
    }
    ally = allyTeam[0];
    allyHealthBar.innerHTML = ally.statsBar();
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
    moves[strongest(ally, enemy)].style.color = 'white';
    log.innerHTML += attackFn(enemy, ally, enemyMove);
    if(ally.currentHp == 0){
        log.innerHTML += '<br>You lost';
    }
    for(let i=0; i<4; i++)
        moves[i].style.color = 'black';
    moves[strongest(ally, enemy)].style.color = 'white';
    enemyHealthBar.innerHTML = enemy.statsBar();
    allyHealthBar.innerHTML = ally.statsBar();
}

function attack(e){
    log.innerHTML = '';
    if(ally.speed>enemy.speed){
        log.innerHTML += `${attackFn(ally, enemy, e.path[0].textContent)}<br>`;
        if(enemy.currentHp == 0){
            log.innerHTML += 'You won';
        }else{
            log.innerHTML += attackFn(enemy, ally, enemy.moves[strongest(enemy, ally)]);
            if(ally.currentHp == 0){
                log.innerHTML += '<br>You lost';
            }
        }
    }else{
        log.innerHTML += attackFn(enemy, ally, enemy.moves[strongest(enemy, ally)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
        }else{
            log.innerHTML += `<br>${attackFn(ally, enemy, e.path[0].textContent)}`;
            if(enemy.currentHp == 0){
                log.innerHTML += '<br>You won';
            }
        }
    }
    for(let i=0; i<4; i++)
        moves[i].style.color = 'black';
    moves[strongest(ally, enemy)].style.color = 'white';
    enemyHealthBar.innerHTML = enemy.statsBar();
    allyHealthBar.innerHTML = ally.statsBar();
}

function attackFn(attacker, defender, move){
    if(attacker.currentHp == 0)
        return "Dead guy can't attack";
    let log = '';
    let damage = damageDealt(attacker, defender, move);
    if(move[move.length-1] == '0'){
        attacker.stamina = Math.round(attacker.stamina/2);
    }
    if(move[move.length-1] == '1'){
        attacker.energy = Math.round(attacker.energy/2);
    }
    defender.currentHp -= damage;
    attacker.recoverStaminaEnergy();
    if(defender.currentHp < 0)
        defender.currentHp = 0;
    if(attacker === ally)
        log += `Your ${ally.name} used ${move}(-${damage}). `;
    else
        log += `Enemy ${enemy.name} used ${move}(-${damage}). `;;
    if(effectiveness(defender.types, move.slice(0, -1))>1){
        log += 'Super Effective. ';
    }
    if(effectiveness(defender.types, move.slice(0, -1))<1){
        log += 'Not Very Effective. ';
    }
    return log;
}

function damageDealt(attacker, defender, move){
    let damage = (100 * attacker.stab(move.slice(0, -1)) * effectiveness(defender.types, move.slice(0, -1)));
    if(move[move.length-1] == '0'){
        damage = Math.round(damage*attacker.attack[0]/defender.defence[0]*attacker.stamina/100);
    }else{
        damage = Math.round(damage*attacker.attack[1]/defender.defence[1]*attacker.energy/100);
    }
    return damage;
}

function effectiveness(enemyTypes, move){
    const typeChart = [
        [0.5, 0.5, 1.0, 2.0, 1.0],
        [2.0, 0.5, 2.0, 0.5, 1.0],
        [2.0, 1.0, 1.0, 0.5, 2.0],
        [0.5, 2.0, 2.0, 0.5, 1.0],
        [1.0, 2.0, 0.0, 0.5, 0.5]
    ];
    let effect = typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[0])];
    if(enemyTypes[0] == enemyTypes[1]){
        return effect;
    }
    effect = (effect + typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[1])])/2;
    if(effect == 1.25)
        return 1;
    return effect;
}

function random(min, max, arr = []){
    let length = arr.length;
    if(length == 0)
        return Math.floor(Math.random()*(max-min)) + min;
    let pass = Math.floor(Math.random()*(max-min-length));
    for(let i=min; i<max; i++){
        if(arr.indexOf(i) == -1)
            pass--;
        if(pass == -1)
            return i;
    }
}