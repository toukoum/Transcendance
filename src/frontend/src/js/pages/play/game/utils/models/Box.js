import { Object3D } from "../Object3D.js";

export class Box extends Object3D {
	constructor(
		size = new window.THREE.Vector3(1, 1, 1),
		material = new window.THREE.MeshStandardMaterial({ color: 0x007700 }),
		position = new window.THREE.Vector3(0, 0, 0),
		rotation = new window.THREE.Vector3(0, 0, 0),
		scale = new window.THREE.Vector3(1, 1, 1)
	) {
		const geometry = new window.THREE.BoxGeometry(size.x, size.y, size.z);
		super(geometry, material, position, rotation, scale);
	}
}