export class Ball {
	constructor(data) {
		// data : {
		// x,
		// y,
		// radius,
		// vx,
		// vy
		// }
		this.mesh = new window.THREE.Mesh(
			new window.THREE.SphereGeometry(data.radius, 32, 32),
			new window.THREE.MeshStandardMaterial({ color: 0x007700 })
		);
		this.mesh.position.set(data.x, 0, data.y);
		this.mesh.velocity = new window.THREE.Vector3(data.vx, 0, data.vy); 
	}

	updateFromServer(data) {
		if (data.radius !== this.mesh.geometry.parameters.radius) {
			this.mesh.geometry = new window.THREE.SphereGeometry(data.radius, 32, 32);
		}
		this.mesh.position.set(data.x, 0, data.y)
		this.mesh.velocity = new window.THREE.Vector3(data.vx, 0, data.vy);
	}

	update() {
		this.mesh.position.x += this.mesh.velocity.x;
		this.mesh.position.y += this.mesh.velocity.y;
		this.mesh.position.z += this.mesh.velocity.z;
	}
}