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
        this.totalHp = random((average-20)*6,(average+20)*6);
        this.currentHp = this.totalHp;
        this.speed = random(average-20, average+20)
        this.types = [typeNames[random(0,5)], typeNames[random(0,5)]];
        this.name = this.name();
        this.moves = this.randomMoves();
    }
    name(){
        if(this.types[0] == this.types[1])
            return `Pure-${this.types[0]}`;
        return `${this.types[0]}-${this.types[1]}`;
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
console.log(enemy.moves);

enemyName.textContent = enemy.name;
allyName.textContent = ally.name;
enemyHealthBar.textContent = `Hp:${enemy.currentHp}/${enemy.totalHp} Sp:${enemy.speed}`;
allyHealthBar.textContent = `Hp:${ally.currentHp}/${ally.totalHp} Sp:${ally.speed}`;

for(let i=0; i<4; i++){
    moves[i].textContent = ally.moves[i];
    moves[i].addEventListener('click', attack);
    switch(ally.moves[i]){
        case 'Fire': moves[i].style.backgroundColor = 'red';break;
        case 'Aqua': moves[i].style.backgroundColor = 'lightblue';break;
        case 'Earth': moves[i].style.backgroundColor = 'brown';break;
        case 'Nature': moves[i].style.backgroundColor = 'green';break;
        case 'Shock': moves[i].style.backgroundColor = 'yellow';break;
    }
}

function attack(e){
    log.innerHTML = '';
    if(ally.speed>enemy.speed){
        log.innerHTML += attackFn(ally, enemy, e.path[0].textContent);
        log.innerHTML += '<br>'
        if(enemy.currentHp == 0){
            log.innerHTML += 'You won';
            enemyHealthBar.textContent = `Hp:${enemy.currentHp}/${enemy.totalHp} Sp:${enemy.speed}`;
            allyHealthBar.textContent = `Hp:${ally.currentHp}/${ally.totalHp} Sp:${ally.speed}`;
            return;
        }
        log.innerHTML += attackFn(enemy, ally, enemy.moves[random(0,4)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
            enemyHealthBar.textContent = `Hp:${enemy.currentHp}/${enemy.totalHp} Sp:${enemy.speed}`;
            allyHealthBar.textContent = `Hp:${ally.currentHp}/${ally.totalHp} Sp:${ally.speed}`;
            return;
        }
    }else{
        log.innerHTML += attackFn(enemy, ally, enemy.moves[random(0,4)]);
        if(ally.currentHp == 0){
            log.innerHTML += '<br>You lost';
            enemyHealthBar.textContent = `Hp:${enemy.currentHp}/${enemy.totalHp} Sp:${enemy.speed}`;
            allyHealthBar.textContent = `Hp:${ally.currentHp}/${ally.totalHp} Sp:${ally.speed}`;
            return;
        }
        log.innerHTML += '<br>'
        log.innerHTML += attackFn(ally, enemy, e.path[0].textContent);
        if(enemy.currentHp == 0){
            log.innerHTML += '<br>You won';
        }
    }
    enemyHealthBar.textContent = `Hp:${enemy.currentHp}/${enemy.totalHp} Sp:${enemy.speed}`;
    allyHealthBar.textContent = `Hp:${ally.currentHp}/${ally.totalHp} Sp:${ally.speed}`;
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
