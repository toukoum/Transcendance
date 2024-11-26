import { Request } from "../Request.js";
import { Api } from "./Api.js";
import { ApiRequestData } from "./parser/ApiRequestData.js";
import { ApiRequestError } from "./parser/ApiRequestError.js";

export class ApiRequest {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	async get(endpoint, options = {}) {
		// return await Request.get(`${this.api.baseUrl}/${endpoint}`, options);
		return await this.request("GET", endpoint, options);
	}

	async post(endpoint, options = {}) {
		// return await Request.post(`${this.api.baseUrl}/${endpoint}`, options);
		return await this.request("POST", endpoint, options);
	}

	async put(endpoint, options = {}) {
		// return await Request.put(`${this.api.baseUrl}/${endpoint}`, options);
		return await this.request("PUT", endpoint, options);
	}

	async delete(endpoint, options = {}) {
		// return await Request.delete(`${this.api.baseUrl}/${endpoint}`, options);
		return await this.request("DELETE", endpoint, options);
	}

	async patch(endpoint, options = {}) {
		// return await Request.patch(`${this.api.baseUrl}/${endpoint}`, options);
		return await this.request("PATCH", endpoint, options);
	}

	async request(method, endpoint, options = {}) {
		const fn = Request[method.toLowerCase()];
		if (!fn) {
			throw new Error(`Invalid method: ${method}`);
		}
		const { response, data } = await fn(`${this.api.baseUrl}/${endpoint}`, options);
		if (data.data === undefined && data.error === undefined) {
			return {
				data: data
			}
		}

		return {
			data: data.data,
			error: data.error
			//data: data.data ? new ApiRequestData(response, data.data) : null,
			//error: data.error ? new ApiRequestError(response, data.error) : null
		}
		// return {
		// 	data: response.ok ? new ApiRequestData(response, data) : null,
		// 	error: !response.ok ? new ApiRequestError(response, data) : null
		// }
	}
	
}