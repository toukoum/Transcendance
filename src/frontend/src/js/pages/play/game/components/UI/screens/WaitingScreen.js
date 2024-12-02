import { BaseScreen } from "./BaseScreen.js";

export class WaitingScreen extends BaseScreen {
    enter() {
        this.showWaitingScreen();
    }

    showWaitingScreen() {
		this.element = document.createElement("game-waiting-screen");
		this.element.id = "waiting-screen";
		this.element.setAttribute("game-id", this.game.serverData.match.id);
		this.game.container.appendChild(this.element);
		this.element = document.querySelector("#waiting-screen");
		
		this.updatePlayersList();
    }

	updatePlayersList() {
		const playersList = document.querySelector("#players-list");
		playersList.innerHTML = this.data.players.map(player => {
			return (/*html*/`
				<div class="player-waiting d-flex gap-2 align-items-center justify-content-between">
					<div class="player-waiting__user d-flex gap-2 align-items-center">
						<!-- AVATAR -->
						<div class="player-waiting__avatar">
							<img src="${player.user.avatar}" alt="Avatar" class=" rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
						</div>
						<!-- NAME -->
						<div class="player-waiting__name">
							${player.user.username}
						</div>
					</div>
					<!-- STATUS -->
					<div class="player-waiting__status">
						${player.state}
					</div>
				</div>
			`);
		}).join("");
	}

	update(data) {
		super.update(data);
		this.updatePlayersList();
	}
}



// FOR CONTEXT
// export class WaitingScreen extends Component {
// 	content() {
// 		return (/*html*/`
// 		<div class="waiting-screen position-absolute top-50 start-50 translate-middle p-2 border rounded bg-background w-50">
// 			<div class="waiting-screen__content">
// 				<h3>Waiting for players<span id="animated-dots"></span></h3>
// 				<separator-component></separator-component>
// 				<div id="players-list"></div>
// 			</div>
// 		</div>
// 		`);
// 	}
	
// 	script() {

// 		const animatedDots = this.querySelector("#animated-dots");
// 		let dots = 0;
// 		setInterval(() => {
// 			animatedDots.textContent = ".".repeat(dots);
// 			dots = (dots + 1) % 4;
// 		}, 500);
// 	}
// }

// customElements.define("game-waiting-screen", WaitingScreen);

