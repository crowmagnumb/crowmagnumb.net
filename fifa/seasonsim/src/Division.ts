import { randomInt } from "./utils";
import { Player } from "./Player";

export class Division {
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

        return this.players.get(opponentid);
    }

    private randomKey() {
        let keys = this.getKeyArray();
        return keys[randomInt(keys.length)];
    }

    avgPlayerSkill() {
        let skill = 0;
        for (let key of this.players.keys()) {
            skill += this.players.get(key).skill;
        }
        return skill / this.players.size;
    }
}
