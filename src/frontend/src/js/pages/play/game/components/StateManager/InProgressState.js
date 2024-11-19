import { BaseState } from "./BaseState.js";

export class InProgressState extends BaseState {
	enter() {
		console.log("[WaitingState] Entering 'waiting' state");
		console.log("data", this.data);
	}

	exit() {
		console.log("[WaitingState] Exiting 'waiting' state");
	}
}