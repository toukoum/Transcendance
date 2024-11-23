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
		// this.ws = api.game.connect(gameId);
		this.ws = null;

		// this.initListeners();
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
			// console.log("[Game Client] Received message", data);
			this.handleMessage(data);
		});
	}

	handleMessage(message) {
		const type = message.type ? message.type.split(".")[0].trim() : null;
		switch (type) {
			case "game":
				window.game.stateManager.handleEvent(message);
				// this.game.stateManager.handleEvent(message);
				break;
			case "pong":
				this.game.pingManager.handlePong(message.timestamp);
				break;
			default:
				console.log("[Game Client] Unknown message type", message.type);
				break;
		}
	}

	connect() {
		this.ws = api.game.connect(this.game.settings.gameId);
		this.initListeners();
	}

	// sendMovement(keys) {
	// 	console.log("[Game Client] Sending movement", keys);
	// 	this.ws.send({
	// 		type: "player.move",
	// 		keys: keys,
	// 	});
	// }
}