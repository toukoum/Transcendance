import { CountdownComponent } from "../components/Countdown.js";
import { RoundWinnerComponent } from "../components/RoundWinner.js";
import { BaseScreen } from "./BaseScreen.js";

export class InProgressScreen extends BaseScreen {
    constructor(game, name, data = {}) {
        super(game, name, data);
        this.countdown = new CountdownComponent(this.game.container)
        this.roundWinner = new RoundWinnerComponent(this.game.container)
    }
    enter() {
        super.enter();
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
	}

    exit() {
        this.countdown.remove();
        super.exit();
    }
}
