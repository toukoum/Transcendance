import { BaseState } from "./State.js";

export class WaitingState extends BaseState {
	enter() {
		// this.game.ui.setScreen("waiting", this.data);
		this.game.ui.activateComponent("waiting", this.data);
	}

	exit() {
		// this.game.ui.deleteScreen();
		this.game.ui.desactivateScreen();
	}
}