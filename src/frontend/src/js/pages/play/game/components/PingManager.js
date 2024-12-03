import { Client } from "../components/Client.js";

export class PingManager {
	constructor(client) {
		if (!client || !(client instanceof Client)) {
			throw new Error("[PingManager] WebSocket instance is required");
		}
		this.client = client;
		this.ping = 0;               // Dernier ping mesuré
		this.pingTimes = [];         // Historique des pings
		this.averagePing = 0;        // Moyenne des pings
		this.subscribers = [];       // Liste des callbacks abonnés
		this.pingInterval = null;    // Intervalle pour l'envoi de pings
		this.pingDelay = 1000;       // Fréquence des pings en ms
		this.pingMax = 5;            // Nombre de pings pour calculer une moyenne
		this.isStarted = false;
	}

	// Démarre l'envoi des pings
	start() {
		if (this.isStarted) {
			return;
		}
		this.isStarted = true;
		this.pingInterval = setInterval(() => {
			const timestamp = Date.now();
			this.client.ws.send({ type: 'ping', timestamp });
		}, this.pingDelay);
	}

	// Arrête l'envoi des pings
	stop() {
		if (!this.isStarted) {
			return;
		}
		clearInterval(this.pingInterval);
		this.isStarted = false;
	}

	// Mets à jour le ping avec la réponse du serveur
	handlePong(timestamp) {
		// console.log("[PingManager] Received pong", timestamp);
		const responseTime = Date.now() - timestamp;
		this.pingTimes.push(responseTime);

		// Calcul de la moyenne après un certain nombre de pings
		if (this.pingTimes.length > this.pingMax) {
			this.pingTimes.shift(); // Retire le plus ancien ping
		}
		this.averagePing = this.pingTimes.reduce((a, b) => a + b, 0) / this.pingTimes.length;

		// Met à jour la valeur du ping actuel
		this.ping = responseTime;

		// Notifie tous les abonnés des changements
		this.notifySubscribers();
	}

	// Permet à d'autres parties d'être notifiées des changements de ping
	subscribe(callback) {
		if (typeof callback === "function") {
			this.subscribers.push(callback);
		}
	}

	// Retire un abonné
	unsubscribe(callback) {
		this.subscribers = this.subscribers.filter((cb) => cb !== callback);
	}

	// Notifie tous les abonnés du ping actuel
	notifySubscribers() {
		for (const callback of this.subscribers) {
			callback({ ping: this.ping, averagePing: this.averagePing });
		}
	}
}
