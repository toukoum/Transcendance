import { Toast } from "../../../provider/toast-provider.js";
import { Component } from "../../../utils/Component.js";

export class WaitingScreen extends Component {
	content() {
		const id = this.getAttribute("id");
		const gameId = this.getAttribute("game-id");
		return (/*html*/`
		<div id="${id}" class="waiting-screen position-absolute top-50 start-50 translate-middle p-2 border rounded bg-background w-50">
			<div class="waiting-screen__content">
				<div class="py-2">
					<div class="d-flex justify-content-center align-items-center gap-2">
						<h3 class="text-center">Game</h3>
						<h3 id="game-id" class="border p-1 rounded text-center" style="cursor: pointer;">${gameId}</h3>
					</div>
					<p class="text-center text-muted-foreground">Waiting for players<span id="animated-dots"></span></p>
				</div>
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

		// onclick on game-id copy to clipboard
		const gameIdCopy = this.querySelector("#game-id");
		gameIdCopy.addEventListener("click", () => {
			navigator.clipboard.writeText(gameIdCopy.textContent);
			Toast.success("Game ID copied to clipboard");
		});

	}
}

customElements.define("game-waiting-screen", WaitingScreen);
