import { Api } from "./Api.js";

export class Me {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	/**
	 * @brief Get the authenticated user
	 * @returns {Promise}
	 */
	async get() {
		return await this.api.request.get("me/");
	}

	
}