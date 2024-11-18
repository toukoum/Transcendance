import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import Game from "../../index.js";
import { World } from '../World/World.js';

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
		
		
		this.camera.position.set(this.game.settings.camera.x, this.game.settings.camera.y, this.game.settings.camera.z);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		// this.renderer.setSize(500, 500);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000029, 0.25);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.25;
		this.controls.enableZoom = true;

		// const light = new THREE.DirectionalLight(0xffffff, 1);
		const light = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(light);

		this.word = new World();
		this.word.addTo(this.scene);


		// this.objects = [
		// 	this.controls,
		// 	...this.word.objects
		// ]
		

		document.getElementById(this.game.settings.container).appendChild(this.renderer.domElement);
	}
	
	start() {
		this.render();
	}

	render() {
		requestAnimationFrame(() => this.render());

		// this.objects.forEach(object => object.update());
		this.word.update();
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}

	stop() {
		this.renderer.domElement.remove();
	}
}