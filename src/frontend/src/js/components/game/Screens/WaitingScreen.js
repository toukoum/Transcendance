import { Component } from "../../../utils/Component.js";

export class WaitingScreen extends Component {
	content() {
		const id = this.getAttribute("id");
		return (/*html*/`
		<div id="${id}" class="waiting-screen position-absolute top-50 start-50 translate-middle p-2 border rounded bg-background w-50">
			<div class="waiting-screen__content">
				<h3>Waiting for players<span id="animated-dots"></span></h3>
				<separator-component></separator-component>
				<div id="players-list" class="d-flex flex-column gap-2 my-2">
				</div>
			</div>
		</div>
		`);
	}
	
	script() {

		const animatedDots = this.querySelector("#animated-dots");
		let dots = 0;
		setInterval(() => {
			animatedDots.textContent = ".".repeat(dots);
			dots = (dots + 1) % 4;
		}, 500);
	}
}

customElements.define("game-waiting-screen", WaitingScreen);
