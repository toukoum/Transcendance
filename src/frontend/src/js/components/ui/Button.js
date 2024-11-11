import { Component } from "../../utils/Component.js";

export class Button extends Component {
	content() {
		// Variants
		const variant = this.getAttribute("variant") || "primary";
		const href = this.getAttribute("href");
		return (/*html*/`
			${href ? (/*html*/`
				<link-component href="${href}" class="btn btn-${variant}">${this.innerHTML}</link-component>
			`) : (/*html*/`
				<button class="btn btn-${variant}">${this.innerHTML}</button>
			`)}
		`);
	}
}

customElements.define("button-component", Button);