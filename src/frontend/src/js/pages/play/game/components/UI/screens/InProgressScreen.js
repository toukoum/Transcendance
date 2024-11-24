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

        if ("countdown" in data) {
            this.countdown.update(data.countdown);
            this.roundWinner.remove();
        }

        if ("round_winner" in data) {
            this.roundWinner.show(data.round_winner);
        }
	}

    exit() {
        this.countdown.remove();
        super.exit();
    }
}
