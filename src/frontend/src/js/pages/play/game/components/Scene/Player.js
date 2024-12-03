export class Player {
	constructor(data) {
		// this.user_id = data.user_id;
		this.user = data.user;

		this.paddleHeight = 1;
		this.paddle = new window.THREE.Mesh(
			new window.THREE.BoxGeometry(data.paddle.width, this.paddleHeight, data.paddle.height),
			new window.THREE.MeshStandardMaterial({
				color: 0x0071e3,
				emissive: 0x0071e3,
				emissiveIntensity: 5,
			})
		);
		// this.paddle.position.set(data.paddle.x, 0, data.paddle.y);
		this.paddle.position.set(data.paddle.x, this.paddleHeight / 2, data.paddle.y);
		this.paddle.velocity = new window.THREE.Vector3(0, 0, data.paddle.vy);
	}

	updateFromServer(data) {
		if (this.paddle.geometry.parameters.width !== data.paddle.width || this.paddle.geometry.parameters.height !== data.paddle.height) {
			this.paddle.geometry.dispose();
			this.paddle.geometry = new window.THREE.BoxGeometry(data.paddle.width, 1, data.paddle.height);
		}
		this.paddle.position.set(data.paddle.x, this.paddleHeight / 2, data.paddle.y);
		this.paddle.velocity.set(0, 0, data.paddle.vy);
	}

	update() {
	}
}