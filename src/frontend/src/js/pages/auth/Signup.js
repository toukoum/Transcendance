import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";
import { Component } from "../../utils/Component.js";

export class Signup extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		this.classList.add("h-100");
		return (/*html*/`
		<div
		class="h-100 d-flex p-2 justify-content-center align-items-center"
		>
			<div class="w-50 wrapper-all rounded-2 p-4 mt-4 d-flex flex-column gap-3">
				<div>
					<h3 class="text-center">Signup</h3>
					<!-- Descriptions -->
					<p class="text-center">Please enter your credentials to signup</p>
				</div>

				<separator-component></separator-component>
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
				<!-- OR -->
				<div class="d-flex justify-content-center align-items-center gap-2">
						<div class="border-bottom w-25"></div>
						<div>OR</div>
						<div class="border-bottom w-25"></div>
					</div>
					<!-- Social Media Login -->
		 			<div class="container">
		 				<div class="row">
		 						<button class="btn btn-secondary w-100 login-42">
		 							Sign up with
									<img src="../../../../public/logo42.png" alt="42 logo" style="width: 20px;">
		 						</button>
		 				</div>
		 			</div>
				<!-- Login -->
				<div class="d-flex justify-content-center">
					Already have an account? <link-component href="/auth/login" class="text-decoration-none"> Login</link-component>
				</div>
			</div>
		</div>
		`);
	}

	style() {
		return (/*css*/`
		<style>
			.wrapper-all {
				background-color: #1c1c1e;
				border-radius: 10px;
			}
			.wrapper-all form {
				color: #fff;
			}
			.wrapper-all input {
				background-color: #333;
				color: #fff;
			}
		</style>
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

				const { data, error } = await api.auth.register({
					username,
					email,
					password,
					passwordConfirm,
				})
				if (error) throw (error);
				Toast.success("Signup successful. Please login to continue");
				window.router.push("/auth/login")
			} catch (error) {
				console.error(error.message);
				Toast.error(error.message);
			}
		});


		const handleLoginOAuth = async () => {
			try {
				window.location.href = "https://10.32.8.13:3000/api/v1/auth/42/authorize/";
				if (error) throw error;
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
				} else {
					console.error("An error occurred");
				}
			}
		}

		this.querySelector(".login-42").addEventListener("click", () => handleLoginOAuth());
	}
}

customElements.define("auth-signup-page", Signup);