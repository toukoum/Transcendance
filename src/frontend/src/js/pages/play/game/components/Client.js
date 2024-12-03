import Game from "../Game.js";
import { api } from "../../../../utils/api/Api.js";
import { Toast } from "../../../../provider/toast-provider.js";

export class Client {
	constructor(game, gameId) {
		if (!game || !(game instanceof Game)) {
			throw new Error("[Game Client] Game instance is required");
		}
		if (!gameId) {
			throw new Error("[Game Client] Game ID is required");
		}
		this.game = game;
		this.ws = null;
		this.isConnected = false;
	}

	initListeners() {
		this.ws.on("open", () => {
			// console.log("[Game Client] WebSocket connected");
		});
		this.ws.on("close", () => {
			// console.log("[Game Client] WebSocket closed");
			if (this.game.pingManager) {
				this.game.pingManager.stop();
			}
		});
		this.ws.on("error", (error) => {
			// console.error("[Game Client] WebSocket error", error);
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
				this.handleEvent(message);
				break;
			case "pong":
				this.game.pingManager.handlePong(message.timestamp);
				break;
			default:
				// console.log("[Game Client] Unknown message type", message.type);
				break;
		}
	}

	connect() {
		this.ws = api.game.connect(this.game.settings.gameId);
		this.isConnected = true;
		this.initListeners();
		if (this.ws && this.game.pingManager) {
			this.game.pingManager.start();
		}
	}

	disconnect() {
		this.ws.close();
		this.isConnected = false
	}

	handleEvent(message) {
		const type = message.type.split(".")[1].trim();
		if (message.dataMatch) {
			this.game.serverData.update(message.dataMatch);
		}
		switch (type) {
			case "state":
				if (!message.state) {
					console.error("[Game: Client] State is required");
				}
				this.game.ui.activateScreen(message.state, message.data);
				break;
			/* --------------------------------- Players -------------------------------- */
			case "player":
				if (!message.action) {
					console.error("[Game: Client] Player action is required");
				}
				Toast.info(message.message);
				break;
			default:
				// console.log("[Game: Client] Unknown message type", type);
				break;
		}
	}

	leave() {
		this.ws.send({
			type: "game.leave"
		});
		this.disconnect();
		window.router.push("/play");
	}
}