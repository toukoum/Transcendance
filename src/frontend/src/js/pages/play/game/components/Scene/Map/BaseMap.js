import Game from "../../../index.js";

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