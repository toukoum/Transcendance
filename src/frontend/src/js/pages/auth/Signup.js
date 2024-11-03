import { Component } from "../../utils/Component.js";

export class Signup extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		return (`
			<h1>Signup</h1>
			<p>This is the Signup page</p>
		`);
	}
}

customElements.define("auth-signup-page", Signup);