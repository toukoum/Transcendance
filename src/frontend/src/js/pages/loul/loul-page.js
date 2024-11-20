import { Component } from "../../utils/Component.js"

export class Loul extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		return (/*html*/`
			<p>Salut</p>
		`);
	}
}

customElements.define("loul-page", Loul);