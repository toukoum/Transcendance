import { Component } from "../../utils/Component.js";
import { mergeClasses } from "../../utils/hooks/merge-classes.js";

export class Button extends Component {
	content() {
		// Variants
		const className = this.getAttribute("class");
		const variant = this.getAttribute("variant") || "primary";
		const href = this.getAttribute("href");
		const type = this.getAttribute("type") || "button";

		const dynamicAttributes = Array.from(this.attributes)
			.filter(attr => !["variant", "href", "type"].includes(attr.name)) // exclure les attributs spécifiques
			.map(attr => `${attr.name}="${attr.value}"`)
			.join(" ");

		return (/*html*/`
			${href ? (/*html*/`
				<link-component href="${href}" class="${mergeClasses(`btn btn-${variant}`, className)}" ${dynamicAttributes}>
					${this.childrens()}
				</link-component>
			`) : (/*html*/`
				<button type=${type} class="${mergeClasses(`btn btn-${variant}`, className)}" ${dynamicAttributes} >
					${this.childrens()}
				</button>
			`)}
		`);
	}
}

customElements.define("button-component", Button);