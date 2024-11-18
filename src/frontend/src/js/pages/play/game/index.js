import { Client } from './components/Client.js';
import { StateManager } from './components/StateManager/StateManager.js';
import { UI } from './components/UI/UI.js';
import { PingManager } from './components/PingManager.js';
import { Scene } from './components/Scene/Scene.js';

export default class Game {
    constructor(settings) {
        this.settings = settings;
        this.container = document.getElementById(settings.container);

        this.client = new Client(this, settings.gameId);
        this.pingManager = new PingManager(this.client);
        this.pingManager.start();
        this.ui = new UI(this);
        this.stateManager = new StateManager(this);

        this.scene = new Scene(this);
    }

    start() {
        this.scene.start();
    }

    // start() {
    //     this.initScene();
    //     // this.initClient();
    //     this.render();
    // }

    // initScene() {
    //     const { container, camera } = this.settings;

    //     this.scene = new THREE.Scene();
    //     this.camera = new THREE.PerspectiveCamera(
    //         70,
    //         window.innerWidth / window.innerHeight,
    //         1,
    //         10000,
    //     );
    //     this.camera.position.set(camera.x, camera.y, camera.z);

    //     this.renderer = new THREE.WebGLRenderer({ antialias: false });
    //     this.renderer.setPixelRatio(window.devicePixelRatio);
    //     this.renderer.setSize(window.innerWidth, window.innerHeight);
    //     this.renderer.setClearColor(0x000029, 0.25);

    //     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //     this.controls.enableDamping = true;
    //     this.controls.dampingFactor = 0.25;
    //     this.controls.enableZoom = true;
        
    //     const light = new THREE.AmbientLight(0x06069E);
    //     this.scene.add(light);

    //     document.getElementById(container).appendChild(this.renderer.domElement);
    // }

    // // initClient() {
    // //     const { gameId } = this.settings;
    // //     this.client = new Client(this, gameId);
    // //     this.pingManager = new PingManager(this.client);
    // //     this.pingManager.start();
    // // }

    // render() {
    //     requestAnimationFrame(() => this.render());
    //     this.controls.update();
    //     this.renderer.render(this.scene, this.camera);
    // }

//     start() {
// 		const container = document.getElementById(this.settings.container);
//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(
//             70,
//             window.innerWidth / window.innerHeight,
//             1,
//             10000,
//         );
//         camera.position.x = this.settings.camera.x;
//         camera.position.y = this.settings.camera.y;
//         camera.position.z = this.settings.camera.z;

// 		// Add light
//         // scene.add(new THREE.AmbientLight(0x06069E));

//         const renderer = new THREE.WebGLRenderer({ antialias: false });
//         renderer.setPixelRatio(window.devicePixelRatio);
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.setClearColor(0x000029, 0.25);

//         const controls = new OrbitControls(camera, renderer.domElement);
// 		controls.enableDamping = true;
// 		controls.dampingFactor = 0.25;
// 		controls.enableZoom = true;

//         const target = new THREE.WebGLRenderTarget(
//             window.innerWidth * window.devicePixelRatio,
//             window.innerHeight * window.devicePixelRatio,
//         );
//         target.format = THREE.RGBFormat;
//         target.minFilter = THREE.LinearFilter;
//         target.generateMipmaps = false;


// 		container.appendChild(renderer.domElement);

//         const geometry = new THREE.BoxGeometry();
//         const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//         const cube = new THREE.Mesh(geometry, material);
//         scene.add(cube);
//         // document.body.appendChild(renderer.domElement);

//         function render() {
// 			requestAnimationFrame(render);
		
// 			controls.update(); // nécessaire si damping est activé
// 			renderer.render(scene, camera);
// 		}
// 		render();
//     }
}