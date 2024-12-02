import GameLocal from "../../../local/GameLocal.js";
import Game from "../../Game.js";
import { LeaveButton } from "./components/LeaveButton.js";
import { BaseScreen } from "./screens/BaseScreen.js";
import { CanceledScreen } from "./screens/CanceledScreen.js";
import { FinishedScreen } from "./screens/FinishedScreen.js";
import { InitializingScreen } from "./screens/InitializingScreen.js";
import { InProgressScreen } from "./screens/InProgressScreen.js";
import { ReadyScreen } from "./screens/ReadyScreen.js";
import { WaitingScreen } from "./screens/WaitingScreen.js";


export class UI {
	constructor(game) {
		if (!game || (!(game instanceof Game) && !(game instanceof GameLocal))) {
			throw new Error("[Game: UI] Game instance is required");
		}
		this.game = game;
		
		this.screen = null;
		this.screens = {
			created: BaseScreen,
			waiting: WaitingScreen,
			ready: ReadyScreen,
			initializing: InitializingScreen,
			in_progress: InProgressScreen,
			paused: BaseScreen,
			finished: FinishedScreen,
			cancelled: CanceledScreen,
		}

		this.components = {
			leaveButton: game instanceof Game ? new LeaveButton(this.game) : null,
		}
	}

	/* --------------------------------- Screens -------------------------------- */

	activateScreen (name, data = {}) {
		if (this.screen && this.screen.name === name) {
			this.screen.update(data);
			return;
		}
		if (this.screen) {
			this.screen.exit();
		}

		const ScreenClass = this.screens[name];
		if (ScreenClass) {
			this.screen = new ScreenClass(this.game, name, data);
			this.screen.enter();
		} else {
			console.error(`[Game: UI] Unknown screen ${name}`);
		}
	}

	desactivateScreen() {
		if (this.screen) {
			this.screen.exit();
			this.screen = null;
		}
	}

	/* -------------------------------------------------------------------------- */

	/* ------------------------------- Components ------------------------------- */

	/* -------------------------------------------------------------------------- */
}

// export class UI {
// 	constructor(game) {
// 		if (!game || !(game instanceof Game)) {
// 			throw new Error("[Game: UI] Game instance is required");
// 		}
// 		this.game = game;
// 		this.screen = null;
// 		this.screens = {
// 			waiting: WaitingScreen,
// 		}

// 		// Subscriber
// 		this.game.pingManager.subscribe((data) => {
// 			this.updatePing(data);
// 		})
// 		this.game.serverData.subscribe((data) => {
// 			this.updateScoreboard(data);
// 		})

// 		// UI elements
// 		this.createScoreboard();
// 		this.createNetworkStatus();
// 	}

// 	setScreen(screenType, data) {
// 		if (this.screen) {
// 			this.screen.exit(); // Exit the current screen
// 		}

// 		const ScreenClass = this.screens[screenType];
// 		if (ScreenClass) {
// 			this.screen = new ScreenClass(this.game, data);
// 			this.screen.enter(); // Enter the new screen
// 		} else {
// 			console.error(`[Game: UI] Unknown screen ${screenType}`);
// 		}
// 	}

// 	deleteScreen() {
// 		if (this.screen) {
// 			this.screen.exit();
// 			this.screen = null;
// 		}
// 	}

// 	/* ------------------------------- Scoreboard ------------------------------- */
// 	createScoreboard() {
// 		this.scoreboard = document.createElement("game-scoreboard-component");

// 		this.game.container.appendChild(this.scoreboard);
// 	}

// 	/* -------------------------------------------------------------------------- */

// 	/* ----------------------------- Network Status ----------------------------- */
// 	createNetworkStatus() {
// 		this.networkStatus = document.createElement("div");
// 		this.networkStatus.classList.add("network-status", "position-absolute", "bottom-0", "start-0", "p-2", "border", "rounded");
// 		this.networkStatus.innerHTML = /*html*/ `
// 			<div class="network-status__content">
// 				<h2>Network Status</h2>
// 				<div class="network-status__ping">
// 					<span>Ping: </span>
// 					<span id="network-status-ping"></span>
// 				</div>
// 			</div>
// 		`;

// 		this.game.container.appendChild(this.networkStatus);
// 	}

// 	/* --------------------------------- Update --------------------------------- */

// 	updatePing(data) {
// 		const pingElement = document.getElementById("network-status-ping");
// 		if (pingElement) {
// 			pingElement.textContent = `${data.ping} ms`;
// 		}
// 	}

// 	updateScoreboard(data) {
// 		if (!(data instanceof ServerData)) {
// 			console.error("[Game: UI] Invalid data");
// 			return;
// 		}
// 		console.warn(`[Game: UI] Updating scoreboard`, data);
// 		if (data.player_1) {
// 			const player1Name = document.getElementById("scoreboard-player-1-name");
// 			const player1Score = document.getElementById("scoreboard-player-1-score");

// 			if (player1Name && player1Score) {
// 				player1Name.textContent = data.player_1.user_id;
// 				player1Score.textContent = data.player_1.score;
// 			}
// 		}
// 		if (data.player_2) {
// 			const player2Name = document.getElementById("scoreboard-player-2-name");
// 			const player2Score = document.getElementById("scoreboard-player-2-score");

// 			if (player2Name && player2Score) {
// 				player2Name.textContent = data.player_2.user_id;
// 				player2Score.textContent = data.player_2.score;
// 			}
// 		}
// 	}
// }