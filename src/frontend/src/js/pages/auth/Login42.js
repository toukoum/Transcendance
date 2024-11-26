import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";
import { Component } from "../../utils/Component.js";

export class Login42 extends Component {
	content() {
		return (/*html*/`
			<main-layout>
				<div class="wrapper d-flex flex-column gap-3 justify-content-center align-items-center" style="height: 300px;">
					<button class="btn btn-primary login-42">
						Validate connection with 
						<img src="../../../../public/logo42.png" alt="42 logo" style="width: 20px;">
					</button>
				</div>
			</main-layout>
		`);
	}

	script() {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get("state");
		const code = urlParams.get("code");

		const login42 = this.querySelector(".login-42");
		login42.addEventListener("click", async () => {
			try{
				const { data, error } = await api.request.get(`auth/42/callback/?state=${state}&code=${code}`);
				if (error) throw error;
				window.auth = data;
				window.router.redirect("/");
			}catch(error){
				console.error(error);
				Toast.error("An error occurred");
			}
	});


	}
}

customElements.define("auth-login-42-page", Login42);