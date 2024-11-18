import { Box } from "../../utils/models/Box.js";
import { Object3D } from "../../utils/Object3D.js";

export class Ball extends Object3D {
    constructor(radius = 1, material = new window.THREE.MeshStandardMaterial({ color: 0xff0000 }), position = new window.THREE.Vector3(0, 1, 0)) {
        const geometry = new window.THREE.SphereGeometry(radius);
        super(geometry, material, position);
		// this.velocity = new Vector3(0, 0, 0); // Initialement la balle est immobile
        this.maxSpeed = 10; // Vitesse maximale
        this.accelerationFactor = 1.1; // Facteur d'accélération après chaque rebond
    }

    update() {
        // Déplacer la balle
        this.mesh.position.add(this.mesh.velocity);
        
        // Limiter la vitesse maximale
        this.mesh.velocity = this.mesh.velocity.clampLength(0, this.maxSpeed);
    }

    onCollision(object) {
        // Use default behavior
        super.onCollision(object);

        if (object instanceof Box) {
            const collisionNormal = this.getCollisionNormal(object);

            if (collisionNormal.x !== 0) {
                console.log('collision on x');
                this.mesh.velocity.x = -this.mesh.velocity.x; // Inverser la direction sur l'axe X
                this.mesh.velocity.multiplyScalar(this.accelerationFactor); // Accélérer après rebond
            //     this.velocity.x = -this.velocity.x; // Inverser la direction sur l'axe X
            //     this.velocity.multiplyScalar(this.accelerationFactor); // Accélérer après rebond
            }
            if (collisionNormal.y !== 0) {
                console.log('collision on y');
                this.mesh.velocity.y = -this.mesh.velocity.y; // Inverser la direction sur l'axe Y
                this.mesh.velocity.multiplyScalar(this.accelerationFactor); // Accélérer après rebond
                // this.velocity.y = -this.velocity.y; // Inverser la direction sur l'axe Y
            }
            if (collisionNormal.z !== 0) {
                console.log('collision on z');
                this.mesh.velocity.z = -this.mesh.velocity.z; // Inverser la direction sur l'axe Z
                this.mesh.velocity.multiplyScalar(this.accelerationFactor); // Accélérer après rebond
                // this.velocity.z = -this.velocity.z; // Inverser la direction sur l'axe Z
                // this.velocity.multiplyScalar(this.accelerationFactor); // Accélérer après rebond
            }
        }
    }

    getCollisionNormal(object) {
        const objectBox = new window.THREE.Box3().setFromObject(object.mesh);
    
        // Vérifier les faces de l'objet
        const normal = new window.THREE.Vector3(0, 0, 0);
    
        // Vérification des collisions sur l'axe X (gauche/droite)
        // if (this.position.x - this.mesh.geometry.parameters.radius <= objectBox.min.x) {
        if (this.mesh.position.x - this.mesh.geometry.parameters.radius <= objectBox.min.x) {
            normal.x = -1; // La balle a touché la face gauche
        // } else if (this.position.x + this.mesh.geometry.parameters.radius >= objectBox.max.x) {
        } else if (this.mesh.position.x + this.mesh.geometry.parameters.radius >= objectBox.max.x) {
            normal.x = 1; // La balle a touché la face droite
        }
    
        // Vérification des collisions sur l'axe Z (avant/arrière)
        // if (this.position.z - this.mesh.geometry.parameters.radius <= objectBox.min.z) {
        if (this.mesh.position.z - this.mesh.geometry.parameters.radius <= objectBox.min.z) {
            normal.z = -1; // La balle a touché la face arrière
        // } else if (this.position.z + this.mesh.geometry.parameters.radius >= objectBox.max.z) {
        } else if (this.mesh.position.z + this.mesh.geometry.parameters.radius >= objectBox.max.z) {
            normal.z = 1; // La balle a touché la face avant
        }
    
        // Ne pas tenir compte des rebonds verticaux (axe Y), donc on laisse normal.y à 0
        return normal;
    }
}
