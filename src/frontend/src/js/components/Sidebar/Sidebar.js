import { Component } from "../../utils/Component.js";

export class Sidebar extends Component {
	content() {
		return (/*html*/`
			<aside class="container text-center bg-primary-subtle h-100 p-2">
				<h2>Pong42</h2>
				<sidebar-routes-component></sidebar-routes-component>
			</aside>
		`);
	}
}

customElements.define("sidebar-component", Sidebar);