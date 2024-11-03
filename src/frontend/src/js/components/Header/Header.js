import { Component } from "../../utils/Component.js";

export class Header extends Component {
	constructor() {
		super();
		this.classList.add("sticky-top", "w-100", "bg-secondary-subtle", "d-flex", "justify-content-between", "align-items-center", "p-2");
	}
	content() {
		return (/*html*/`
		<header-left-side></header-left-side>
		<header-right-side></header-right-side>
			<!-- <header class="sticky-top w-100 bg-secondary-subtle d-flex justify-content-between align-items-center p-2">
				<header-left-side></header-left-side>
				<header-right-side></header-right-side>
			</header> -->
		`);
	}
}

customElements.define("header-component", Header);