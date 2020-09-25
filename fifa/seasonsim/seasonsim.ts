const MATCHES_PER_SEASON = 10;
const NUM_DIVISIONS = 10;

const NUM_PLAYERS = 100000;
const NUM_LEVELS = 100;
// const NUM_PLAYERS = 100;
// const NUM_LEVELS = 10;
const MAX_ITERS = 100000 * NUM_PLAYERS;

let randomNum = (max: number) => {
    return Math.floor(Math.random() * max);
};

const DEBUG_ID = 1;

class Player {
    division: number = NUM_DIVISIONS;
    wins: number = 0;
    draws: number = 0;
    losses: number = 0;

    constructor(public id: number, public skill: number) {}

    get points() {
        return this.wins * 3 + this.draws * 1;
    }

    get matches() {
        return this.wins + this.draws + this.losses;
    }

    private moveDivs(division: Division, newDivId: number) {
        division.removePlayer(this);
        this.division = newDivId;
        divisionMap.get(newDivId).addPlayer(this);
    }

    check(divisionMap: Map<number, Division>) {
        let division = divisionMap.get(this.division);

        // if (this.id == DEBUG_ID) {
        //     console.log("******", this);
        // }

        if (this.points >= division.promotion) {
            if (division.division > 1) {
                // if (this.id == DEBUG_ID) {
                // console.log(
                //     `player ${this.id} is promoted to division ${
                //         this.division - 1
                //     } with ${this.points} points`
                // );
                // }
                this.moveDivs(division, this.division - 1);
            }
            this.reset();
        } else if (this.points >= division.relegation) {
            if (
                this.points + 3 * (MATCHES_PER_SEASON - this.matches) <
                division.promotion
            ) {
                // Can't possibly get promoted so just restart season in same division.
                this.reset();
            } else {
                // do nothing, keep trying for promotion.
            }
        } else if (
            this.points + 3 * (MATCHES_PER_SEASON - this.matches) <
            division.relegation
        ) {
            if (division.division !== NUM_DIVISIONS) {
                // if (this.id == DEBUG_ID) {
                // console.log(
                //     `player ${this.id} is relegated to division ${
                //         this.division + 1
                //     } with ${this.points} points`
                // );
                // }
                this.moveDivs(division, this.division + 1);
            }
            this.reset();
        }
        // if (this.id == DEBUG_ID) {
        //     console.log("after", this);
        // }
    }

    reset() {
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
    }
}

class Division {
    players: Map<number, Player> = new Map();
    private keyArray: number[];

    relegation: number;
    promotion: number;
    title: number;

    constructor(public division: number) {
        switch (division) {
            case 1:
                this.relegation = 14;
                this.promotion = 31;
                this.title = 23;
                break;
            case 2:
            case 3:
                this.relegation = 12;
                this.promotion = 18;
                this.title = 21;
                break;
            case 4:
            case 5:
                this.relegation = 10;
                this.promotion = 16;
                this.title = 19;
                break;
            case 6:
                this.relegation = 10;
                this.promotion = 16;
                this.title = 18;
                break;
            case 7:
                this.relegation = 8;
                this.promotion = 14;
                this.title = 17;
                break;
            case 8:
                this.relegation = 8;
                this.promotion = 12;
                this.title = 15;
                break;
            case 9:
                this.relegation = 6;
                this.promotion = 10;
                this.title = 13;
                break;
            default:
                this.relegation = 0;
                this.promotion = 9;
        }
    }

    addPlayer(player: Player) {
        this.keyArray = null;
        this.players.set(player.id, player);
    }

    removePlayer(player: Player) {
        this.keyArray = null;
        this.players.delete(player.id);
    }

    private getKeyArray() {
        if (!this.keyArray) {
            this.keyArray = Array.from(this.players.keys());
        }
        return this.keyArray;
    }

    getRandomOpponent(id: number) {
        let opponentid = id;
        while (opponentid == id) {
            opponentid = this.randomKey();
        }

        // console.log(division, opponentid);
        return this.players.get(opponentid);
    }

    private randomKey() {
        let keys = this.getKeyArray();
        return keys[randomNum(keys.length)];
    }

    avgPlayerSkill() {
        let skill = 0;
        for (let key of this.players.keys()) {
            skill += this.players.get(key).skill;
        }
        return skill / this.players.size;
    }
}

const divisionMap = new Map<number, Division>();
let divNum = 1;
while (divNum <= NUM_DIVISIONS) {
    divisionMap.set(divNum, new Division(divNum));
    divNum++;
}

const playersMap = new Map<number, Player>();

const playersPerLevel = Math.floor(NUM_PLAYERS / NUM_LEVELS);
const uniformSkillDist = (id: number) => {
    return Math.floor(id / playersPerLevel) + 1;
};

let div = divisionMap.get(NUM_DIVISIONS);

let skillDist = uniformSkillDist;
let id = 0;
while (id < NUM_PLAYERS) {
    const player = new Player(id, skillDist(id));
    div.addPlayer(player);
    playersMap.set(id, player);
    id++;
}

function statistically(deltaR) {
    const d0 = 0.69;
    const wf = -0.22;
    const df = 0.12;

    const w0 = 1 / (1 + Math.exp(wf * deltaR));
    const d = d0 / (1 + Math.exp(df * Math.abs(deltaR)));
    const w = w0 * (1 - d);
    const l = 1 - w - d;

    return { w, d, l };
}

let iter = 0;
let done: boolean = false;
while (!done) {
    let id = randomNum(NUM_PLAYERS);
    let player = playersMap.get(id);

    let division = divisionMap.get(player.division);
    if (division.players.size < 2) {
        continue;
    }

    const opponent = division.getRandomOpponent(id);
    const chances = statistically(player.skill - opponent.skill);
    const result = Math.random();
    // console.log(player, opponent, chances, result);
    if (result < chances.w) {
        player.wins++;
        opponent.losses++;
    } else if (result < chances.w + chances.d) {
        player.draws++;
        opponent.draws++;
    } else {
        player.losses++;
        opponent.wins++;
    }

    player.check(divisionMap);
    opponent.check(divisionMap);

    iter++;
    if (iter > MAX_ITERS) {
        done = true;
    }
}

divNum = 1;
while (divNum <= NUM_DIVISIONS) {
    let division = divisionMap.get(divNum);
    console.log(divNum, division.players.size, division.avgPlayerSkill());
    divNum++;
}
