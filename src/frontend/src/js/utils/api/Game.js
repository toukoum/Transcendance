import { Api } from "./Api.js";
import { ApiWebSocket } from "./ApiWebSocket.js";

export class Game {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	/**
	 * @brief Create a new game
	 * @param {Object} config - The game configuration
	 * @returns {Promise}
	 */
	async create(config = {
		duration,
		max_players,
		max_score,
	}) {
		return await this.api.request.post("game/", config);
	}

	/**
	 * @brief Join a game
	 * @param {String} gameId - The game id
	 * @returns {Promise}
	 */
	async join(gameId) {
		return await this.api.request.post(`game/${gameId}/join/`);
	}

	/**
	 * @brief Check if user is in a game
	 * @returns {Promise}
	 */
	async onGame() {
		if (window.isInGame !== undefined) {
			return await {
				data: window.isInGame,
				error: null
			}
		}
		return await this.api.request.get("game/check/");
	}

	/**
	 * @brief Connect to a game
	 * @param {String} gameId - The game id
	 */
	connect(gameId) {
		return new ApiWebSocket(`game/${gameId}/`);
		// return this.api.websocket.connect(`game/${gameId}/`);
	}
}