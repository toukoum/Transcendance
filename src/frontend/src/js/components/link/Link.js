import { Component } from "../../utils/Component.js";

export class Link extends Component {
	content() {
		const href = this.getAttribute("href");
		const className = this.getAttribute("class");
		this.removeAttribute("href");
		this.removeAttribute("class");

		return (`
			<a href="${href}" class="${className}" onclick="event.preventDefault(); window.router.push('${href}')">
				${this.childrens()}
			</a>
		`);
	}
}

customElements.define("link-component", Link);