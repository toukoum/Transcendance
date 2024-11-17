import { Component } from "../../utils/Component.js";
import GameTHREE from "./game/index.js";

import { api } from "../../utils/api/Api.js";

const gameSettings = {
	camera: {
		x: 0,
		y: 0,
		z: 5
	},
	container: "scene"
}

export class Game extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div id="scene" class="h-100">
			</div>

			<!-- Add panel to say game is waiting others player -->
			<div id="waiting-player-screen" class="position-absolute top-50 start-50 translate-middle bg-background p-2 rounded" style="display: none;">Waiting player</div>
			<div id="network-error-screen" class="position-absolute top-50 start-50 translate-middle bg-background p-2 rounded" style="display: none;">Network error</div>
		</main-layout>
		`);
	}

	script() {
		const gameId = parseInt(this.getAttribute("id"));
		let game = window.isInGame;
		if (!game || game.id !== gameId) {
			window.router.redirect("/play");
		}
		const ws = api.game.connect(gameId);

		const gameThree = new GameTHREE(gameSettings);
		gameThree.start();

		// console.log("Game", game);
		// // Connect to game

		// let pingInterval;

		// // Console message from ws
		// ws.on("open", () => {
		// 	console.log("Connected to game");

		// 	pingInterval = setInterval(() => {
		// 		ws.send({
		// 			type: "game_ping",
		// 			timestamp: Date.now()
		// 		});
		// 	}, 1000);
		// });
		// ws.on("message", (data) => {
		// 	console.log("Message from game", data);
		// });

		// // If game is state is waiting
		// if (game.state === "waiting") {
		// 	document.getElementById("waiting-player-screen").style.display = "block";
		// } else {
		// 	document.getElementById("waiting-player-screen").style.display = "none";
		// }



		// // get size of scene
		// const div = document.getElementById("scene");
		// const windowWidth = div.clientWidth;
		// const windowHeight = 1118;
		// console.log(windowWidth, windowHeight);
		// // Constants
		// // const defaultCamera = {
		// // 	position: { x: 0, y: 0, z: 5 },
		// // 	rotation: { x: 2, y: 2, z: 2 }
		// // }

		// const scene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
		// const controls = new OrbitControls(camera, div);
		// controls.enableDamping = true;
		// controls.dampingFactor = 0.25;
		// controls.enableZoom = true;
		
		// // camera.position.set(defaultCamera.position.x, defaultCamera.position.y, defaultCamera.position.z);
		// // camera.rotation.set(defaultCamera.rotation.x, defaultCamera.rotation.y, defaultCamera.rotation.z);
        // const renderer = new THREE.WebGLRenderer({ alpha: true });
        
        // renderer.setSize(windowWidth, windowHeight);
        // document.getElementById("scene").appendChild(renderer.domElement);

        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        // camera.position.z = 5;

		// function animate() {
		// 	requestAnimationFrame(animate);
		
		// 	controls.update(); // nécessaire si damping est activé
		// 	renderer.render(scene, camera);
		// }
		// animate();

		// renderer.render(scene, camera);
	}
}

customElements.define("play-game-page", Game);