import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";
import { Component } from "../../utils/Component.js";
export class Login extends Component {
	content() {
		this.classList.add("h-100");
		return (/*html*/`
			<main-layout>

				<div class="h-100 d-flex p-2 justify-content-center align-items-center">

				<div class="otp-modal modal-dialog modal-dialog-centered p-4 position-absolute bg-background border border-secondary rounded rounded-3 top-50 start-50 translate-middle" style="width: 300px; display: none;">
					<div class="modal-content bg-background text-light">
						<div class="modal-header border-0 w-100 d-flex justify-content-between">
							<h5 class="modal-title">Enter the code</h5>
							<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fermer"></button>
						</div>
						<div class="modal-body">
							<form id="otp-form">
								<div class="mb-3">
									<label for="otp" class="form-label">6 Digits code</label>
									<input type="text" id="otp" class="form-control bg-background text-light border-secondary" placeholder="Enter the code">
								</div>
								<button type="submit" class="btn btn-outline-light w-100">
									Vérifier
									<span id="loading-otp-submit" class="spinner-border spinner-border-sm text-light ms-2 d-none" role="status" aria-hidden="true"></span>
								</button>
							</form>
						</div>
					</div>
				</div>
				
				<div class="container  wrapper-all container-sm rounded rounded-3 p-4 my-4 d-flex flex-column gap-2">
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
		 						<button class="btn btn-secondary w-100 login-42">
		 							Login with
									<img src="../../../../public/logo42.png" alt="42 logo" style="width: 20px;">
		 						</button>
		 				</div>
		 			</div>
		 			<!-- Signup -->
					<div class="d-flex justify-content-center">
		 				Don't have an account? <link-component href="/auth/signup" class="text-decoration-none"> Signup</link-component>
		 			</div>
				</div>
			</div>
			</main-layout>
		`);
	}

	style() {
		return (/*css*/`
		<style>
			.wrapper-all {
				background-color: #1c1c1e;
		}
		</style>
		`);
	}

	otpModal(ephemeral_token, redirectTo){

		const modal = document.querySelector(".otp-modal");
		modal.style.display = "block";

		modal.querySelector("#otp-form").addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				const otp = modal.querySelector("#otp").value;
				const { data, error } = await api.request.post("auth/2fa/validate/", {
					ephemeral_token: ephemeral_token,
					code: otp,
				});
				if (error) throw error;
				window.router.push(redirectTo || "/");
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error(error.message);
				} else {
					console.error(error);
					Toast.error("Invalide Code");
				}
			}
		});
	}

	script() {
		const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
		const form = document.querySelector("#login-form");
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
				if (data.ephemeral_token != undefined){
					this.otpModal(data.ephemeral_token, redirectTo);
				} else {
					window.router.push(redirectTo || "/");
				}
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error(error.message);
				} else {
					console.error(error);
					Toast.error("Unable to log in with the provided credentials.");
				}
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
					console.error("Unable to log in with the provided credentials.");
				}
			}
		}

		document.querySelector(".login-42").addEventListener("click", () => handleLoginOAuth());




		// close modal on click on close button
		const modal = document.querySelector(".otp-modal");
		modal.querySelector(".btn-close").addEventListener("click", () => modal.style.display = "none");

	}
}

customElements.define("auth-login-page", Login);