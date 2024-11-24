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
		this.mesh.position.set(data.x, data.radius, data.y);
		this.mesh.velocity = new window.THREE.Vector3(data.vx, 0, data.vy);
		
		this.lastSyncTime = Date.now();
	}

	updateFromServer(data) {
		if (data.radius !== this.mesh.geometry.parameters.radius) {
			this.mesh.geometry = new window.THREE.SphereGeometry(data.radius, 32, 32);
		}
		this.mesh.position.set(data.x, data.radius, data.y);
		this.mesh.velocity = new window.THREE.Vector3(data.vx, 0, data.vy);

		// if (data.radius !== this.mesh.geometry.parameters.radius) {
		// 	this.mesh.geometry.dispose();
		// 	this.mesh.geometry = new window.THREE.SphereGeometry(data.radius, 32, 32);
		// }

		// const serverPosition = new window.THREE.Vector3(data.x, data.radius, data.y);
		// const localPosition = this.mesh.position.clone();

		// const ping = window.game.pingManager.ping;
		// console.info("[Ball] Ping", ping);
		// const allowedError = (ping / 1000) * this.mesh.velocity.length();
		// const distanceError = localPosition.distanceTo(serverPosition);

		// if (distanceError > allowedError) {
		// 	this.mesh.position.lerp(serverPosition, 0.5);
		// }

		// this.mesh.velocity.set(data.vx, 0, data.vy);
		// this.lastSyncTime = Date.now();
	}

	// update() {
	// }
	update(deltaTime) {
		// if (!deltaTime) return;
		// const deltaPosition = this.mesh.velocity.clone().multiplyScalar(deltaTime);
		// this.mesh.position.add(deltaPosition);
	}
}