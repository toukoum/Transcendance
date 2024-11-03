import { Component } from "../../utils/Component.js";

export class User extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		return (`
			<h1>User: ${this.getAttribute("username")}</h1>
		`);
	}
}

customElements.define("user-page", User);