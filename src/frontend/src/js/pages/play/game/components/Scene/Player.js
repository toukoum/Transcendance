export class Player {
	constructor(data) {
		this.usr_id = data.usr_id;

		this.paddle = new window.THREE.Mesh(
			new window.THREE.BoxGeometry(data.paddle.width, 1, data.paddle.height),
			new window.THREE.MeshStandardMaterial({ color: 0x007700 })
		);
		this.paddle.position.set(data.paddle.x, 0, data.paddle.y);
		this.paddle.velocity = new window.THREE.Vector3(0, 0, data.paddle.vy);
	}

	updateFromServer(data) {
		if (this.paddle.geometry.parameters.width !== data.paddle.width || this.paddle.geometry.parameters.height !== data.paddle.height) {
			this.paddle.geometry.dispose();
			this.paddle.geometry = new window.THREE.BoxGeometry(data.paddle.width, 1, data.paddle.height);
		}
		this.paddle.position.set(data.paddle.x, 0, data.paddle.y);
		this.paddle.velocity.set(0, 0, data.paddle.vy);
	}

	update() {
		this.paddle.position.add(this.paddle.velocity);
	}
}