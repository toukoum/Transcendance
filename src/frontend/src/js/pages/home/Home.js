import { Component } from "../../utils/Component.js";

export class Home extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		const user = window.user;
		return (/*html*/`
			<div>
				${user ? (/*html*/`
					<h1>Hello, ${user.username}!</h1>
				`) : ""}
	
				<!-- Basic dashboard -->

			</div>
		`);
	}
}

customElements.define("home-page", Home);