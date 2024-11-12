import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";

import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'

const twoFactorSchema = zod.object({
	enabled: zod.boolean()
});

const passwordSchema = zod.object({
	currentPassword: zod,
	newPassword: zod
		.string()
		.min(8, {
			message: "Must be at least 8 characters long"
		})
		.max(128, {
			message: "Must be at most 128 characters long"
		})
		.refine((value) => /^[a-zA-Z0-9!@#$%^&*_\-]*$/.test(value), {
			message: "Must contain only letters, numbers, and special characters"
		}),
	confirmPassword: zod
		.string()
});

export class SettingsSecurity extends Component {
	content() {
		const user = window.auth;
		return (/*html*/`
			<settings-layout>
				<div class="d-flex flex-column gap-3">
					<div class="d-flex flex-column gap-1">
						<h3>Two-Factor Authentication</h3>
						<form id="twofa-form" class="d-flex flex-column gap-1">
							<div class="form-check form-switch">
								<input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" name="enabled" ${user.is_2fa_enabled ? "checked" : ""}>
								<label class="form-check-label" for="flexSwitchCheckDefault">Enable Two-Factor Authentication (2FA)</label>
							</div>
							<button-component id="submit-twofa" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="loading-twofa"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Save
							</button-component>
						</form>
					</div>
					<!-- <separator-component></separator-component> -->
					<div class="d-flex flex-column gap-1">
						<h3>Change Password</h3>
						<form id="password-form" class="d-flex flex-column gap-1">
							<div class="form-group">
								<label for="currentPassword">Current Password</label>
								<input type="password" id="currentPassword" class="form-control" name="currentPassword" placeholder="Current Password">
								<small id="currentPassword-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<div class="form-group">
								<label for="newPassword">New Password</label>
								<input type="password" id="newPassword" class="form-control" name="newPassword" placeholder="New Password">
								<small id="newPassword-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<div class="form-group">
								<label for="confirmPassword">Confirm Password</label>
								<input type="password" id="confirmPassword" class="form-control" name="confirmPassword" placeholder="Confirm Password">
								<small id="confirmPassword-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<button-component id="submit-password" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">	
								<span id="loading-password"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Save
							</button-component>
						</form>
					</div>
				</div>
			</settings-layout>
		`);
	}

	script() {
		const twofaForm = this.querySelector("#twofa-form");
		const submitTwofa = this.querySelector("#submit-twofa");
		const loadingTwofa = this.querySelector("#loading-twofa");
		const passwordForm = this.querySelector("#password-form");
		const submitPassword = this.querySelector("#submit-password");
		const loadingPassword = this.querySelector("#loading-password");

		twofaForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingTwofa.style.display = "inline-block";
				submitTwofa.disabled = true;

				const formData = new FormData(twofaForm);
				const { enabled } = Object.fromEntries(formData.entries());
				twoFactorSchema.parse({
					enabled: enabled === "on"
				});
				console.log("twofaForm parsed");

				// const { data, error } = await api.me.updateTwoFactor({
				// 	enabled
				// });

				// if (error) throw error;

				Toast.success("Two-Factor Authentication updated successfully");
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error(error.message);
				} else if (error instanceof zod.ZodError) {
					error.errors.forEach(err => {
						const input = twofaForm.querySelector(`[name="${err.path[0]}"]`);
						const errorElement = twofaForm.querySelector(`#${err.path[0]}-error`);
						if (input && errorElement) {
							input.classList.add("is-invalid");
							errorElement.innerText = err.message;
							errorElement.style.display = "block";
						}
					});
				} else {
					// console.error(`An error occurred: ${error}`);
					Toast.error("An error occurred");
				}
			} finally {
				loadingTwofa.style.display = "none";
				submitTwofa.disabled = false;
			}
		});

		passwordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingPassword.style.display = "inline-block";
				submitPassword.disabled = true;

				const formData = new FormData(passwordForm);
				const {
					currentPassword,
					newPassword,
					confirmPassword
				} = Object.fromEntries(formData.entries());

				passwordSchema.parse({
					currentPassword,
					newPassword,
					confirmPassword
				});

				const { data, error } = await api.auth({
					currentPassword,
					newPassword,
					confirmPassword
				});

				// if (error) throw error;

				Toast.success("Password updated successfully");
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error(error.message);
				} else if (error instanceof zod.ZodError) {
					error.errors.forEach(err => {
						const input = passwordForm.querySelector(`[name="${err.path[0]}"]`);
						const errorElement = passwordForm.querySelector(`#${err.path[0]}-error`);
						if (input && errorElement) {
							input.classList.add("is-invalid");
							errorElement.innerText = err.message;
							errorElement.style.display = "block";
						}
					});
				} else {
					// console.error(`An error occurred: ${error}`);
					Toast.error("An error occurred");
				}
			} finally {
				loadingPassword.style.display = "none";
				submitPassword.disabled = false;
			}
		});


		// form.addEventListener("submit", async (e) => {
		// 	e.preventDefault();
		// 	try {
		// 		loadingIcon.style.display = "inline-block";
		// 		submitButton.disabled = true;
				
		// 		const formData = new FormData(form);
		// 		const {
		// 			username,
		// 			firstName,
		// 			lastName,
		// 			bio
		// 		} = Object.fromEntries(formData.entries());

		// 		schemaProfile.parse({
		// 			username,
		// 			firstName,
		// 			lastName,
		// 			bio
		// 		});

		// 		const { data, error } = await api.me.update({
		// 			username,
		// 			firstName,
		// 			lastName,
		// 			bio
		// 		})
		// 		if (error) throw error;
		// 		window.auth = data;

		// 		Toast.success("Profile updated successfully");
		// 	} catch (error) {
		// 		if (error instanceof ApiRequestError) {
		// 			console.error(error.message);
		// 			Toast.error(error.message);
		// 		} else if (error instanceof zod.ZodError) {
		// 			error.errors.forEach(err => {
		// 				const input = form.querySelector(`[name="${err.path[0]}"]`);
		// 				const errorElement = form.querySelector(`#${err.path[0]}-error`);
		// 				if (input && errorElement) {
		// 					input.classList.add("is-invalid");
		// 					errorElement.innerText = err.message;
		// 					errorElement.style.display = "block";
		// 				}
		// 			});
		// 		} else {
		// 			// console.error(`An error occurred: ${error}`);
		// 			Toast.error("An error occurred");
		// 		}
		// 	} finally {
		// 		loadingIcon.style.display = "none";
		// 		submitButton.disabled = false;
		// 	}
		// });
	}
}

customElements.define("settings-security-page", SettingsSecurity);