import { Component } from "../../utils/Component.js";

export class SettingsNav extends Component {
	content() {
		const routes = [
			{
				label: "Profile",
				href: "/settings/profile",
				isActive: window.location.pathname === "/settings/profile" || window.location.pathname === "/settings"
			},
			{
				label: "Security",
				href: "/settings/security",
				isActive: window.location.pathname === "/settings/security"
			},
			{
				label: "Web3",
				href: "/settings/web3",
				isActive: window.location.pathname === "/settings/web3"
			}
		]
		return (/*html*/`
		<nav class="nav">
			<ul class="nav col-12 col-md-auto mb-2 justify-content-center align-items-center mb-md-0 gap-2" style="pointer-events: auto;">
				${routes.map(route => (/*html*/`
					<li><button-component href="${route.href}" variant="${route.isActive ? "muted-enabled" : "muted"}">${route.label}</button-component></li>
				`)).join("")}
			</ul>
		</nav>
		`);
	}
}

customElements.define("settings-nav-component", SettingsNav);