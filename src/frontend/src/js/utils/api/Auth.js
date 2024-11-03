import { Api } from "./Api.js";

export class Auth {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	/**
	 * @brief Get authenticated user
	 * @returns {Promise}
	 */
	async getUser() {
		return await this.api.request.get("auth/user");
	}

	/**
	 * @brief Login the user
	 * @param {String} identifier - The username or email
	 * @param {String} password - The password
	 */
	async loginWithIdentifier(identifier, password) {
		return await this.api.request.post("login", {
			identifier,
			password
		});
	}

	/**
	 * @brief Login with OAuth
	 * @param {String} provider - The provider
	 */
	async loginWithOAuth(provider) {
		return await this.api.request.get(`login/${provider}`);
	}

	/**
	 * @brief Logout the user
	 */
	async logout() {
		return await this.api.request.post("logout");
	}

	/**
	 * @brief Register a new user
	 * @param {String} username - The username
	 * @param {String} email - The email
	 * @param {String} password - The password
	 */
	async register(username, email, password) {
		return await this.api.request.post("register", {
			username,
			email,
			password
		});
	}
}