export class Field {
	constructor(width = 1200, height = 900) {
		this.width = width;
		this.height = height;

		const texture = new THREE.TextureLoader().load("/public/assets/game/field.png");

		const fieldMaterial = new THREE.MeshStandardMaterial({
			color: 0x00FFFFFF,
			side: THREE.DoubleSide,
			roughness: 0.5,
			metalness: 0.4,
			transparent: true,
			opacity: 0.80,
		});
		const fieldMaterialTexture = new THREE.MeshStandardMaterial({
			map: texture,
			side: THREE.DoubleSide,
			roughness: 0.5,
			metalness: 0.4,
			transparent: true,
			opacity: 0.75,
		});

		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(width, 1, height),
			[
				fieldMaterial, // Front
				fieldMaterial, // Back
				fieldMaterialTexture, // Top
				fieldMaterialTexture, // Bottom
				fieldMaterial, // Left
				fieldMaterial // Right
			]
		);
		this.mesh.position.set(0, -(this.mesh.geometry.parameters.height / 2), 0);
	}

	updateFromServer(data) {
		if (this.width !== data.width || this.height !== data.height) {
			this.width = data.width;
			this.height = data.height;

			this.mesh.geometry = new THREE.BoxGeometry(data.width, 1, data.height);
		}
	}
}