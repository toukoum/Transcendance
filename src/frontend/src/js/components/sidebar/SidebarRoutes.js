import { Component } from "../../utils/Component.js";

export class SidebarRoutes extends Component {
	content() {
		const pathname = window.location.pathname;
		const routes = [
			{
				icon: "house",
				label: "Home",
				active: pathname === "/",
				href: "/"
			},
			{
				icon: "search",
				label: "Search",
				active: pathname.startsWith("/search"),
				href: "/search"
			},
			{
				icon: "trophy",
				label: "Leaderboard",
				active: pathname.startsWith("/leaderboard"),
				href: "/leaderboard"
			},
		]
		return (`
			<nav class="container text-center d-flex flex-column gap-2">
				${routes.map(route => `
					<button-nav-component href="${route.href}" active="${route.active}">
						${route.icon && `<i class="bi bi-${route.icon} pr-2"></i>`}
						<span>${route.label}</span>
					</button-nav-component>
				`).join("")}
			</nav>
		`);
	}
}

customElements.define("sidebar-routes-component", SidebarRoutes);