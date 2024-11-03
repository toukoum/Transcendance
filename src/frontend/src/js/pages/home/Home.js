import { Component } from "../../utils/Component.js";

export class Home extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		return (`
			<h1>Home</h1>
			<p>This is the home page</p>
		`);
	}
}

customElements.define("home-page", Home);