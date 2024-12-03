import { api } from "../../utils/api/Api.js";
import { Component } from "../../utils/Component.js";

export class HeaderRightSide extends Component {
	content() {
		const user = window.auth;
		if (user) {
			return (/*html*/`
			<div class="dropdown">
				<div class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
					<img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
				</div>
				<ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1">
					<li><link-component class="dropdown-item" href="/user/${user.username}">Profile</link-component></li>
					<li><link-component class="dropdown-item" href="/settings">Settings</link-component></li>
					<li><hr class="dropdown-divider"></li>
					<li><span id="logout" class="dropdown-item">Sign out</span></li>
				</ul>
			</div>
			`);
		}
		return (/*html*/`
			<button class="btn bg-white px-2" onclick="window.router.push('/auth/login')">Se connecter</button>
		`);
	}

	script() {
		const button = this.querySelector("#logout");
		if (button) {
			button.addEventListener("click", async () => {
				await api.auth.logout();
				window.location.reload();
			});
		}
	}
}

customElements.define("header-right-side", HeaderRightSide);