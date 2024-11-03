import { Component } from "../utils/Component.js";

export class MainLayout extends Component {
	constructor() {
		super();
		this.classList.add("container-fluid", "d-flex", "flex-row", "h-100");
		// this.classList.add("h-100");
		// this.classList.add("overflow-hidden");
	}
	content() {
		return (/*html*/`
			<sidebar-component></sidebar-component>
			<main class="container-fluid d-flex flex-column">
				<header-component></header-component>
				${this.childrens()}
			</main>
		`);
	}
}

customElements.define("main-layout", MainLayout);