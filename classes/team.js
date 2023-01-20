//Checkout ./classes/monster.js to know more about Monster class
class Team {
    constructor(size = 1, power = 80) {
        this.team = [];
        this.left = size;
        for (let i = 0; i < size; i++)
            this.team.push(new Monster(power));
        this.active = this.team[0];
    }
    switchedTo(a) {
        const temp = this.team[a];
        this.team[a] = this.team[0];
        this.team[0] = temp;
        this.active = temp;
    }
}