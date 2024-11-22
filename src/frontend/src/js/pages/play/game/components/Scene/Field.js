export class Field {
	constructor(width = 1200, height = 900) {
		this.width = width;
		this.height = height;

		this.mesh = new THREE.Mesh(
			new window.THREE.BoxGeometry(width, 1, height),
			new window.THREE.MeshBasicMaterial( {color: 0x0077ff, side: THREE.DoubleSide })
		);
		this.mesh.position.set(0, -(this.mesh.geometry.parameters.height / 2), 0);
	}

	updateFromServer(data) {
		if (this.width !== data.width || this.height !== data.height) {
			this.width = data.width;
			this.height = data.height;

			this.mesh.geometry = new window.THREE.PlaneGeometry(width, height);
		}
	}
}