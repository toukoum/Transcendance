import Game from "../index.js";
import { api } from "../../../../utils/api/Api.js";

export class Client {
	constructor(game, gameId) {
		if (!game || !(game instanceof Game)) {
			throw new Error("[Game Client] Game instance is required");
		}
		if (!gameId) {
			throw new Error("[Game Client] Game ID is required");
		}
		this.game = game;
		this.ws = api.game.connect(gameId);

		this.initListeners();
	}

	initListeners() {
		this.ws.on("open", () => {
			console.log("[Game Client] WebSocket connected");
		});
		this.ws.on("close", () => {
			console.log("[Game Client] WebSocket closed");
		});
		this.ws.on("error", (error) => {
			console.error("[Game Client] WebSocket error", error);
		});
		this.ws.on("message", (data) => {
			this.handleMessage(data);
		});
	}

	handleMessage(message) {
		// console.log("[Game Client] Handling message", message);
		switch (message.type) {
			case "state":
				console.log(`[Game Client] Game is in state ${message.state}`);
				this.game.stateManager.handleEvent(message.state, message.data);
				break;
			case "pong":
				// console.log("[Game Client] Received pong message");
				this.game.pingManager.handlePong(message.timestamp);
				break;
			default:
				console.log("[Game Client] Unknown message type", message.type);
				break;
		}
	}
}