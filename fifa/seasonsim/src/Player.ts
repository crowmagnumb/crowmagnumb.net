import { Division } from "./Division";
import { System } from "./System";

// const DEBUG_ID = 1;

export class Player {
    wins: number = 0;
    draws: number = 0;
    losses: number = 0;

    constructor(
        public id: number,
        public skill: number,
        public division: number
    ) {}

    get points() {
        return this.wins * 3 + this.draws * 1;
    }

    get matches() {
        return this.wins + this.draws + this.losses;
    }

    private moveDivs(system: System, division: Division, newDivId: number) {
        division.removePlayer(this);
        this.division = newDivId;
        system.getDivision(newDivId).addPlayer(this);
    }

    check(system: System) {
        let division = system.getDivision(this.division);

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
                this.moveDivs(system, division, this.division - 1);
            }
            this.reset();
        } else if (this.points >= division.relegation) {
            if (
                this.points + 3 * (system.matchesPerSeason - this.matches) <
                division.promotion
            ) {
                // Can't possibly get promoted so just restart season in same division.
                this.reset();
            } else {
                // do nothing, keep trying for promotion.
            }
        } else if (
            this.points + 3 * (system.matchesPerSeason - this.matches) <
            division.relegation
        ) {
            if (division.division !== system.numDivs) {
                // if (this.id == DEBUG_ID) {
                // console.log(
                //     `player ${this.id} is relegated to division ${
                //         this.division + 1
                //     } with ${this.points} points`
                // );
                // }
                this.moveDivs(system, division, this.division + 1);
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
