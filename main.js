const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');

const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];

const typeChart = [
    [0.5, 0.5, 1.0, 2.0, 1.0],
    [2.0, 1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0, 1.0],
    [1.0, 1.0, 1.0, 1.0, 1.0]
]

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
        const moves = [...typeNames];
        do{
            const t = random(0, typeNames.length);
            if(typeNames[t] != this.types[0] && typeNames[t] != this.types[1]){
                moves.splice(t, 1);
                break;
            }
        }while(true);
        console.log(moves);
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
    if(enemy.currentHp < 0)
        enemy.currentHp = 0;
    enemyHealthBar.textContent = `${enemy.currentHp}/${enemy.totalHp}`;
}

function stab(types, move){
    if(types[0] == types[1]){
        if(types[0] == move)
            return 1.5;
        return 1;
    }
    if(types[0] == move)
        return 1.4;
    if(types[1] == move)
        return 1.3;
    return 1;
}
