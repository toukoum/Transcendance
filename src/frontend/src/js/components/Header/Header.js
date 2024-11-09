import { Component } from "../../utils/Component.js";

export class Header extends Component {
	content() {
		const user = window.user;
		return (/*html*/`
		<header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between p-3 mb-4 border-bottom bg-white rounded rounded-pill">
			<div class="col-md-3 mb-2 mb-md-0">
				<link-component href="/" class="d-flex align-items-center gap-2 text-dark text-decoration-none">
				PONG42
				</link-component>
			</div>

			<ul class="nav col-12 col-md-auto mb-2 justify-content-center align-items-center mb-md-0 gap-4" style="pointer-events: auto;">
				<li><link-component href="/" class="nav-link px-2">HOME</link-component></li>
				<li><link-component href="/play" class="nav-link px-2 pa-btn">PLAY</link-component></li>
				<li><link-component href="/leaderboard" class="nav-link px-2">LEADERBOARD</link-component></li>
			</ul>

			<div class="col-md-3 justify-content-end d-flex gap-2">
				${user ? (/*html*/`
					<usernav-component></usernav-component>
				`) : (/*html*/`
					<link-component type="button" class="btn btn-outline-primary me-2" href="/auth/login">Login</link-component>
					<link-component type="button" class="btn btn-primary" href="/auth/signup">Sign-up</link-component>
				`)}
			</div>
		</header>
		`);
	}
}

customElements.define("header-component", Header);