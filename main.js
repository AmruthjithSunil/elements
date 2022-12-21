const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const enemyName = document.getElementById('enemy-name');
const allyName = document.getElementById('ally-name');
const moves = document.getElementsByClassName('move');

const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];

class Monster{
    constructor(){
        this.hp = 400;
        this.types = [typeNames[Math.floor(Math.random()*typeNames.length)], typeNames[Math.floor(Math.random()*typeNames.length)]];
        this.moves = this.randomMoves();
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

const enemy = new Monster();
const ally = new Monster();

enemyName.textContent = `${enemy.types[0]}-${enemy.types[1]}`;
allyName.textContent = `${ally.types[0]}-${ally.types[1]}`;
enemyHealthBar.textContent = `${enemy.hp}/400`;
allyHealthBar.textContent = `${ally.hp}/400`;

for(let i=0; i<4; i++){
    moves[i].textContent = ally.moves[i];
    moves[i].addEventListener('click', function attack(){
        enemy.hp -= 100;
        enemyHealthBar.textContent = `${enemy.hp}/400`;
    });
}
