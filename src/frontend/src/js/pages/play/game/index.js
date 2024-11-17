import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';

window.THREE = THREE;

export default class Game {
    constructor(settings) {
        this.settings = settings;
        this.controls = null;
    }

    start() {
		const container = document.getElementById(this.settings.container);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            1,
            10000,
        );
        camera.position.x = this.settings.camera.x;
        camera.position.y = this.settings.camera.y;
        camera.position.z = this.settings.camera.z;

		// Add light
        // scene.add(new THREE.AmbientLight(0x06069E));

        const renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000029, 0.25);

        const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;

        const target = new THREE.WebGLRenderTarget(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio,
        );
        target.format = THREE.RGBFormat;
        target.minFilter = THREE.LinearFilter;
        target.generateMipmaps = false;


		container.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        // document.body.appendChild(renderer.domElement);

        function render() {
			requestAnimationFrame(render);
		
			controls.update(); // nécessaire si damping est activé
			renderer.render(scene, camera);
		}
		render();
    }
}