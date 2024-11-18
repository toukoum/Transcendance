import { BaseState } from "./BaseState.js";

export class WaitingState extends BaseState {
	enter() {
		console.log("[WaitingState] Entering 'waiting' state");
		this.game.ui.setScreen("waiting", this.data);
	}

	exit() {
		console.log("[WaitingState] Exiting 'waiting' state");
		this.game.ui.deleteScreen();
	}
}