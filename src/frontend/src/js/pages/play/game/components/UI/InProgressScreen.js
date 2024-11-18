import { BaseScreen } from "./BaseScreen.js";

export class InProgressScreen extends BaseScreen {
    enter() {
        super.enter();
        console.log("[InProgressScreen] Showing in progress screen with data:", this.data);
        this.showInProgressScreen(this.data);
    }

    exit() {
        super.exit();
        console.log("[InProgressScreen] Cleaning up in progress screen");
        this.hideInProgressScreen();
    }

    showInProgressScreen(data) {
		console.log("[InProgressScreen] Showing in progress screen");
		this.element = document.createElement("div");
		this.element.classList.add("in-progress-screen");

		// Add style
		this.element.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "bg-danger", "p-2", "rounded");

		// Create a list of players
		this.element.innerHTML = /*html*/ `
			<div class="in-progress-screen__content">
			</div>
		`;

		this.game.container.appendChild(this.element);
    }

    hideInProgressScreen() {
		if (this.element) {
			this.element.remove();
		}
        // Logique pour nettoyer l'écran d'attente
        console.log("[InProgressScreen] Hiding waiting screen");
    }
}
