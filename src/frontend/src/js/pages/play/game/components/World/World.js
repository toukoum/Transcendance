import { Plane } from "../../utils/models/Plane.js";
import { Playfield } from "../Playfield/Playfield.js";

export class World {
	constructor() {
		this.ground = new Plane(100, 100, 0xffa500);
		this.playfield = new Playfield();

		this.objects = [];
	}

	addTo(scene) {
		scene.add(this.ground.mesh);
		// scene.add(this.playfield);
		// this.ground.addTo(scene);
		this.playfield.addTo(scene);
	}

	update() {
		this.playfield.update();
	}
}