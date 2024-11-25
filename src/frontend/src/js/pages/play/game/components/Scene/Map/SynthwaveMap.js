import { BaseMap } from "./BaseMap.js";

export class SynthwaveMap extends BaseMap {
	constructor(game) {
		super(game);
	}

	update() {
		console.log("[SynthwaveMap] Update");
	}
}