import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 5;

const addCube = (scene, side, color) => {
	color = color || 0x00ff00;
	const geometry = new THREE.BoxGeometry(0.3, 2, 1);
	const material = new THREE.MeshBasicMaterial({ color });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	const maxY = 5 - cube.scale.y * 3;
	if (side == "left") cube.position.set(-5 - cube.scale.x + 0.1, maxY, 0);
	else cube.position.set(5 + cube.scale.x - 0.1, maxY, 0);

	return cube;
};

const leftCube = addCube(scene, "left");
const rightCube = addCube(scene, "right", 0xffaabb);

const leftMovement = {
	up: false,
	down: false,
};

const rightMovement = {
	up: false,
	down: false,
};

document.addEventListener("keydown", (event) => {
	switch (event.code) {
		case "KeyW":
			leftMovement.up = true;
			break;
		case "ArrowUp":
			rightMovement.up = true;
			break;
		case "KeyS":
			leftMovement.down = true;
			break;
		case "ArrowDown":
			rightMovement.down = true;
			break;
	}
});

document.addEventListener("keyup", (event) => {
	switch (event.code) {
		case "KeyW":
			leftMovement.up = false;
			break;
		case "ArrowUp":
			rightMovement.up = false;
			break;
		case "KeyS":
			leftMovement.down = false;
			break;
		case "ArrowDown":
			rightMovement.down = false;
			break;
	}
});

const getBoundaryMin = (cube) => {
	return -5 + cube.scale.y * 2;
};

const getBoundaryMax = (cube) => {
	return 5 - cube.scale.y * 2;
};

const handleMovement = (movement, cube, speed) => {
	if (movement.up) {
		cube.translateY(speed);
	}
	if (movement.down) {
		cube.translateY(-speed);
	}
	cube.position.y = THREE.MathUtils.clamp(
		cube.position.y,
		getBoundaryMin(cube),
		getBoundaryMax(cube)
	);
};

const pGeometry = new THREE.PlaneGeometry(5 * 3, 5 * 2);
const pMaterial = new THREE.MeshBasicMaterial({ color: 0xaa00bb });
const plane = new THREE.Mesh(pGeometry, pMaterial);
plane.position.z = 4.8;
scene.add(plane);

window.addEventListener("blur", function () {
	plane.visible = true;
});

window.addEventListener("focus", function () {
	plane.visible = false;
});

// const canvas = document.createElement("canvas");
// const context = canvas.getContext("2d");

// context.fillStyle = "purple";
// context.font = "30px sans-serif";
// context.fillText("Game is unfocused!", 0, 60);

// const texture = new THREE.Texture(canvas);
// texture.needsUpdate = true;

// const material = new THREE.MeshBasicMaterial({
// 	map: texture,
// 	side: THREE.DoubleSide,
// });
// material.transparent = true;
// const text = new THREE.Mesh(new THREE.PlaneGeometry(5 * 3, 5 * 2), material);

// scene.add(text);

const ballMat = new THREE.MeshBasicMaterial({
	color: 0x00aaff,
});
const ballGeo = new THREE.SphereGeometry(0.5, 32, 32);
const ball = new THREE.Mesh(ballGeo, ballMat);
scene.add(ball);

let n = window.innerWidth / (1000 * 10);

const animate = () => {
	handleMovement(leftMovement, leftCube, Math.abs(n * 1.5));
	handleMovement(rightMovement, rightCube, Math.abs(n * 1.5));
	ball.translateX(n * 1.5);
	if (ball.position.x >= 5 || ball.position.x <= -5) n = -n;

	renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
