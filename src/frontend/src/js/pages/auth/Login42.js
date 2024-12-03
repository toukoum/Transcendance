import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";
import { Component } from "../../utils/Component.js";

export class Login42 extends Component {
	content() {
		this.classList.add("h-100");
		return (/*html*/`
			<main-layout>
			</main-layout>
		`);
	}
	
	async redirect42(state, code){
		try{
			const { data, error } = await api.request.get(`auth/42/callback/?state=${state}&code=${code}`);
			if (error) throw error;
			window.auth = data;
			window.router.redirect("/");
		}catch(error){
			console.error(error);
			Toast.error("Unable to log you with 42.");
		}
	}

	script() {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get("state");
		const code = urlParams.get("code");

		if (state && code){
			this.redirect42(state, code)
		} else {
			Toast.error("Unable to log you with 42.");
		}

	}
}

customElements.define("auth-login-42-page", Login42);