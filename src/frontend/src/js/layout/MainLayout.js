import { Component } from "../utils/Component.js";

export class MainLayout extends Component {
	// constructor() {
	// 	super();
	// 	// this.classList.add("container-fluid", "d-flex", "flex-row", "h-100", "p-0");
	// 	// this.classList.add("h-100");
	// 	// this.classList.add("overflow-hidden");
	// }
	content() {
		return (/*html*/`
		<div class="d-flex flex-column p-4 h-100">
			<header-component></header-component>
			${this.childrens()}
		</div>
		`);
		return (/*html*/`
		<div class="container-fluid d-flex flex-row h-100 p-0">
			<sidebar-component></sidebar-component>
			<main class="container-fluid d-flex flex-column p-0">
				<header-component></header-component>
				${this.childrens()}
			</main>
		</div>
		`);
	}
}

customElements.define("main-layout", MainLayout);