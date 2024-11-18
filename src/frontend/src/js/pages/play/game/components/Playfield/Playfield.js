import { Box } from "../../utils/models/Box.js";
import { Plane } from "../../utils/models/Plane.js";
import { Ball } from "../Ball/Ball.js";

export class Playfield {
	constructor() {

		this.x = 9;
		this.y = 1;
		this.z = 12;

		// field
		// this.field = new Plane(this.x, this.z, 0x007700, new window.THREE.Vector3(0, 0, 0));
		this.field = new Box(new window.THREE.Vector3(this.x,this.y,this.z), new window.THREE.MeshStandardMaterial({ color: 0x007700 }));
		this.walls = [
			// Mur avant
			new Box(new window.THREE.Vector3(this.x + 2, 2, 1), new window.THREE.MeshStandardMaterial({ color: 0x000000 }), new window.THREE.Vector3(0, this.y / 2, this.z / 2 + 0.5)),
			// Mur arrière
			new Box(new window.THREE.Vector3(this.x + 2, 2, 1), new window.THREE.MeshStandardMaterial({ color: 0x000000 }), new window.THREE.Vector3(0, this.y / 2, -this.z / 2 - 0.5)),
			// Mur gauche
			new Box(new window.THREE.Vector3(1, 2, this.z + 2), new window.THREE.MeshStandardMaterial({ color: 0x000000 }), new window.THREE.Vector3(-this.x / 2 - 0.5, this.y / 2, 0)),
			// Mur droit
			new Box(new window.THREE.Vector3(1, 2, this.z + 2), new window.THREE.MeshStandardMaterial({ color: 0x000000 }), new window.THREE.Vector3(this.x / 2 + 0.5, this.y / 2, 0))
		];

		this.ball = new Ball(0.25, undefined, new window.THREE.Vector3(0, 1, 0));
		this.ball.mesh.velocity = new window.THREE.Vector3(0.1, 0, 0.1);
	}

	addTo(scene) {
		scene.add(this.field.mesh);
		this.walls.forEach(wall => scene.add(wall.mesh));
		scene.add(this.ball.mesh);
	}

	removeFrom(scene) {
		this.field.removeFrom(scene);
		this.walls.forEach(wall => wall.removeFrom(scene));
	}

	update() {
		this.ball.update();

		// Check collision with walls
		this.walls.forEach(wall => {
			if (this.ball.checkCollision(wall)) {
				this.ball.onCollision(wall);
			}
		});
	}
}