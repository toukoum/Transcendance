import { Component } from "../../utils/Component.js";

export class ButtonNav extends Component {
	content() {
		const href = this.getAttribute("href");
		this.removeAttribute("href");
		return (`
			<link-component href="${href}" class="d-flex align-items-center gap-2 w-100 bg-white px-2 rounded-3">
				${this.childrens()}
			</link-component>
		`);
	}
}

customElements.define("button-nav-component", ButtonNav);