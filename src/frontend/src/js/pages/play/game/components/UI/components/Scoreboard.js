import Game from "../../../Game.js";
import GameLocal from "../../../../local/GameLocal.js";

export class ScoreboardComponent {
    constructor(game) {
        if (!game || (!(game instanceof Game) && !(game instanceof GameLocal))) {
            throw new Error('ScoreboardComponent requires a Game instance');
        }
        this.game = game;
        this.element = null;
    }

    init() {
        this.element = document.createElement("game-scoreboard-component");
        this.element.id = "game-scoreboard";
        this.game.container.appendChild(this.element);
        this.element = document.querySelector('#game-scoreboard');
    }

    show() {
        if (!this.element) this.init();
    }

    update(data) {
        const player1 = document.querySelector('#scoreboard__player_1');
        const player2 = document.querySelector('#scoreboard__player_2');
        if (player1) player1.textContent = this.game.serverData.player_1.user.username;
        if (player2) player2.textContent = this.game.serverData.player_2.user.username;
        const player1_score = document.querySelector('#scoreboard__score_player1');
        const player2_score = document.querySelector('#scoreboard__score_player2');
        if (player1_score) player1_score.textContent = this.game.serverData.player_1.score
        if (player2_score) player2_score.textContent = this.game.serverData.player_2.score

        const timer = document.querySelector('#scoreboard__timer_value');
        if (timer) timer.textContent = this.formatTime(this.game.serverData.match.duration - this.game.serverData.elapsed_time);
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    formatTime(time) {
        const isOvertime = time < 0;
        const absoluteTime = Math.abs(time);
        const minutes = Math.floor(absoluteTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(absoluteTime % 60).toString().padStart(2, '0');
        return `${isOvertime ? '+' : ''}${minutes}:${seconds}`;
    }
}
