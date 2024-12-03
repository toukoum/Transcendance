import { BaseMap } from "./BaseMap.js";

export class SynthwaveMap extends BaseMap {
	constructor(game) {
		super(game);

		this.lava = new window.THREE.Mesh(
			new window.THREE.PlaneGeometry(1000, 1000, 1000, 50),
			new window.THREE.MeshStandardMaterial({
				color: 0xf542d4,
				wireframe: true,
				emissive: 0xf542d4,
				emissiveIntensity: 2,
			})
		);

		this.lava.rotation.x = -Math.PI / 2;
		this.lava.position.y = -5;
		this.particles = [];
		for (let i = 0; i < 200; i++) {
			const particle = new window.THREE.Mesh(
				new window.THREE.SphereGeometry(0.1),
				new window.THREE.MeshStandardMaterial({
					color: 0xf542d4,
					emissive: 0xf542d4,
					emissiveIntensity: 5,
				})
			);
			particle.position.set(
				(Math.random() - 0.5) * 100,
				Math.random() * 50,
				(Math.random() - 0.5) * 100
			);
			this.particles.push(particle);
		}

	}

	update() {
		this.animateVolcanic();
	}

	addTo(scene) {
		super.addTo(scene);
		scene.add(this.lava);
		this.particles.forEach((particle) => scene.add(particle));
	}

	animateVolcanic() {
		const lavaVertices = this.lava.geometry.attributes.position.array;
		for (let i = 0; i < lavaVertices.length; i += 3) {
			lavaVertices[i + 2] = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.5;
		}
		this.lava.geometry.attributes.position.needsUpdate = true;

		this.particles.forEach((particle) => {
			particle.position.y -= 0.1;
			if (particle.position.y < 0) particle.position.y = 50;
		});
	}
}
