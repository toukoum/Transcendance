export class Cookies {
	/**
	 * @brief Set a cookie
	 * @param name Name of the cookie (required)
	 * @param value Value of the cookie (required)
	 * @param days Days until the cookie expires (optional)
	 */
	static set(name, value, days) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		if (typeof value !== "string") {
			throw new TypeError("Value must be a string");
		}
		if (days && typeof days !== "number") {
			throw new TypeError("Days must be a number");
		}

		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = `; expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value}${expires}; path=/`;
	}

	/**
	 * @brief Get a cookie
	 * @param name Name of the cookie (required)
	 */
	static get(name) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}

		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			const [cookieName, cookieValue] = cookie.split("=");
			if (cookieName === name) {
				return cookieValue;
			}
		}

		return null;
	}

	/**
	 * @brief Delete a cookie
	 * @param name Name of the cookie (required)
	 */
	static delete(name) {
		if (typeof name !== "string") {
			throw new TypeError("Name must be a string");
		}
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	/**
	 * @brief Clear all cookies
	 */
	static clear() {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			const [cookieName] = cookie.split("=");
			Cookies.delete(cookieName);
		}
	}
}