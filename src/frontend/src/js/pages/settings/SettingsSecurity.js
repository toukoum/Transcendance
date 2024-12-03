import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";

import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'

const passwordSchema = zod.object({
	newPassword: zod.string()
			.min(8, {
					message: "Must be at least 8 characters long"
			})
			.max(128, {
					message: "Must be at most 128 characters long"
			})
			.refine((value) => !/\s/.test(value), {
					message: "Cannot contain whitespace",
			}),
	confirmPassword: zod.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

export class SettingsSecurity extends Component {
	content() {
		this.classList.add("h-100");
		return (/*html*/`
			<settings-layout>
				<div class="d-flex flex-column gap-3">
					<div class="d-flex flex-column gap-1">
			
						<h3>Two-Factor Authentication</h3>
						<p> Is 2Fa Configure ? <span class="is-2fa-configure"></span> </p>


						<div class="bg-dark p-3 rounded align-items-center toggle-2fa-wrapper">
							<div class="form-check form-switch text-light me-3">
								<input class="form-check-input" type="checkbox" id="toggle-2fa" style="cursor: pointer;">
								<label class="form-check-label" for="toggle-2fa">Two-Factor Authentication</label>
							</div>
							<div id="loading-2fa" class="spinner-border spinner-border-sm text-light ms-auto" role="status" aria-hidden="true" style="display: none;"></div>
						</div>	

						<div class="configure-2fa-wrapper" style="display: none;">
							<button-component id="otp-send" class="w-100">
								Configure by email
								<span id="loading-otp-send"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
							</button-component>
							<form id="otp-form" class="d-flex gap-2 p-3 align-items-center">
								<div class="form-group w-100">
									<label for="otp">Enter Code</label>
									<input type="text" id="otp" class="form-control" name="otp" placeholder="Enter Code">
									<small id="otp-error" class="form-text text-danger" style="display: none;"></small>
								</div>
								<button-component id="otp-submit" type="submit" variant="muted" class="d-flex justify-content-center gap-2 align-items-end">
									Verify
									<span id="loading-otp-submit"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								</button-component>
							</form>
						</div>
					</div>



					<separator-component></separator-component>
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

	async setup2fa(){
		const toggle2FA = document.querySelector("#toggle-2fa");
		let is2FAEnabled = false;
    try {
      const { data, error } = await api.request.get("me/");
      if (error) throw error;
      is2FAEnabled = data.profile.is_2fa_enabled;
      toggle2FA.checked = is2FAEnabled;
    } catch (error) {
      console.error(error);
      Toast.error("An error occurred");
    }
	}

	async is2faConfigure(){
		const response = await api.request.get("auth/2fa/mfa/user-active-methods/");
		if (response.error) return false;
		return response.data.length > 0;
	}

	async configure2fa(){
		const otpSend = document.querySelector("#otp-send");
		const otpForm = document.querySelector("#otp-form");

		otpSend.addEventListener("click", async (e) => {
			try {
				document.querySelector("#loading-otp-send").style.display = "inline-block";
				const response = await api.request.post("auth/2fa/email/activate/");
				Toast.success(response.data.details);
			} catch (error) {
				console.error(error);
				Toast.error("An error occurred");
			} finally {
				document.querySelector("#loading-otp-send").style.display = "none";
			}
		});

		otpForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				document.querySelector("#loading-otp-submit").style.display = "inline-block";
				const response = await api.request.post("auth/2fa/email/activate/confirm/", {
					code: otpForm.querySelector("#otp").value
				});
				otpForm.querySelector("#otp").value = "";
				const { data, error } = await api.request.post("auth/2fa/activate/");
				if (error) throw error;
				Toast.success(data.message);
				Toast.success("2FA activated successfully");
				window.location.reload();
			} catch (error) {
				console.error(error);
				Toast.error("An error occurred while activating 2FA");
			} finally{
				document.querySelector("#loading-otp-submit").style.display = "none";
			}
		});
	}

	async toggle2fa(){
		const toggle2FA = document.querySelector("#toggle-2fa");
    const loading2FA = document.querySelector("#loading-2fa");

    toggle2FA.addEventListener("change", async () => {
      try {
        loading2FA.style.display = "inline-block";
        let data, error;
        if (toggle2FA.checked) {
          ({ data, error } = await api.request.post("auth/2fa/activate/"));
        } else {
          ({ data, error } = await api.request.post("auth/2fa/deactivate/"));
        }
        if (error) throw error;
        Toast.success(data.message);
      } catch (error) {
        console.error(error);
        Toast.error("Une erreur s'est produite");
        toggle2FA.checked = !toggle2FA.checked;
      } finally {
        loading2FA.style.display = "none";
      }
    });
	}

	async script() {
		
		this.setup2fa();
		const is2faConfigured = await this.is2faConfigure();
		
		document.querySelector(".is-2fa-configure").innerText = is2faConfigured ? "Yes" : "No";
		
		if (is2faConfigured) {
			document.querySelector(".toggle-2fa-wrapper").style.display = "block";
			document.querySelector(".configure-2fa-wrapper").style.display = "none";
		} else {
			document.querySelector(".toggle-2fa-wrapper").style.display = "none";
			document.querySelector(".configure-2fa-wrapper").style.display = "block";
		}
		
		this.configure2fa();
		this.toggle2fa();
		
		
		const passwordForm = document.querySelector("#password-form");
		const submitPassword = document.querySelector("#submit-password");
		const loadingPassword = document.querySelector("#loading-password");
		
		
		
		
		passwordForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingPassword.style.display = "inline-block";
				submitPassword.disabled = true;

				const formData = new FormData(passwordForm);
				const { currentPassword, newPassword, confirmPassword } = Object.fromEntries(formData.entries());

				passwordSchema.parse({
					currentPassword,
					newPassword,
					confirmPassword
				});

				const response = await api.auth.loginWithIdentifier(window.auth.username, currentPassword);

				if (response.error) throw new ApiRequestError("Current password is incorrect");

				const { data, error } = await api.request.post('auth/password/change/', {
					new_password1: newPassword,
					new_password2: confirmPassword,
				})

				if (error) throw error;

				Toast.success("Password updated successfully");
				passwordForm.querySelectorAll(".is-invalid").forEach(input => input.classList.remove("is-invalid"));
				passwordForm.querySelectorAll(".form-text").forEach(errorElement => {
					errorElement.innerText = "";
					errorElement.style.display = "none";
				});
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error("Password invalid");
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
					console.error(`An error occurred: ${error}`);
					Toast.error("An error occurred");
				}
			} finally {
				loadingPassword.style.display = "none";
				submitPassword.disabled = false;
			}
		});

	}
}

customElements.define("settings-security-page", SettingsSecurity);