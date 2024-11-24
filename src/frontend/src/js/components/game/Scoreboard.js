import { Component } from "../../utils/Component.js";
export class Scoreboard extends Component {
	content() {
		const user = window.auth;
		return (/*html*/`
		<div class="scoreboard position-absolute top-0 start-50 translate-middle-x p-2 border rounded">
			<div class="scoreboard__content container">
				SALAM
			</div>
		</div>
		`);
	}
	
	script() {

	}
}

customElements.define("game-scoreboard-component", Scoreboard);
