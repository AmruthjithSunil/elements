//Checkout ./classes/ui.js to know more about UI class
const ui = new UI();

// Check if certain items are stored in localStorage, and if not, set them to default values
if (localStorage.getItem('allyPower') == null)
    localStorage.setItem('allyPower', 50);
if (localStorage.getItem('teamSize') == null)
    localStorage.setItem('teamSize', 1);

const teamSize = localStorage.getItem('teamSize');

for (let i = 1; i < teamSize; i++) {
    const monsterButton = document.createElement('button');
    monsterButton.id = 'monster' + i;
    monsterButton.className = 'monster';
    document.getElementById('ally-team').appendChild(monsterButton);
}

//Checkout ./classes/team.js to know more about Team class
let enemy = new Team(teamSize);
let ally = new Team(teamSize, localStorage.getItem('allyPower') * 1 + 30);

ui.load(ally, enemy);

const team = document.querySelectorAll('.monster');
for (let i = 1; i < teamSize; i++) {
    team[i - 1].textContent = ally.team[i].name;
    team[i - 1].addEventListener('click', swap);
}

ui.loadMoveset(ally);

function swap(e) {
    const enemyMove = enemy.active.moves[enemy.active.strongestMoveAgainst(ally.active)];
    ui.log.innerHTML = `You switched to ${e.composedPath()[0].textContent}.<br>`;
    ally.switchedTo(e.composedPath()[0].id[7]);
    ui.allyStatsBar.innerHTML = ally.active.statsBar();
    ui.allyName.textContent = ally.active.name;
    for (let i = 1; i < ally.team.length; i++)
        team[i - 1].textContent = ally.team[i].name;
    ui.loadMoveset(ally);
    ui.log.innerHTML += enemy.active.attacked(ally.active, enemyMove);
    if (ally.active.currentHp == 0) {
        ui.log.innerHTML += '<br>You lost';
    }
    ui.load(ally, enemy);
}

function attack(e) {
    ui.log.innerHTML += '<br>';
    if (ally.active.speed > enemy.active.speed) {
        ui.log.innerHTML += `${ally.active.attacked(enemy.active, e.composedPath()[0].textContent)}<br>`;
        if (enemy.active.currentHp == 0) {
            ui.log.innerHTML += 'You won';
        } else {
            ui.log.innerHTML += enemy.active.attacked(
                ally.active, enemy.active.moves[enemy.active.strongestMoveAgainst(ally.active)]
            );
            if (ally.active.currentHp == 0) {
                ui.log.innerHTML += '<br>You lost';
            }
        }
    } else {
        ui.log.innerHTML += enemy.active.attacked(
            ally.active, enemy.active.moves[enemy.active.strongestMoveAgainst(ally.active)]
        );
        if (ally.active.currentHp == 0) {
            ui.log.innerHTML += '<br>You lost';
        } else {
            ui.log.innerHTML += `<br>${ally.active.attacked(enemy.active, e.composedPath()[0].textContent)}`;
            if (enemy.active.currentHp == 0) {
                ui.log.innerHTML += '<br>You won';
            }
        }
    }
    ui.loadMoveset(ally);
    ui.load(ally, enemy);
}