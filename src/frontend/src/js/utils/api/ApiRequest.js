import { Request } from "../Request";
import { Api } from "./Api";

export class ApiRequest {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	async get(endpoint, options = {}) {
		return await Request.get(`${this.api.baseUrl}/${endpoint}`, options);
	}

	async post(endpoint, options = {}) {
		return await Request.post(`${this.api.baseUrl}/${endpoint}`, options);
	}

	async put(endpoint, options = {}) {
		return await Request.put(`${this.api.baseUrl}/${endpoint}`, options);
	}

	async delete(endpoint, options = {}) {
		return await Request.delete(`${this.api.baseUrl}/${endpoint}`, options);
	}
}