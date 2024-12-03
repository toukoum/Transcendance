import { ApiRequest } from "./ApiRequest.js";
import { Auth } from "./Auth.js";
import { Game } from "./Game.js";
import { Me } from "./Me.js";
import { Tournament } from "./Tournament.js";

export class Api {
	constructor() {
		this.baseUrl = "https://10.32.8.13:3000/api/v1";
		this.auth = new Auth(this);
		this.request = new ApiRequest(this);
		this.me = new Me(this);
		this.game = new Game(this);
		this.tournament = new Tournament(this);
	}
}

export const api = new Api();