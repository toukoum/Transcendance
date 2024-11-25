import Game from "../../Game.js";
import { State } from "./State.js";

export class StateManager {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
			throw new Error("[Game: StateManager] Game instance is required");
		}
		this.game = game;
	}

	handleEvent(message) {
		const type = message.type.split(".")[1].trim();

		if (message.dataMatch) {
			this.game.serverData.update(message.dataMatch);
		}
		switch (type){
			case "state":
				if (!message.state) {
					console.error("[Game: StateManager] State is required");
					return;
				}
				this.game.ui.activateScreen(message.state, message.data);
				break;
			
		}
	}

	/* --------------------------------- States --------------------------------- */
}