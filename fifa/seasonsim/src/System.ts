import { randomInt } from "./utils";
import { Division } from "./Division";
import { Player } from "./Player";

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

export class System {
    playersMap = new Map<number, Player>();
    divisionMap = new Map<number, Division>();
    matchesPerSeason = 10;

    constructor(
        public numDivs: number,
        public numPlayers: number,
        skillDist: (id: number) => number
    ) {
        let divNum = 1;
        while (divNum <= numDivs) {
            this.divisionMap.set(divNum, new Division(divNum));
            divNum++;
        }

        //
        // Start each player at the bottom.
        //
        let div = this.getDivision(numDivs);

        let id = 0;
        while (id < numPlayers) {
            const player = new Player(id, skillDist(id), div.division);
            div.addPlayer(player);
            this.playersMap.set(id, player);
            id++;
        }
    }

    getDivision(divNum: number) {
        return this.divisionMap.get(divNum);
    }

    getPlayer(id: number) {
        return this.playersMap.get(id);
    }

    operateOnDivs(fn: (division: Division) => void) {
        let divNum = 1;
        while (divNum <= this.numDivs) {
            fn(this.getDivision(divNum));
            divNum++;
        }
    }

    simulateRandomMatch() {
        let id = randomInt(this.numPlayers);
        let player = this.getPlayer(id);

        let division = this.getDivision(player.division);
        if (division.players.size < 2) {
            return;
        }

        const opponent = division.getRandomOpponent(id);
        const chances = statistically(player.skill - opponent.skill);
        const result = Math.random();

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

        player.check(this);
        opponent.check(this);
    }
}
