class UI {
    constructor() {
        this.enemyStatsBar = document.getElementById('enemy-stats');
        this.allyStatsBar = document.getElementById('ally-stats');
        this.enemyName = document.getElementById('enemy-name');
        this.allyName = document.getElementById('ally-name');
        this.moves = document.getElementsByClassName('move');
        this.log = document.getElementById('log');
    }
    load(ally, enemy){
        this.enemyName.textContent = enemy.active.name;
        this.allyName.textContent = ally.active.name;
        this.enemyStatsBar.innerHTML = enemy.active.statsBar();
        this.allyStatsBar.innerHTML = ally.active.statsBar();
    }
    loadMoveset(ally){
        for (let i = 0; i < 4; i++) {
            this.moves[i].textContent = ally.active.moves[i];
            this.moves[i].style.color = 'black';
            this.moves[i].addEventListener('click', attack);
            switch (ally.active.moves[i].slice(0, -1)) {
                case 'Fire': this.moves[i].style.backgroundColor = 'coral'; break;
                case 'Aqua': this.moves[i].style.backgroundColor = 'lightblue'; break;
                case 'Earth': this.moves[i].style.backgroundColor = 'burlywood'; break;
                case 'Nature': this.moves[i].style.backgroundColor = 'lightgreen'; break;
                case 'Shock': this.moves[i].style.backgroundColor = 'gold'; break;
            }
        }
        this.moves[ally.active.strongestMoveAgainst(enemy.active)].style.color = 'white';
    }
}