const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');
const log = document.getElementById('log');

const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];

const typeChart = [
    [0.5, 0.5, 1.0, 2.0, 1.0],
    [2.0, 0.5, 2.0, 0.5, 1.0],
    [2.0, 1.0, 1.0, 0.5, 2.0],
    [0.5, 2.0, 2.0, 0.5, 1.0],
    [1.0, 2.0, 0.0, 0.5, 0.5]
]

class Monster{
    constructor(average = 80){
        this.totalHp = random((average-10)*12,(average+10)*12);
        this.currentHp = this.totalHp;
        this.speed = random(average-20, average+20);
        this.types = [typeNames[random(0,5)], typeNames[random(0,5)]];
        this.attack = [random(average-20, average+20), random(average-20, average+20)];
        this.defence = [random(average-20, average+20), random(average-20, average+20)];
        this.average = Math.round(((this.totalHp)/12+ this.speed + (this.attack[0]+this.attack[1])/2 + (this.defence[0]+this.defence[1])/2)/4);
        this.name = this.name();
        this.moves = this.randomMoves();
    }
    name(){
        if(this.types[0] == this.types[1])
            return `Pure${this.types[0]}${this.average}`;
        return `${this.types[0]}${this.types[1]}${this.average}`;
    }
    randomMoves() {
        const moves = [...typeNames];
        do{
            const t = random(0, typeNames.length);
            if(typeNames[t] != this.types[0] && typeNames[t] != this.types[1]){
                moves.splice(t, 1);
                break;
            }
        }while(true);
        return moves;
    }
}

function random(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}

const enemy = new Monster();
const ally = new Monster();

enemyName.textContent = enemy.name;
allyName.textContent = ally.name;
enemyHealthBar.innerHTML = healthBar(enemy);
allyHealthBar.innerHTML = healthBar(ally);

function healthBar(monster){
    return `Hp:${monster.currentHp}/${monster.totalHp} Sp:${monster.speed}
            <br>Atk:${monster.attack[0]} Sp.Atk:${monster.attack[1]}
            <br>Df:${monster.defence[0]} Sp.Df:${monster.defence[1]}`;
}

for(let i=0; i<4; i++){
    moves[i].textContent = ally.moves[i];
    moves[i].addEventListener('click', attack);
    switch(ally.moves[i]){
        case 'Fire': moves[i].style.backgroundColor = 'coral';break;
        case 'Aqua': moves[i].style.backgroundColor = 'lightblue';break;
        case 'Earth': moves[i].style.backgroundColor = 'burlywood';break;
        case 'Nature': moves[i].style.backgroundColor = 'lightgreen';break;
        case 'Shock': moves[i].style.backgroundColor = 'gold';break;
    }
}

function attack(e){
    log.innerHTML = '';
    if(ally.speed>enemy.speed){
        log.innerHTML += attackFn(ally, enemy, e.path[0].textContent);
        log.innerHTML += '<br>'
        if(enemy.currentHp == 0){
            log.innerHTML += 'You won';
            enemyHealthBar.innerHTML = healthBar(enemy);
            allyHealthBar.innerHTML = healthBar(ally);
            return;
        }
        log.innerHTML += attackFn(enemy, ally, enemy.moves[random(0,4)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
            enemyHealthBar.innerHTML = healthBar(enemy);
            allyHealthBar.innerHTML = healthBar(ally);
            return;
        }
    }else{
        log.innerHTML += attackFn(enemy, ally, enemy.moves[random(0,4)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
            enemyHealthBar.innerHTML = healthBar(enemy);
            allyHealthBar.innerHTML = healthBar(ally);
            return;
        }
        log.innerHTML += '<br>'
        log.innerHTML += attackFn(ally, enemy, e.path[0].textContent);
        if(enemy.currentHp == 0){
            log.innerHTML += '<br>You won';
        }
    }
    enemyHealthBar.innerHTML = healthBar(enemy);
    allyHealthBar.innerHTML = healthBar(ally);
}

function attackFn(attacker, defender, move){
    if(attacker.currentHp == 0)
        return "Dead guy can't attack";
    let damage = (100 * stab(attacker.types, move) * effectiveness(defender.types, move));
    let log = '';
    defender.currentHp -= damage;
    if(defender.currentHp < 0)
        defender.currentHp = 0;
    if(attacker === ally)
        log += `Your ${ally.name} used ${move}(-${damage}). `;
    else
        log += `Enemy ${enemy.name} used ${move}(-${damage}). `;;
    if(effectiveness(defender.types, move)>1){
        log += 'Super Effective. ';
    }
    if(effectiveness(defender.types, move)<1){
        log += 'Not Very Effective. ';
    }
    return log;
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
    if(enemyTypes[0] == enemyTypes[1]){
        return(typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[0])]);
    }
    return(typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[0])] * typeChart[typeNames.indexOf(move)][typeNames.indexOf(enemyTypes[1])]);
}
