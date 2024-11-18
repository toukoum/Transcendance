import { BaseScreen } from "./BaseScreen.js";

export class WaitingScreen extends BaseScreen {
    enter() {
        super.enter();
        console.log("[WaitingScreen] Showing waiting screen with data:", this.data);
        // const { players } = this.data;
        this.showWaitingScreen(this.data);
    }

    exit() {
        super.exit();
        console.log("[WaitingScreen] Cleaning up waiting screen");
        this.hideWaitingScreen();
    }

    showWaitingScreen(data) {
		console.log("[WaitingScreen] Showing waiting screen");
		this.element = document.createElement("div");
		this.element.classList.add("waiting-screen");

		// Add style
		this.element.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "bg-danger", "p-2", "rounded");

		// Create a list of players
		this.element.innerHTML = /*html*/ `
			<div class="waiting-screen__content">
				<h2>Waiting for players... ${data.connected_players}/${data.max_players}</h2>
			</div>
		`;

		this.game.container.appendChild(this.element);
    }

    hideWaitingScreen() {
		if (this.element) {
			this.element.remove();
		}
        // Logique pour nettoyer l'écran d'attente
        console.log("[WaitingScreen] Hiding waiting screen");
    }
}
