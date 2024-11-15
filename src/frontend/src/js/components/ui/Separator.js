import { Component } from "../../utils/Component.js";

export class Separator extends Component {
	content() {
		// Allow overriding the separator class
		const className = this.getAttribute("class");
		return (/*html*/`
			<div class="
				border-top
				border-muted-foreground
				${className ? className : ""}
			"></div>
		`);
	}
}

customElements.define("separator-component", Separator);