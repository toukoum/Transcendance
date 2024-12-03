import { api } from "../../utils/api/Api.js";
import { Component } from "../../utils/Component.js";

export class UserNav extends Component {
	content() {
		const user = window.auth;
		if (!user) return "";
		return (/*html*/`
		<div class="dropdown d-flex align-items-center flex-row-reverse">
			<ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1">
				<li><link-component class="dropdown-item" href="/user/${user.username}">Profile</link-component></li>
				<li><link-component class="dropdown-item" href="/settings">Settings</link-component></li>
				<li><hr class="dropdown-divider"></li>
				<li><span id="logout" class="dropdown-item">Sign out</span></li>
			</ul>
			<div class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
				<img src="${user.profile.avatar}" alt="mdo" class="pdp">
			</div>
		</div>
		`);
	}

	style() {
		return (/*css*/`
		<style>
			.pdp {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				object-fit: cover;
				border: 1px solid #1C1C1E;
			}
		</style>
		`);
	}

	script() {
		const button = this.querySelector("#logout");
		if (button) {
			button.addEventListener("click", async () => {
				try {

					const { data, error } = await api.auth.logout();
					if (error) throw error;
					window.location.reload();
				} catch (error) {
					console.error(error);
				}
			});
		}
	}
}

customElements.define("usernav-component", UserNav);