class Monster{
    constructor(average = 80){
        // When changing typeNames the typeIndexs in effectiveness function should be also changed
        const typeNames = ['Fire', 'Aqua', 'Earth', 'Nature', 'Shock'];
        this.totalHp = random((average-10)*9,(average+10)*9);
        this.currentHp = this.totalHp;
        this.speed = random(average-20, average+20);
        this.types = [typeNames[random(0,5)], typeNames[random(0,5)]];
        this.attack = [random(average-20, average+20), random(average-20, average+20)];
        this.defence = [random(average-20, average+20), random(average-20, average+20)];
        this.stamina = 100;
        this.energy = 100;
        this.average = this.average();
        this.name = this.name();
        this.moves = this.randomMoves();
    }
    average(){
        let sum = this.totalHp/9;
        sum += this.speed;
        sum += (this.attack[0]+this.attack[1])/2;
        sum += (this.defence[0]+this.defence[1])/2;
        return Math.round(sum/4);
    }
    name(){
        if(this.types[0] == this.types[1])
            return `Pure${this.types[0]}${this.average}`;
        return `${this.types[0]}${this.types[1]}${this.average}`;
    }
    randomMoves() {
        const moveNames = ['Fire0', 'Aqua0', 'Earth0', 'Nature0', 'Shock0',
                           'Fire1', 'Aqua1', 'Earth1', 'Nature1', 'Shock1'];
        const moves = [`${this.types[0]}0`, `${this.types[0]}1`];
        if(this.types[0] != this.types[1]){
            moves.push(`${this.types[1]}${random(0,2)}`);
            const movesIndex = [moveNames.indexOf(moves[0]), moveNames.indexOf(moves[1])];
            movesIndex.push(moveNames.indexOf(moves[2]));
            moves.push(moveNames[random(0, 10, movesIndex)]);
            return moves;
        }
        const movesIndex = [moveNames.indexOf(moves[0]), moveNames.indexOf(moves[1])];
        moves.push(moveNames[random(0, 10, movesIndex)]);
        movesIndex.push(moveNames.indexOf(moves[2]));
        moves.push(moveNames[random(0, 10, movesIndex)]);        
        return moves;
    }
    statsBar(){
        return  `Stamina : ${this.stamina}
        <br>Energy : ${this.energy}
        <br>Hp:${this.currentHp}/${this.totalHp} Sp:${this.speed}
        <br>Atk:${this.attack[0]} Sp.Atk:${this.attack[1]}
        <br>Df:${this.defence[0]} Sp.Df:${this.defence[1]}`;
    }
    recoveringStaminaAndEnergy(){
        this.stamina += 20;
        this.energy += 20;
        if(this.stamina > 100)
            this.stamina = 100;
        if(this.energy > 100)
            this.energy = 100;
    }
    stab(move){
        if(this.types[0] == this.types[1]){
            if(this.types[0] == move)
                return 1.5;
            return 1;
        }
        if(this.types[0] == move)
            return 1.4;
        if(this.types[1] == move)
            return 1.3;
        return 1;
    }
    effectivenessOf(move){
        const typeIndexs = (move) =>  {
            switch(move){
                case 'Fire': return 0;
                case 'Aqua': return 1;
                case 'Earth': return 2;
                case 'Nature': return 3;
                case 'Shock': return 4;
            };
        }
        const typeChart = [
            [0.5, 0.5, 1.0, 2.0, 1.0],
            [2.0, 0.5, 2.0, 0.5, 1.0],
            [2.0, 1.0, 1.0, 0.5, 2.0],
            [0.5, 2.0, 2.0, 0.5, 1.0],
            [1.0, 2.0, 0.0, 0.5, 0.5]
        ];
        let effect = typeChart[typeIndexs(move)][typeIndexs(this.types[0])];
        if(this.types[0] == this.types[1]){
            return effect;
        }
        effect = (effect + typeChart[typeIndexs(move)][typeIndexs(this.types[1])])/2;
        if(effect == 1.25)
            return 1;
        return effect;
    }
    damaged(defender, move){
        let damage = (100 * this.stab(move.slice(0, -1)) * defender.effectivenessOf(move.slice(0, -1)));
        if(move[move.length-1] == '0'){
            damage = Math.round(damage*this.attack[0]/defender.defence[0]*this.stamina/100);
        }else{
            damage = Math.round(damage*this.attack[1]/defender.defence[1]*this.energy/100);
        }
        return damage;
    }
    strongestMoveAgainst(defender){
        let index = 0;
        let strong = this.damaged(defender, this.moves[index]);
        for(let i=1; i<4; i++){
            let temp = this.damaged(defender, this.moves[i]);
            if(temp > strong){
                strong = temp;
                index = i;
            }
        }
        return index;
    }
    attacked(defender, move){
        if(this.currentHp == 0)
            return "Dead guy can't attack";
        let log = '';
        let damage = this.damaged(defender, move);
        if(move[move.length-1] == '0'){
            this.stamina = Math.round(this.stamina/2);
        }
        if(move[move.length-1] == '1'){
            this.energy = Math.round(this.energy/2);
        }
        defender.currentHp -= damage;
        this.recoveringStaminaAndEnergy();
        if(defender.currentHp < 0)
            defender.currentHp = 0;
        if(this === ally)
            log += `Your ${ally.name} used ${move}(-${damage}). `;
        else
            log += `Enemy ${enemy.name} used ${move}(-${damage}). `;;
        if(defender.effectivenessOf(move.slice(0, -1))>1){
            log += 'Super Effective. ';
        }
        if(defender.effectivenessOf(move.slice(0, -1))<1){
            log += 'Not Very Effective. ';
        }
        return log;
    }
}

// a function that return random values between min and max which are not inside exclude array
function random(min, max, exclude = []){
    if(exclude.length == 0){
        return Math.floor(Math.random()*(max-min)) + min;
    }
    let pass = Math.floor(Math.random()*(max-min-exclude.length));
    for(let i=min; i<max; i++){
        if(exclude.indexOf(i) == -1)
            pass--;
        if(pass == -1)
            return i;
    }
}