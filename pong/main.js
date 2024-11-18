// scene

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// table et raquette

const tableGeometry = new THREE.PlaneGeometry(40, 24);
const tableMaterial = new THREE.MeshBasicMaterial( {color: 0x0077ff, side: THREE.DoubleSide });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.rotation.x = -Math.PI / 2;
scene.add(table);

const paddleGeometry = new THREE.BoxGeometry(1, 1, 8);
const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.4, roughness: 0.6,});
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddle1.position.set(-19.5, 0.5, 0);
scene.add(paddle1);

const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddle2.position.set(19.5, 0.5, 0);
scene.add(paddle2);

const ballGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x333333, metalness: 0.7, roughness: 0.3,});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 1.2, 0);
scene.add(ball);


// raquette avec image 


// const textureLoader = new THREE.TextureLoader();
// const paddleTexture = textureLoader.load("textures/wood.jpg");
// const ballTexture = textureLoader.load("textures/metal.jpg");

// paddle1.material.map = paddleTexture;
// paddle2.material.map = paddleTexture;
// ball.material.map = ballTexture;


// light

// const light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(5, 10, 5);
// scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 2);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 1, 10);
pointLight.position.set(ball.position.x, ball.position.y, ball.position.z);
scene.add(pointLight);

function updateLight()
{
	pointLight.position.set(ball.position.x, ball.position.y, ball.position.z);
}

//camera 

camera.position.z = 30;
camera.position.y = 25;
camera.lookAt(0, 0, 0);

//fond

const planeGeometry = new THREE.PlaneGeometry(400, 400);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0x202020, side: THREE.BackSide,});
const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
backgroundPlane.position.set(camera.position.x, camera.position.y - 50, camera.position.z - 50);
scene.add(backgroundPlane);
backgroundPlane.rotation.x = Math.PI;

function animatedBackground() {
	const time = Date.now() * 0.0002
	const hue = 0.5 + (Math.sin(time) * 0.125);
	const saturation = 0.6;
	const lightness = 0.3;
	backgroundPlane.material.color.setHSL(hue, saturation, lightness);
}


// deplacement des raquettes

let paddle1Direction = 0;
let paddle2Direction = 0;

window.addEventListener('keydown', (event) => {
	switch (event.key)
	{
		case 'w':
			paddle1Direction = -1;
			break;
		case 's':
			paddle1Direction = 1;
			break;
		case 'ArrowUp':
			paddle2Direction = -1;
			break;
		case 'ArrowDown':
			paddle2Direction = 1;
			break;
	}
});

window.addEventListener('keyup', (event) => {
	switch (event.key)
	{
		case 'w':
		case 's':
			paddle1Direction = 0;
			break;
		case 'ArrowUp':
		case 'ArrowDown':
			paddle2Direction = 0;
			break;
	}
});

// deplacement de la balle

let ballSpeedX = 0.15;
let ballSpeedZ = 0.10;

function limitSpeed(speed, maxSpeed)
{
	return Math.sign(speed) * Math.min(Math.abs(speed), maxSpeed);
}

// comptage des points

let playerScore1 = 0;
let playerScore2 = 0;

function resetBallAndScore(winner)
{
	if (winner === 1)
		playerScore1++;
	else
		playerScore2++;

	document.getElementById("player1-score").textContent = playerScore1;
	document.getElementById("player2-score").textContent = playerScore2;

	if (playerScore1 >= 5)
	{
		alert("Player 1 WON !");
		resetGame();
	}
	else if(playerScore2 >= 5)
	{
		alert("Player 2 WON !");
		resetGame();
	}
	else
	{
		ball.position.set(0, 1.2, 0);
		ballSpeedX = 0.15 * (Math.random() > 0.5 ? 1 : -1);
		ballSpeedZ = 0.10 * (Math.random() > 0.5 ? 1 : -1);
	}
}

function resetGame()
{
	playerScore1 = 0;
	playerScore2 = 0;

	document.getElementById("player1-score").textContent = playerScore1;
	document.getElementById("player2-score").textContent = playerScore2;

	ball.position.set(0, 1.2, 0);
	ballSpeedX = 0.15 * (Math.random() > 0.5 ? 1 : -1);
	ballSpeedZ = 0.10 * (Math.random() > 0.5 ? 1 : -1);
}

// jeu

function animate()
{
	requestAnimationFrame( animate );

	updateLight();

	animatedBackground();

	//deplacement raquette

	paddle1.position.z += paddle1Direction * 0.2;
	paddle2.position.z += paddle2Direction * 0.2;

	paddle1.position.z = Math.max(-10, Math.min(10, paddle1.position.z));
	paddle2.position.z = Math.max(-10, Math.min(10, paddle2.position.z));

	// deplacement balle

	ball.position.x += ballSpeedX;
	ball.position.z += ballSpeedZ;

	if (ball.position.z > 12 || ball.position.z < -12)
	{
		ballSpeedZ *= -1;
		ballSpeedX *= 0.99;
	}

	if (ball.position.x < -17.5 && Math.abs(ball.position.z - paddle1.position.z) < 4)
	{
		const impact = ball.position.z - paddle1.position.z;
		ballSpeedX *= -1;
		ballSpeedZ += impact * 0.05;
		ballSpeedX *= 1.05;
		ballSpeedZ *= 1.05;
		ballSpeedX = limitSpeed(ballSpeedX, 0.3);
		ballSpeedZ = limitSpeed(ballSpeedZ, 0.15);
	}

	if (ball.position.x > 17.5 && Math.abs(ball.position.z - paddle2.position.z) < 4)
	{
		const impact = ball.position.z - paddle2.position.z;
		ballSpeedX *= -1;
		ballSpeedZ += impact * 0.05;
		ballSpeedX *= 1.05;
		ballSpeedZ *= 1.05;
		ballSpeedX = limitSpeed(ballSpeedX, 0.3);
		ballSpeedZ = limitSpeed(ballSpeedZ, 0.15);
	}

	if (ball.position.x > 20)
		resetBallAndScore(1);
	if (ball.position.x < -20)
		resetBallAndScore(2);
	

	renderer.render( scene, camera );
}

animate();
