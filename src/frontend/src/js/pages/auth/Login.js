import { images } from "../../../config/images.js";
import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";
import { Component } from "../../utils/Component.js";
export class Login extends Component {
	content() {
		return (/*html*/`
			<main-layout>
				<div class="container container-sm bg-background rounded rounded-3 p-4 my-4 d-flex flex-column gap-2">
					<h2 class="text-center">Login</h2>
	 				<p class="text-center">Please enter your credentials to login</p>
					<separator-component></separator-component>
					<form id="login-form" class="d-flex flex-column gap-1">
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
					<div class="d-flex justify-content-center align-items-center gap-2">
						<div class="border-bottom w-25"></div>
						<div>OR</div>
						<div class="border-bottom w-25"></div>
					</div>
					<!-- Social Media Login -->
		 			<div class="container">
		 				<div class="row">
		 					<div class="col">
		 						<button class="btn btn-primary w-100 login-facebook">
		 							<i class="bi bi-facebook"></i> Login with Facebook
		 						</button>
		 					</div>
		 					<div class="col">
		 						<button class="btn btn-primary w-100 login-google">
		 							<i class="bi bi-google"></i> Login with Google
		 						</button>
		 					</div>
		 				</div>
		 			</div>
		 			<!-- Signup -->
		 			 <div class="d-flex justify-content-center">
		 				Don't have an account?<a href="/auth/signup" class="text-decoration-none">Signup</a>
		 			</div>
				</div>
			</main-layout>
		`);
	}

	script() {
		const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
		const form = this.querySelector("#login-form");
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				const formData = new FormData(form);
				const {
					identifier,
					password
				} = Object.fromEntries(formData.entries());
				const { data, error } = await api.auth.loginWithIdentifier(identifier, password);
				if (error) throw error;
				window.router.push(redirectTo || "/");
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error(error.message);
				} else {
					console.error("An error occurred");
					Toast.error("An error occurred");
				}
			}
		});

		const handleLoginOAuth = async (provider) => {
			return alert('Not implemented yet');
			try {
				const { data, error } = await api.auth.loginWithOAuth(provider);
				if (error) throw error;
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
				} else {
					console.error("An error occurred");
				}
			}
		}

		this.querySelector(".login-facebook").addEventListener("click", () => handleLoginOAuth("facebook"));
		this.querySelector(".login-google").addEventListener("click", () => handleLoginOAuth("google"));
	}
}

customElements.define("auth-login-page", Login);