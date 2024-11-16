import { Component } from "../../utils/Component.js";

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';

export class Game extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div id="scene" class="h-100">
				Game: ${this.getAttribute("id")}
			</div>
		</main-layout>
		`);
	}

	script() {
		// get size of scene
		const div = document.getElementById("scene");
		const windowWidth = div.clientWidth;
		const windowHeight = 1118;
		console.log(windowWidth, windowHeight);
		// Constants
		// const defaultCamera = {
		// 	position: { x: 0, y: 0, z: 5 },
		// 	rotation: { x: 2, y: 2, z: 2 }
		// }

		const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
		const controls = new OrbitControls(camera, div);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;
		
		// camera.position.set(defaultCamera.position.x, defaultCamera.position.y, defaultCamera.position.z);
		// camera.rotation.set(defaultCamera.rotation.x, defaultCamera.rotation.y, defaultCamera.rotation.z);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        renderer.setSize(windowWidth, windowHeight);
        document.getElementById("scene").appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

		function animate() {
			requestAnimationFrame(animate);
		
			controls.update(); // nécessaire si damping est activé
			renderer.render(scene, camera);
		}
		animate();

		// renderer.render(scene, camera);
	}
}

customElements.define("play-game-page", Game);