import GameLocal from "./GameLocal";

export class Local {
	constructor(game) {
		if (!game || !(game instanceof GameLocal)) {
			throw new Error("[Game: Local] Game instance is required");
		}
		this.game = game;
		
	}
}