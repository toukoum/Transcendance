import { Object3D } from "../Object3D.js";

export class Plane extends Object3D {
	constructor(
		width = 50,
		height = 50,
		color = 0x007700, // Couleur par défaut : vert
		position = new window.THREE.Vector3(0, 0, 0),
		rotation = new window.THREE.Vector3(-Math.PI / 2, 0, 0), // Rotation par défaut pour être horizontal
		scale = new window.THREE.Vector3(1, 1, 1)
	) {
		// Créer la géométrie et le matériau du plane
		const geometry = new window.THREE.PlaneGeometry(width, height);
		const material = new window.THREE.MeshStandardMaterial({
			color,
			side: window.THREE.DoubleSide, // Afficher les deux côtés
		});

		// Appeler le constructeur parent
		super(geometry, material, position, rotation, scale);
	}
}