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

	/**
	 * @brief Update the authenticated user
	 * @param {Object} data - The data to update
	 * @returns {Promise}
	 */
	async update({
		username,
		firstName,
		lastName,
		bio
	}) {
		return await this.api.request.patch("me/", {
			username,
			first_name: firstName,
			last_name: lastName,
			profile: {
				bio
			}
		});
	}
}