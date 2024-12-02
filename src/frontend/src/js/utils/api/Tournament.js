import { Api } from "./Api.js";
import { ApiWebSocket } from "./ApiWebSocket.js";

export class Tournament {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	/**
	 * @brief Create a new tournament
	 * @param {Object} config - The tournament configuration
	 * @returns {Promise}
	 */
	async create(config = {
		duration,
		maxScore,
		name,
		pseudoCreator,
		address_tournament
	}) {
		return await this.api.request.post("tournaments/", config);
	}

	/**
	 * @brief Join a tournament
	 * @param {String} tournamentId - The tournament id
	 * @returns {Promise}
	 */
	async join(tournamentId) {
		return await this.api.request.post(`tournament/${tournamentId}/join/`);
	}

	/**
	 * @brief Check if user is in a tournament
	 * @returns {Promise}
	 */
	async ontournament() {
		if (window.isIntournament !== undefined) {
			return await {
				data: window.isIntournament,
				error: null
			}
		}
		return await this.api.request.get("tournament/check/");
	}

	/**
	 * @brief Connect to a tournament
	 * @param {String} tournamentId - The tournament id
	 */
	connect(tournamentId) {
		return new ApiWebSocket(`tournament/${tournamentId}/`);
		// return this.api.websocket.connect(`tournament/${tournamentId}/`);
	}

	
}