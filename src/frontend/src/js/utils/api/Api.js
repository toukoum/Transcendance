// import { ApiRequest } from "./ApiRequest";
import { Auth } from "./Auth.js";

export class Api {
	constructor() {
		this.baseUrl = "http://localhost:8000/v1";
		this.auth = new Auth(this);
		// this.request = new ApiRequest(this);
	}
}

export const api = new Api();