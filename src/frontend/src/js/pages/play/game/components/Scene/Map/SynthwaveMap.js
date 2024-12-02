import { BaseMap } from "./BaseMap.js";

export class SynthwaveMap extends BaseMap {
	constructor(game) {
		super(game);

		this.lava = new window.THREE.Mesh(
			new window.THREE.PlaneGeometry(1000, 1000, 1000, 50),
			new window.THREE.MeshBasicMaterial({
				color: 0x0071e3,
				wireframe: true,
			})
		);

		this.lava.rotation.x = -Math.PI / 2;
		this.lava.position.y = -5;
		this.particles = [];
		for (let i = 0; i < 200; i++) {
			const particle = new window.THREE.Mesh(
				new window.THREE.SphereGeometry(0.1),
				new window.THREE.MeshBasicMaterial({ color: 0xffd700 })
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
		console.log("[SynthwaveMap] Update");
		this.animateVolcanic();
	}

	addTo(scene) {
		super.addTo(scene);
		console.log('Adding Synthwave map to scene');
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

// background 

// const lavaGeometry = new THREE.PlaneGeometry(120, 80, 50, 50);
// const lavaMaterial = new THREE.MeshBasicMaterial({
//     color: 0xff4500,
//     wireframe: true,
// });
// const lava = new THREE.Mesh(lavaGeometry, lavaMaterial);
// lava.rotation.x = -Math.PI / 2;
// lava.position.y = -5;
// scene.add(lava);

// const particles = [];
// for (let i = 0; i < 200; i++) {
//     const particleGeometry = new THREE.SphereGeometry(0.1);
//     const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
//     const particle = new THREE.Mesh(particleGeometry, particleMaterial);
//     particle.position.set(
//         (Math.random() - 0.5) * 100,
//         Math.random() * 50,
//         (Math.random() - 0.5) * 100
//     );
//     particles.push(particle);
//     scene.add(particle);
// }

// // Animation de la lave et des cendres
// function animateVolcanic() {
//     const lavaVertices = lava.geometry.attributes.position.array;
//     for (let i = 0; i < lavaVertices.length; i += 3) {
//         lavaVertices[i + 2] = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.5;
//     }
//     lava.geometry.attributes.position.needsUpdate = true;

//     particles.forEach((particle) => {
//         particle.position.y -= 0.1;
//         if (particle.position.y < 0) particle.position.y = 50;
//     });
// }

// // musique

// const backgroundMusic = new Audio('music/music1.mp3');

// backgroundMusic.loop = true;

// backgroundMusic.volume = 0.5;

// const toggleButton = document.getElementById('toggle-music');
// const volumeControl = document.getElementById('volume-control');

// toggleButton.addEventListener('click', () => {
// if (backgroundMusic.paused)
// {
// backgroundMusic.play().catch((error) => {
// console.error("Erreur lors de la lecture de la musique :", error);
// });
// toggleButton.textContent = "🎵 Stop";
// }Scene
// else
// {
// backgroundMusic.pause();
// toggleButton.textContent = "🎵 Play";
// }
// });

// volumeControl.addEventListener('input', (event) => {
// backgroundMusic.volume = event.target.value;
// });

// // jeu

// function animate() {
// requestAnimationFrame( animate );
// animateVolcanic();

// }

// animate();