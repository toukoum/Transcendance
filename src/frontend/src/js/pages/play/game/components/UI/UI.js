import Game from "../../index.js";
import { InProgressScreen } from "./InProgressScreen.js";
import { WaitingScreen } from "./WaitingScreen.js";

export class UI {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
			throw new Error("[Game: UI] Game instance is required");
		}
		this.game = game;
		this.screen = null;
		this.screens = {
			waiting: WaitingScreen,
		}

		// Subscriber
		this.game.pingManager.subscribe((data) => {
			this.updatePing(data);
		})

		// UI elements
		this.createScoreboard();
		this.createNetworkStatus();
	}

	setScreen(screenType, data) {
		if (this.screen) {
			this.screen.exit(); // Exit the current screen
		}

		const ScreenClass = this.screens[screenType];
		if (ScreenClass) {
			this.screen = new ScreenClass(this.game, data);
			this.screen.enter(); // Enter the new screen
		} else {
			console.error(`[Game: UI] Unknown screen ${screenType}`);
		}
	}

	deleteScreen() {
		if (this.screen) {
			this.screen.exit();
			this.screen = null;
		}
	}

	/* ------------------------------- Scoreboard ------------------------------- */
	createScoreboard() {
		this.scoreboard = document.createElement("div");
		this.scoreboard.classList.add("scoreboard", "position-absolute", "top-0", "start-50", "translate-middle-x", "p-2", "border", "rounded");
		this.scoreboard.innerHTML = /*html*/ `
			<div class="scoreboard__content">
				<h2>Scoreboard</h2>
			</div>
		`;

		this.game.container.appendChild(this.scoreboard);
	}

	/* -------------------------------------------------------------------------- */

	/* ----------------------------- Network Status ----------------------------- */
	createNetworkStatus() {
		this.networkStatus = document.createElement("div");
		this.networkStatus.classList.add("network-status", "position-absolute", "bottom-0", "start-0", "p-2", "border", "rounded");
		this.networkStatus.innerHTML = /*html*/ `
			<div class="network-status__content">
				<h2>Network Status</h2>
				<div class="network-status__ping">
					<span>Ping: </span>
					<span id="network-status-ping"></span>
				</div>
			</div>
		`;

		this.game.container.appendChild(this.networkStatus);
	}

	updatePing(data) {
		const pingElement = document.getElementById("network-status-ping");
		if (pingElement) {
			pingElement.textContent = `${data.ping} ms`;
		}
	}
}