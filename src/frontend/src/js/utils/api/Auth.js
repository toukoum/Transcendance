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
		// use cache if available
		if (window.auth !== undefined) {
			return await {
				data: window.auth,
				error: null
			}
		}
		return await this.api.request.get("me/");
	}

	/**
	 * @brief Login the user
	 * @param {String} identifier - The username or email
	 * @param {String} password - The password
	 */
	async loginWithIdentifier(identifier, password) {
		// if its a email
		let response = null;
		if (identifier.includes("@")) {
			response = await this.api.request.post("auth/login/", {
				email: identifier,
				password
			});
		} else {
			response = await this.api.request.post("auth/login/", {
				username: identifier,
				password
			});
		}


		if (response.data.user) {
			window.auth = response.data.user;
		}
		return response;
	}

	/**
	 * @brief Logout the user
	 */
	async logout() {
		return await this.api.request.post("auth/logout/");
	}

	/**
	 * @brief Register a new user
	 * @param {String} username - The username
	 * @param {String} email - The email
	 * @param {String} password - The password
	 */
	async register({
		username,
		email,
		password,
		passwordConfirm
	}) {
		return await this.api.request.post("auth/register/", {
			username,
			email,
			password1: password,
			password2: passwordConfirm
		});
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
		bio,
		location
	}) {
		return await this.api.request.patch("me/", {
			username,
			first_name: firstName,
			last_name: lastName,
			profile: {
				bio: bio,
				location: location
			}
		});
	}

	/**
	 * @brief Change the password of the authenticated user
	 * @param {String} currentPassword - The current password
	 * @param {String} newPassword - The new password
	 * @param {String} newPasswordConfirm - The new password confirmation
	 */
	async changePassword({
		currentPassword,
		newPassword,
		newPasswordConfirm
	}) {
		return await this.api.request.post("auth/password/change/", {
			current_password: currentPassword,
			new_password1: newPassword,
			new_password2: newPasswordConfirm
		});
	}
}