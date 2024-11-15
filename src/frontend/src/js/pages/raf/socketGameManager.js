class SocketGameManager {
	constructor() {
		this.socketGame = null;
		this.gameId = null;
	}

	connect(gameId) {
		this.gameId = gameId;

		// Fermer l'ancienne connexion si elle existe
		if (this.socketGame && this.socketGame.readyState === WebSocket.OPEN) {
			this.socketGame.close();
		}


		this.socketGame = new WebSocket(`ws://localhost:8000/ws/games/${gameId}/`);
		this.socketGame.onopen = () => {
			console.log("NINO=> WebSocket connection opened for game:", gameId);
			window.router.push('/raf/play');
		};

		this.socketGame.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		this.socketGame.onmessage = (event) => {
			const messageData = JSON.parse(event.data);
			console.log("=== Message SERVER ====");
			if (messageData.type === 'START') {
				console.log("Game is starting! Redirecting to play page...");
			} else {
				console.log("Message from game server:", messageData);
			}
		};


		return this.socketGame;
	}

	getSocket() {
		return this.socketGame;
	}

	getGameId() {
		return this.gameId;
	}


}

// Exporter une instance unique
export const socketGameManager = new SocketGameManager();
