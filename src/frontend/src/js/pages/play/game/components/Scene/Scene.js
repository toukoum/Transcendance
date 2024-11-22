import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import Game from "../../index.js";
import { Field } from './Field.js';
import { ServerData } from './ServerData.js';
import { Ball } from './Ball.js';
import { Player } from './Player.js';

window.THREE = THREE;

export class Scene {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
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
		// this.renderer.setSize(500, 500);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000029, 0.25);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = true;

		/* -------------------------------- Lighting -------------------------------- */
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 10, 2);
		this.scene.add(directionalLight);
		/* -------------------------------------------------------------------------- */

		const gridHelper = new THREE.GridHelper(100, 100);
		this.scene.add(gridHelper);

		// Server
		this.serverData = undefined;
		// Elements
		this.field = undefined;
		this.ball = undefined;
		this.player_1 = undefined;
		this.player_2 = undefined;


		document.getElementById(this.game.settings.container).appendChild(this.renderer.domElement);
	}
	
	start() {
		this.render();
	}

	render() {
		requestAnimationFrame(() => this.render());

		this.update();
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	stop() {
		this.renderer.domElement.remove();
	}


	update() {
		// if (!this.isInit) {
		// 	return;
		// }

		if (this.ball) {
			this.ball.update();
		}
		if (this.player_1) {
			this.player_1.update();
		}
		if (this.player_2) {
			this.player_2.update();
		}
		// this.checkCollisions();
	}

	/* ---------------------------------- Tools --------------------------------- */

	adjustCameraToField() {
		if (!this.field) {
			return console.warn("[Game Scene] Field is required to adjust camera");
		}
		const cameraAngle = this.game.settings.camera.angle * (Math.PI / 180);
		
		const aspectRatio = this.camera.aspect;
		const fieldSize = Math.max(this.field.width, this.field.height);

		const horizontalDistance = (fieldSize / aspectRatio) / (2 * Math.tan(this.camera.fov * Math.PI / 360));
		const z = horizontalDistance * Math.cos(cameraAngle); // Distance horizontale le long de l'axe z
    	const y = horizontalDistance * Math.sin(cameraAngle); // Hauteur de la caméra


		this.camera.position.set(0, y, z);
		this.camera.lookAt(0, 0, 0);
	}


	/* ------------------------------- Syncing ------------------------------- */

	syncWithServer() {
		if (!this.serverData) {
			return console.warn("[Game Scene] Server data is required");
		}

		console.log("[Game Scene] Syncing with server data", this.serverData);

		if (this.serverData.field) {
			console.log("[Game Scene] Field data", this.serverData.field);
			if (this.field) {
				this.field.updateFromServer(this.serverData.field);
			} else {
				this.field = new Field(this.serverData.field.width, this.serverData.field.height);
				this.scene.add(this.field.mesh);
				this.adjustCameraToField();
			}
		}

		if (this.serverData.ball) {
			console.log("[Game Scene] Ball data", this.serverData.ball);
			if (this.ball) {
				this.ball.updateFromServer(this.serverData.ball);
			} else {
				this.ball = new Ball(this.serverData.ball);
				this.scene.add(this.ball.mesh);
			}
		}

		if (this.serverData.player_1) {
			if (this.player_1) {
				this.player_1.updateFromServer(this.serverData.player_1);
			} else {
				this.player_1 = new Player(this.serverData.player_1);
				this.scene.add(this.player_1.paddle);
			}
		}

		if (this.serverData.player_2) {
			if (this.player_2) {
				this.player_2.updateFromServer(this.serverData.player_2);
			} else {
				this.player_2 = new Player(this.serverData.player_2);
				this.scene.add(this.player_2.paddle);
			}
		}
	}

	/* ---------------------------------- Utils --------------------------------- */

	handleServerData(data) {
		if (this.serverData) {
			this.serverData.update(data);
		} else {
			this.serverData = new ServerData(data);
		}

		this.syncWithServer();

		console.log("[Game Scene] Server data handled", this.player_1, this.player_2);
		if (!this.game.controller.player && this.player_1 && this.player_2) {
			this.game.controller.assignPlayer();
		}
	}
}