import Game from "../../../Game.js";
import { CountdownComponent } from "../components/Countdown.js";
import { NetworkStatusComponent } from "../components/NetworkStatus.js";
import { RoundWinnerComponent } from "../components/RoundWinner.js";
import { ScoreboardComponent } from "../components/Scoreboard.js";
import { BaseScreen } from "./BaseScreen.js";

export class InProgressScreen extends BaseScreen {
    constructor(game, name, data = {}) {
        super(game, name, data);
        this.countdown = new CountdownComponent(this.game.container)
        this.roundWinner = new RoundWinnerComponent(this.game.container)
        this.networkStatus = game instanceof Game ? new NetworkStatusComponent(this.game.container) : null;
        this.scoreboard = new ScoreboardComponent(this.game);

        if (game instanceof Game) {
            this.game.pingManager.subscribe((ping) => {
                if (this.networkStatus) this.networkStatus.update({  ping: ping.averagePing });
            });
        }
    }
    enter() {
        super.enter();
        if (this.networkStatus) this.networkStatus.show();
        this.scoreboard.show();
    }

    update(data) {
		super.update(data);
        
        if (this.data) {
            if (this.data.countdown) {
                this.countdown.update(this.data.countdown);
                this.roundWinner.remove();
            }
    
            if (this.data.round_winner) {
                this.roundWinner.show(this.data.round_winner);
            }
        }

        this.scoreboard.update(this.game.serverData);
	}

    exit() {
        this.countdown.remove();
        this.roundWinner.remove();
        this.scoreboard.remove();
        if (this.networkStatus) this.networkStatus.remove();
        super.exit();
    }
}
