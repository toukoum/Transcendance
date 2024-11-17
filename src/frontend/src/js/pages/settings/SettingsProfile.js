import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";

import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'

const schemaProfile = zod.object({
	username: zod
		.string()
		.min(3, {
			message: "Must be at least 3 characters long"
		})
		.max(20, {
			message: "Must be at most 20 characters long"
		}),
	firstName: zod
		.string()
		.min(1, {
			message: "Must be at least 1 character long"
		})
		.max(20, {
			message: "Must be at most 20 characters long"
		}),
	lastName: zod
		.string()
		.min(1, {
			message: "Must be at least 1 character long"
		})
		.max(20, {
			message: "Must be at most 20 characters long"
		}),
	bio: zod
		.string()
		.max(200, {
			message: "Must be at most 200 characters long"
		})
});

export class SettingsProfile extends Component {
	content() {
		const user = window.auth;
		if (!user) window.router.redirect("/auth/login&redirect=/settings/profile");
		return (/*html*/`
			<settings-layout>
				<!-- Start form -->
				<form id="profile-form" class="d-flex flex-column gap-1">
					<!-- Username -->
					<div class="form-group">
						<label for="username">Username</label>
						<input type="text" id="username" class="form-control" name="username" value="${user.username}" placeholder="Username">
						<small id="username-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<!-- First Name -->
					<div class="form-group">
						<label for="firstName">First Name</label>
						<input type="text" id="firstName" class="form-control" name="firstName" value="${user.first_name}" placeholder="John">
						<small id="firstName-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<!-- Last Name -->
					<div class="form-group">
						<label for="lastName">Last Name</label>
						<input type="text" id="lastName" class="form-control" name="lastName" value="${user.last_name}" placeholder="Doe">
						<small id="lastName-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<!-- Bio -->
					<div class="form-group">
						<label for="bio">Bio</label>
						<textarea id="bio" class="form-control" name="bio" placeholder="Describe yourself here...">${user.profile.bio}</textarea>
						<small id="bio-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<!-- Submit -->
					<button-component id="submit-button" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">	
						<span id="loading-icon"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
						Save
					</button-component>
				</form>
			</settings-layout>
		`);
	}

	script() {
		const form = this.querySelector("#profile-form");
		const submitButton = this.querySelector("#submit-button");
		const loadingIcon = this.querySelector("#loading-icon");

		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingIcon.style.display = "inline-block";
				submitButton.disabled = true;
				
				const formData = new FormData(form);
				const {
					username,
					firstName,
					lastName,
					bio
				} = Object.fromEntries(formData.entries());

				schemaProfile.parse({
					username,
					firstName,
					lastName,
					bio
				});

				const { data, error } = await api.auth.update({
					username,
					firstName,
					lastName,
					bio
				})
				if (error) throw error;
				window.auth = data;
				// clear errors
				form.querySelectorAll(".is-invalid").forEach(input => input.classList.remove("is-invalid"));
				form.querySelectorAll(".form-text").forEach(errorElement => {
					errorElement.innerText = "";
					errorElement.style.display = "none";
				});
				Toast.success("Profile updated successfully");
			} catch (error) {
				if (error instanceof ApiRequestError) {
					console.error(error.message);
					Toast.error(error.message);
				} else if (error instanceof zod.ZodError) {
					error.errors.forEach(err => {
						err.path.forEach(path => {
							const input = form.querySelector(`[name="${path}"]`);
							const errorElement = form.querySelector(`#${path}-error`);
							if (input && errorElement) {
								input.classList.add("is-invalid");
								errorElement.innerText = err.message;
								errorElement.style.display = "block";
							}
						});
						// const input = form.querySelector(`[name="${err.path[0]}"]`);
						// const errorElement = form.querySelector(`#${err.path[0]}-error`);
						// if (input && errorElement) {
						// 	input.classList.add("is-invalid");
						// 	errorElement.innerText = err.message;
						// 	errorElement.style.display = "block";
						// }
					});
				} else {
					// console.error(`An error occurred: ${error}`);
					Toast.error("An error occurred");
				}
			} finally {
				loadingIcon.style.display = "none";
				submitButton.disabled = false;
			}
		});
	}
}

customElements.define("settings-profile-page", SettingsProfile);