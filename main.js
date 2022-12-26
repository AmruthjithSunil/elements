const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');
const log = document.getElementById('log');

if(localStorage.getItem('allyPower') == null)
    localStorage.setItem('allyPower', 50);

const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];
const moveNames = ['Fire0', 'Aqua0', 'Earth0', 'Nature0', 'Shock0',
                   'Fire1', 'Aqua1', 'Earth1', 'Nature1', 'Shock1']

const typeChart = [
    [0.5, 0.5, 1.0, 2.0, 1.0],
    [2.0, 0.5, 2.0, 0.5, 1.0],
    [2.0, 1.0, 1.0, 0.5, 2.0],
    [0.5, 2.0, 2.0, 0.5, 1.0],
    [1.0, 2.0, 0.0, 0.5, 0.5]
]

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
        this.average = Math.round(((this.totalHp)/9 + this.speed + (this.attack[0]+this.attack[1])/2 + (this.defence[0]+this.defence[1])/2)/4);
        this.name = this.name();
        this.moves = this.randomMoves();
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
            const movesIndex = [moveNames.indexOf(moves[0]), moveNames.indexOf(moves[1]), moveNames.indexOf(moves[2])];
            moves.push(moveNames[random(0, 10, movesIndex)]);
            return moves;
        }
        const movesIndex = [moveNames.indexOf(moves[0]), moveNames.indexOf(moves[1])];
        moves.push(moveNames[random(0, 10, movesIndex)]);
        movesIndex.push(moveNames.indexOf(moves[2]));
        moves.push(moveNames[random(0, 10, movesIndex)]);        
        return moves;
    }
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

const enemy = new Monster();
const ally = new Monster(localStorage.getItem('allyPower')+30);

enemyName.textContent = enemy.name;
allyName.textContent = ally.name;
enemyHealthBar.innerHTML = statsBar(enemy);
allyHealthBar.innerHTML = statsBar(ally);

function statsBar(monster){
    return  `Stamina : ${monster.stamina}
            <br>Energy : ${monster.energy}
            <br>Hp:${monster.currentHp}/${monster.totalHp} Sp:${monster.speed}
            <br>Atk:${monster.attack[0]} Sp.Atk:${monster.attack[1]}
            <br>Df:${monster.defence[0]} Sp.Df:${monster.defence[1]}`;
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

function attack(e){
    log.innerHTML = '';
    if(ally.speed>enemy.speed){
        log.innerHTML += attackFn(ally, enemy, e.path[0].textContent);
        log.innerHTML += '<br>'
        if(enemy.currentHp == 0){
            log.innerHTML += 'You won';
            enemyHealthBar.innerHTML = statsBar(enemy);
            allyHealthBar.innerHTML = statsBar(ally);
            return;
        }
        log.innerHTML += attackFn(enemy, ally, enemy.moves[strongest(enemy, ally)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
            enemyHealthBar.innerHTML = statsBar(enemy);
            allyHealthBar.innerHTML = statsBar(ally);
            return;
        }
    }else{
        log.innerHTML += attackFn(enemy, ally, enemy.moves[strongest(enemy, ally)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
            enemyHealthBar.innerHTML = statsBar(enemy);
            allyHealthBar.innerHTML = statsBar(ally);
            return;
        }
        log.innerHTML += '<br>'
        log.innerHTML += attackFn(ally, enemy, e.path[0].textContent);
        if(enemy.currentHp == 0){
            log.innerHTML += '<br>You won';
        }
    }
    for(let i=0; i<4; i++)
        moves[i].style.color = 'black';
    moves[strongest(ally, enemy)].style.color = 'white';
    enemyHealthBar.innerHTML = statsBar(enemy);
    allyHealthBar.innerHTML = statsBar(ally);
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
    increment(attacker);
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

function increment(attacker){
    attacker.stamina += 20;
    attacker.energy += 20;
    if(attacker.stamina > 100)
        attacker.stamina = 100;
    if(attacker.energy > 100)
        attacker.energy = 100;
}

function damageDealt(attacker, defender, move){
    let damage = (100 * stab(attacker.types, move.slice(0, -1)) * effectiveness(defender.types, move.slice(0, -1)));
    if(move[move.length-1] == '0'){
        damage = Math.round(damage*attacker.attack[0]/defender.defence[0]*attacker.stamina/100);
    }else{
        damage = Math.round(damage*attacker.attack[1]/defender.defence[1]*attacker.energy/100);
    }
    return damage;
}

function stab(allyTypes, move){
    if(allyTypes[0] == allyTypes[1]){
        if(allyTypes[0] == move)
            return 1.5;
        return 1;
    }
    if(allyTypes[0] == move)
        return 1.4;
    if(allyTypes[1] == move)
        return 1.3;
    return 1;
}

function effectiveness(enemyTypes, move){
    let effect = typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[0])];
    if(enemyTypes[0] == enemyTypes[1]){
        return effect;
    }
    effect = (effect + typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[1])])/2;
    if(effect == 1.25)
        return 1;
    return effect;
}
