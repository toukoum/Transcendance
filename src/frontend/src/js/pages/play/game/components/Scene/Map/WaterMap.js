import { BaseMap } from "./BaseMap.js";

export class WaterMap extends BaseMap {
	constructor(game) {
		super(game);

		this.ocean = new window.THREE.Mesh(
			new window.THREE.PlaneGeometry(1000, 1000, 1000, 50),
			new window.THREE.MeshStandardMaterial({
				color: 0x1e90ff,
				emissive: 0x1e90ff,
				emissiveIntensity: 1,
			})
		);

		this.ocean.rotation.x = -Math.PI / 2;
		this.ocean.position.y = -5;
	}

	update() {
		this.animateWaves();
	}

	addTo(scene) {
		super.addTo(scene);
		scene.add(this.ocean);
	}

	animateWaves() {
		const oceanVertices = this.ocean.geometry.attributes.position.array;
		for (let i = 0; i < oceanVertices.length; i += 3) {
			oceanVertices[i + 2] = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.6;
		}
		this.ocean.geometry.attributes.position.needsUpdate = true;
	}
}