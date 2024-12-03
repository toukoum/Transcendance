export class Ball {
	constructor(data) {
		this.mesh = new window.THREE.Mesh(
			new window.THREE.SphereGeometry(data.radius, 32, 32),
			new window.THREE.MeshStandardMaterial({
				color: 0xFF3B30,
				emissive: 0xFF3B30,
				emissiveIntensity: 5,
			})
		);
		this.mesh.position.set(data.x, data.radius, data.y);
		this.mesh.velocity = new window.THREE.Vector3(data.vx, 0, data.vy);
		
		this.lastSyncTime = Date.now();

		this.trail = null;
        this.trailLength = 400;
	}

	updateFromServer(data) {
		if (data.radius !== this.mesh.geometry.parameters.radius) {
			this.mesh.geometry = new window.THREE.SphereGeometry(data.radius, 32, 32);
		}
		this.mesh.position.set(data.x, data.radius, data.y);
		this.mesh.velocity = new window.THREE.Vector3(data.vx, 0, data.vy);
	}

	addTo(scene) {
		scene.add(this.mesh);
		this.initTrail(scene);
	}

	initTrail(scene) {
        const colors = [];
        const color = new THREE.Color();

        for (let i = 0; i < this.trailLength; i++) {
			color.setHSL(3, 1, Math.pow(1 - i / (this.trailLength - 1), 4));
			colors.push(color.r, color.g, color.b);
        }

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(new Array(this.trailLength * 3).fill(0), 3)
        );
        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3)
        );

        const line = new THREE.Line(geometry, material);
        line.pos = geometry.getAttribute("position");

        this.trail = { line, geometry, positions: line.pos.array };
        scene.add(line);
    }

    updateTrail() {
        if (!this.trail) return;

        const ballPosition = this.mesh.position;
        const positions = this.trail.positions;

        // Décaler les positions existantes
        for (let i = positions.length - 3; i > 0; i -= 3) {
            positions[i] = positions[i - 3];
            positions[i + 1] = positions[i - 2];
            positions[i + 2] = positions[i - 1];
        }

        // Ajouter la position actuelle de la balle
        positions[0] = ballPosition.x;
        positions[1] = ballPosition.y;
        positions[2] = ballPosition.z;

        this.trail.geometry.attributes.position.needsUpdate = true;
    }

	update(deltaTime) {
		if (!deltaTime) return;
		this.updateTrail(deltaTime);
	}
}