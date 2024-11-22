import Game from "../../index.js";
import { InProgressState } from "./InProgressState.js";
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
			in_progress: InProgressState,
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

	handleStateChange(state) {
		const StateClass = this.states[state];
		if (StateClass) {
			this.setState(new StateClass(this.game));
		} else {
			console.warn(`[Game: StateManager] Unknown state ${state}`);
		}
	}


	handleEvent(message) {
		// here type should start with `game.` and then the state

		const type = message.type.split(".")[1].trim();
		console.log(`[Game: StateManager] Received message`, message);
		switch (type){
			case "state":
				// Handle main state (created, wainting, ready, initializing, in_progress, finished)
				if (!message.state) {
					console.error("[Game: StateManager] State is required");
					return;
				}
				if (message.dataMatch) {
					window.game.scene.handleServerData(message.dataMatch);
					// this.game.scene.handleServerData(message.dataMatch);
				}
				this.handleStateChange(message.state);
				break;
			
		}

		console.log(`[Game: StateManager] Game is in state ${type}`);



		// const StateClass = this.states[eventType];
		// if (StateClass) {
		// 	this.setState(new StateClass(this.game, data));
		// } else {
		// 	console.warn(`[Game: StateManager] Unknown state ${eventType}`);
		// }
	}
}