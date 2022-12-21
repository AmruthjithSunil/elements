const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');

const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];

class Monster{
    constructor(){
        this.totalHp = random(320,400);
        this.currentHp = this.totalHp;
        this.types = [typeNames[random(0,5)], typeNames[random(0,5)]];
        this.name = this.name();
        this.moves = this.randomMoves();
    }
    name(){
        if(this.types[0] == this.types[1])
            return `Pure ${this.types[0]}`;
        return `${this.types[0]} ${this.types[1]}`;
    }
    randomMoves() {
        const moves = [];
        let f = 1;
        for(let i=0; i<4; i++){
            if(f && Math.random()>=0.8){
                f=0;
                continue;
            }
            moves.push(typeNames[i]);
        }
        if(moves.length == 3)
            moves.push(typeNames[4]);
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
enemyHealthBar.textContent = `${enemy.currentHp}/${enemy.totalHp}`;
allyHealthBar.textContent = `${ally.currentHp}/${ally.totalHp}`;

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
    enemy.currentHp -= (100 * stab(ally.types, e.path[0].textContent));
    enemyHealthBar.textContent = `${enemy.currentHp}/${enemy.totalHp}`;
}

function stab(types, move){
    if(types[0] == types[1]){
        if(types[0] == move){
            return 1.5;
        }else{
            return 1;
        }
    }
    if(types[0] == move)
        return 1.4;
    if(types[1] == move)
        return 1.3;
}
