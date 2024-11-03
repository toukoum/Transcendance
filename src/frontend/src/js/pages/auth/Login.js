import { images } from "../../../config/images.js";
import { api } from "../../utils/api/Api.js";
import { Component } from "../../utils/Component.js";

export class Login extends Component {
	constructor() {
		super("main-layout");
		// this.classList.add("bg-secondary");
	}
	content() {
		return (/*html*/`
		<div
		class="h-100 d-flex p-2 justify-content-center align-items-center"
		style="background-image: url(${images.auth.login.background[0].src});background-size: cover; background-position: center;"
		>
			<div class="w-25 bg-primary rounded-2 p-3">
				<div>
					<h3 class="text-center">Login</h3>
					<!-- Descriptions -->
					<p class="text-center">Please enter your credentials to login</p>
				</div>
				<div>
					<form id="login-form">
						<div class="form-group">
							<label for="identifier">Email or Username</label>
							<input type="text" class="form-control" id="identifier" name="identifier">
							<!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							<input type="password" class="form-control" id="password" name="password">
						</div>
						<div class="d-grid gap-2">
							<button type="submit" class="btn btn-primary">Login</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		`)

	}

	script() {
		const form = this.querySelector("#login-form");
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			console.log("Form submitted", form);
			const formData = new FormData(form);
			console.log(formData);
			const identifier = formData.get("identifier");
			const password = formData.get("password");
			console.log(identifier, password);
			
			// await api.auth.loginWithIdentifier(identifier, password);
		});
	}
}

customElements.define("auth-login-page", Login);