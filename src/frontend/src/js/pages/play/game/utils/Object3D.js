export class Object3D {
	constructor(geometry, material, position = new window.THREE.Vector3(), rotation = new window.THREE.Vector3(), scale = new window.THREE.Vector3(1, 1, 1)) {
		this.mesh = new window.THREE.Mesh(geometry, material);
		
		// this.mesh.position.copy(position);
		this.mesh.position.set(position.x, position.y, position.z);
		// this.mesh.rotation.copy(rotation);
		this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
		// this.mesh.scale.copy(scale);
		this.mesh.scale.set(scale.x, scale.y, scale.z);
	}

	checkCollision(object) {
		const meshBox = new window.THREE.Box3().setFromObject(this.mesh);
		const objectBox = new window.THREE.Box3().setFromObject(object.mesh);

		return meshBox.intersectsBox(objectBox);
	}
	onCollision(object) {
		// console.log(`[Object3D] Collision between ${this.constructor.name} and ${object.constructor.name}`);
	}

	destroy() {
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
	}

}