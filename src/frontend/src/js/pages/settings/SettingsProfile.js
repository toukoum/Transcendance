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
		}),
	location: zod
		.string()
		.max(100, {
			message: "Must be at most 100 characters long"
		}),
});

export class SettingsProfile extends Component {
	content() {
		this.classList.add("h-100");
		const user = window.auth;
		if (!user) window.router.redirect("/auth/login&redirect=/settings/profile");
		return (/*html*/`
			<settings-layout>
			<!-- Profile Picture -->
			
			<h3 class="text-start align-self-start">Profile Picture</h3>
			<div class="d-flex flex-column align-items-center gap-3 text-light p-4 rounded">
				<div class="rounded-circle overflow-hidden" style="width: 100px; height: 100px; cursor: pointer;">
					<img src="${user.profile.avatar}" alt="Profile Picture" class="w-100 h-100 profile-avatar">
				</div>
				<form class="change-picture-form mt-2" method="post" enctype="multipart/form-data">
					<input type="file" name="avatar" accept="image/*" id="avatarInput" style="display: none;">
					<button type="button" class="btn btn-primary" id="changePictureButton">
						Change Picture
					</button>
				</form>
			</div>

			<separator-component></separator-component>


			<!-- Start form -->
			<form id="profile-form" class="d-flex flex-column gap-1">
					<h3 class="text-start">Profile</h3>

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
					<!-- Location -->
					<div class="form-group">
						<label for="location">Location</label>
						<input type="text" id="location" class="form-control" name="location" value="${user.profile.location}" placeholder="City, Country">
						<small id="location-error" class="form-text text-danger" style="display: none;"></small>
					</div>

					<!-- Submit -->
					<button-component id="submit-button" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2 m-2">	
						<span id="loading-icon"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
						Save
					</button-component>

				</form>
			</settings-layout>
		`);
	}


	style () {	
		return (/*css*/`
		<style>
			.profile-avatar {
				object-fit: cover;
			}
		</style>
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
					bio,
					location
				} = Object.fromEntries(formData.entries());

				schemaProfile.parse({
					username,
					firstName,
					lastName,
					bio,
					location
				});

				const { data, error } = await api.auth.update({
					username,
					firstName,
					lastName,
					bio,
					location
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
		

		// Profile Picture
		const avatarInput = document.getElementById("avatarInput");
		const changePictureButton = document.getElementById("changePictureButton");
		const profileImage = document.querySelector(".profile-avatar");

		profileImage.addEventListener("click", () => {
			avatarInput.click();
		});
		changePictureButton.addEventListener("click", () => {
			avatarInput.click();
		});

		avatarInput.addEventListener("change", async () => {
			const file = avatarInput.files[0];
			if (!file) {
				Toast.error("No file selected");
			}
			const formData = new FormData();
			formData.append('avatar', file);

			try {
				const response = await fetch(`${api.baseUrl}/avatar/upload/`, {
					method: 'POST',
					credentials: 'include',
					body: formData,
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Failed to upload avatar');
				}
				const { data, error } = await api.request.get("me/");
				if (error) throw error;

				profileImage.src = data.profile.avatar;
				window.auth.profile.avatar = data.profile.avatar;
				Toast.success("Profile picture updated successfully");
			} catch (error) {
				console.error(error.message);
				Toast.error(error.message);
			}
		});
	
	
	
	
	
	
	
	
	}
}

customElements.define("settings-profile-page", SettingsProfile);