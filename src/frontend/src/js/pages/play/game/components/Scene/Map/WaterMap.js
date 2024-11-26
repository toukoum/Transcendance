import { BaseMap } from "./BaseMap.js";

export class WaterMap extends BaseMap {
	constructor(game) {
		super(game);
	}

	update() {
		console.log("[WaterMap] Update");
	}
}