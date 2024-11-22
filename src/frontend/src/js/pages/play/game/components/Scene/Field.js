export class Field {
	constructor(width = 1200, height = 900) {
		this.width = width;
		this.height = height;

		this.mesh = new THREE.Mesh(
			new window.THREE.PlaneGeometry(width, height),
			new window.THREE.MeshBasicMaterial( {color: 0x0077ff, side: THREE.DoubleSide })
		);
		// Make the field horizontal
		this.mesh.rotation.x = -Math.PI / 2;
	}

	updateFromServer(data) {
		if (this.width !== data.width || this.height !== data.height) {
			this.width = data.width;
			this.height = data.height;

			this.mesh.geometry = new window.THREE.PlaneGeometry(width, height);
		}
	}
}