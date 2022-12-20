const enemyHealthBar = document.getElementById('enemy-health');
const allyHealthBar = document.getElementById('ally-health');
const moves = document.getElementsByClassName('move');

class Monster{
    constructor(){
        this.hp = 100;
    }
}

const enemy = new Monster();
const ally = new Monster();

enemyHealthBar.textContent = `${enemy.hp}/100`;
allyHealthBar.textContent = `${ally.hp}/100`;

for(let i=0; i<4; i++){
    moves[i].addEventListener('click', function attack(){
        enemy.hp -= (i*10 + 10);
        enemyHealthBar.textContent = `${enemy.hp}/100`;
    });
}
