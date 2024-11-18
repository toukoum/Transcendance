import Game from "../../index.js";
import { BaseState } from "./BaseState.js";
import { WaitingState } from "./WaitingState.js";

export class StateManager {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
			throw new Error("[Game: StateManager] Game instance is required");
		}
		this.game = game;
		this.state = null;
		this.states = {
			waiting: WaitingState,
			in_progress: BaseState,
		}
	}

	setState(state) {
		if (this.state) {
			this.state.exit(); // Exit the current state
		}
		console.log(`[Game: StateManager] Entering state ${state.constructor.name}`);
		this.state = state;
		this.state.enter(); // Enter the new state
	}


	handleEvent(eventType, data) {
		const StateClass = this.states[eventType];
		if (StateClass) {
			this.setState(new StateClass(this.game, data));
		} else {
			console.warn(`[Game: StateManager] Unknown state ${eventType}`);
		}
	}
}