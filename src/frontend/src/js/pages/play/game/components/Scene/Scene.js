import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import Game from "../../Game.js";
import { Field } from './Field.js';
// import { ServerData } from './ServerData.js';
import { Ball } from './Ball.js';
import { Player } from './Player.js';
import { WaterMap } from './Map/WaterMap.js';
import { SynthwaveMap } from './Map/SynthwaveMap.js';
import GameLocal from '../../../local/GameLocal.js';

window.THREE = THREE;

export class Scene {
	constructor(game) {
		if (!game || (!(game instanceof Game) && !game instanceof GameLocal)) {
			throw new Error("[Game Scene] Game instance is required");
		}
		this.game = game;
		this.players = [];
		
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		this.renderer = new THREE.WebGLRenderer({ antialias: false });
		
		
		this.camera.position.set(this.game.settings.camera.position.x, this.game.settings.camera.position.y, this.game.settings.camera.position.z);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x000029, 0.25);
		this.renderer.setClearColor(0x000029, 0.25);
	
		this.renderPass = new RenderPass(this.scene, this.camera);
		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			0.5, 0.5, 0.1
		);
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(this.renderPass);
		this.composer.addPass(this.bloomPass);

		// Controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = true;
		this.controls.maxPolarAngle = Math.PI / 2 - (10 * Math.PI / 180);
		this.controls.minDistance = 5;
		this.controls.maxDistance = 100;

		/* -------------------------------- Lighting -------------------------------- */
		// const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		// this.scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
		directionalLight.position.set(5, 10, 2);
		this.scene.add(directionalLight);

		// Fog
		this.scene.fog = new THREE.FogExp2(0x000029, 0.02);
		/* -------------------------------------------------------------------------- */

		/* --------------------------------- Helpers -------------------------------- */
		// const gridHelper = new THREE.GridHelper(100, 100);
		// this.scene.add(gridHelper);
		// const axesHelper = new THREE.AxesHelper(50);
		// this.scene.add(axesHelper);
		/* -------------------------------------------------------------------------- */

		this.lastUpdateTime = Date.now();

		/* -------------------------------- Game Item ------------------------------- */
		this.field = undefined;
		this.ball = undefined;
		this.player_1 = undefined;
		this.player_2 = undefined;
		/* -------------------------------------------------------------------------- */

		/* ---------------------------------- World --------------------------------- */
		this.map = undefined;
		/* -------------------------------------------------------------------------- */

		window.router.addListener(window, "resize", () => this.resize());
		this.resize();
		document.getElementById(this.game.settings.container).appendChild(this.renderer.domElement);
	}
	
	start() {
		this.render();
	}

	render() {
		this.animationFrameId = requestAnimationFrame(() => this.render());

		this.update();
		this.controls.update();
		this.composer.render();
	}

	stop() {
		this.renderer.domElement.remove();

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	update() {
		const now = Date.now();
		const deltaTime = (now - this.lastUpdateTime) / 1000;
		this.lastUpdateTime = now;

		if (this.map) {
			this.map.update();
		}
		if (this.ball) {
			this.ball.update(deltaTime);
		}
		if (this.player_1) {
			this.player_1.update();
		}
		if (this.player_2) {
			this.player_2.update();
		}
	}

	/* ---------------------------------- Tools --------------------------------- */

	adjustCameraToField() {
		if (!this.field) {
			return console.warn("[Game Scene] Field is required to adjust camera");
		}
	
		const cameraAngle = this.game.settings.camera.angle * (Math.PI / 180);
		const aspectRatio = this.camera.aspect;
		const fieldSize = Math.max(this.field.width, this.field.height);
	
		// Facteur pour éloigner la caméra
		const zoomFactor = 1.5; // Augmenter cette valeur pour éloigner davantage
	
		const horizontalDistance = zoomFactor * (fieldSize / aspectRatio) / (2 * Math.tan(this.camera.fov * Math.PI / 360));
		const z = horizontalDistance * Math.cos(cameraAngle); // Distance horizontale le long de l'axe z
		const y = horizontalDistance * Math.sin(cameraAngle); // Hauteur de la caméra
	
		this.camera.position.set(0, y, z);
		this.camera.lookAt(0, 0, 0);
	}


	/* ------------------------------- Syncing ------------------------------- */

	syncWithServer() {
		if (!this.game.serverData) {
			return console.warn("[Game Scene] Server data is required");
		}
		if (this.game.serverData.match.map) {
			if (!this.map) {
				this.createMap(this.game.serverData.match.map);
			}
		}

		if (this.game.serverData.field) {
			if (this.field) {
				this.field.updateFromServer(this.game.serverData.field);
			} else {
				this.field = new Field(this.game.serverData.field.width, this.game.serverData.field.height);
				this.scene.add(this.field.mesh);
				this.adjustCameraToField();
			}
		}

		if (this.game.serverData.ball) {
			if (this.ball) {
				this.ball.updateFromServer(this.game.serverData.ball);
			} else {
				this.ball = new Ball(this.game.serverData.ball);
				this.ball.addTo(this.scene);
			}
		}

		if (this.game.serverData.player_1) {
			if (this.player_1) {
				this.player_1.updateFromServer(this.game.serverData.player_1);
			} else {
				this.player_1 = new Player(this.game.serverData.player_1);
				this.scene.add(this.player_1.paddle);
			}
		}

		if (this.game.serverData.player_2) {
			if (this.player_2) {
				this.player_2.updateFromServer(this.game.serverData.player_2);
			} else {
				this.player_2 = new Player(this.game.serverData.player_2);
				this.scene.add(this.player_2.paddle);
			}
		}
	}

	/* ---------------------------------- Utils --------------------------------- */


	/* ---------------------------------- Size ---------------------------------- */

	resize() {
		const container = document.getElementById(this.game.settings.container);
		if (container) {
			const width = container.clientWidth;
			const height = container.clientHeight;

			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
			this.composer.setSize(width, height);
		} else {
			console.warn("[Game Scene] Container not found");
		}
	}

	/* --------------------------------- Map --------------------------------- */

	createMap(map) {
		switch (map) {
			case "water":
				this.map = new WaterMap(this.game);
				this.map.addTo(this.scene);
				break;
			default:
				this.map = new SynthwaveMap(this.game);
				this.map.addTo(this.scene);
				break;
		}
	}
}