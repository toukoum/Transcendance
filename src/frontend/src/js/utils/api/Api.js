import { Auth } from "./Auth.js";
import { Me } from "./Me.js";
import { ApiRequest } from "./ApiRequest.js";

export class Api {
	constructor() {
		this.baseUrl = "http://localhost:8000/v1";
		this.auth = new Auth(this);
		this.request = new ApiRequest(this);
		this.me = new Me(this);
	}
}

export const api = new Api();