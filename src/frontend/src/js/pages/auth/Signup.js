import { images } from "../../../config/images.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";
import { Component } from "../../utils/Component.js";

export class Signup extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		return (/*html*/`
		<div
		class="h-100 d-flex p-2 justify-content-center align-items-center"
		style="background-image: url(${images.auth.login.background[0].src});background-size: cover; background-position: center;"
		>
			<div class="w-25 bg-primary rounded-2 p-3 d-flex flex-column gap-3">
				<div>
					<h3 class="text-center">Signup</h3>
					<!-- Descriptions -->
					<p class="text-center">Please enter your credentials to signup</p>
				</div>
				<div>
					<form id="signup-form" class="d-flex flex-column gap-1">
						<div class="form-group">
							<label for="username">Username</label>
							<input type="text" class="form-control" id="username" name="username">
						</div>
						<div class="form-group">
							<label for="email">Email</label>
							<input type="text" class="form-control" id="email" name="email" aria-describedby="emailHelp">
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							<input type="password" class="form-control" id="password" name="password">
						</div>
						<div class="form-group">
							<label for="password-confirm">Confirm Password</label>
							<input type="password" class="form-control" id="password-confirm" name="password-confirm">
						</div>
						<div class="d-grid gap-2">
							<button type="submit" class="btn btn-primary">Signup</button>
						</div>
					</form>
				</div>
				<!-- Login -->
				<div class="d-flex justify-content-center">
					Already have an account? <a href="/auth/login" class="text-decoration-none">Login</a>
				</div>
			</div>
		</div>
		`);
	}

	script() {
		const form = this.querySelector("#signup-form");
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				const formData = new FormData(form);
				const {
					username,
					email,
					password,
					"password-confirm": passwordConfirm,
				} = Object.fromEntries(formData.entries());

				console.log(username, email, password, passwordConfirm);
				
				const { data, error } = await api.auth.register({
					username,
					email,
					password,
					passwordConfirm,
				})
				if (error) throw error;
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
				} else {
					console.error("An error occurred");
				}
			}
		});
	}
}

customElements.define("auth-signup-page", Signup);