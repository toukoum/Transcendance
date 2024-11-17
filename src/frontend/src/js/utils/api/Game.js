import { Api } from "./Api.js";

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
		numbersPlayer,
		maxScore
	}) {
		return await this.api.request.post("game/", config);
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

	
}