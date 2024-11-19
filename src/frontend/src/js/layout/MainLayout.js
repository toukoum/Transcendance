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
		<div class="d-flex flex-column h-100 bg-background-main">
			<header-component></header-component>
			${this.childrens()}
		</div>
		<toast-provider/>
		`);
	}
}

customElements.define("main-layout", MainLayout);