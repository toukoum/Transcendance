export class Request {
	static async get(endpoint, options = {}) {
		if (typeof endpoint !== "string") {
			throw new TypeError("Endpoint must be a string");
		}
		if (typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}
		return await Request.request(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			...options,
		});
	}
	
	static async put(endpoint, data = {}, options = {}) {
		if (typeof data !== "object") {
			throw new TypeError("Data must be an object");
		}
		if (typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}
		return await Request.request(endpoint, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
			...options,
		});
	}

	
	static async post(endpoint, data = {}, options = {}) {
		if (typeof data !== "object") {
			throw new TypeError("Data must be an object");
		}
		if (typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}
		return await Request.request(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
			...options,
		});
	}


	static async delete(endpoint, options = {}) {
		if (typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}
		return await Request.request(endpoint, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			...options,
		});
	}

	static async patch(endpoint, data = {}, options = {}) {
		if (typeof data !== "object") {
			throw new TypeError("Data must be an object");
		}
		if (typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}
		return await Request.request(endpoint, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
			...options,
		});
	}

	static async request(endpoint, options) {
		if (typeof endpoint !== "string") {
			throw new TypeError("Endpoint must be a string");
		}
		if (options && typeof options !== "object") {
			throw new TypeError("Options must be an object");
		}

		const response = await fetch(endpoint, options);
		const data = await response.json();

		return {
			response,
			data,
		}
	}
}
