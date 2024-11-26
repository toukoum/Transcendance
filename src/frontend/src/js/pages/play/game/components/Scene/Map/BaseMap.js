import Game from "../../../Game.js";

export class BaseMap {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
			throw new Error('Invalid game instance');
		}
		this.game = game;
	}

	update() {
	}
}