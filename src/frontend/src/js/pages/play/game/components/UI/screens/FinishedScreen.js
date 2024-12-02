import { BaseScreen } from "./BaseScreen.js";

export class FinishedScreen extends BaseScreen {
    enter() {
        // add modals 
		this.element = document.createElement("div");
		this.element.id = "finished-screen";
		this.game.container.appendChild(this.element);

		this.element.innerHTML = (/*html*/`
			<div class="finished-screen position-absolute top-50 start-50 translate-middle p-2 border rounded bg-background w-50">
				<div class="finished-screen__content d-flex flex-column gap-2 align-items-center">
					<h3 style="font-size: 2rem;">👑 ${this.data.winner.username}</h3>
					<div class="finished-screen__scores d-flex flex-column gap-2 my-2 w-100">
						<div class="finished-screen__score d-flex justify-content-between align-items-center">
							<div class="finished-screen__score--user d-flex gap-2 align-items-center">
								<div class="player-waiting__avatar">
									<img src="${this.game.serverData.player_1.user.avatar}" alt="Avatar" class=" rounded-circle" style="width: 50px; height: 50px;">
								</div>
								<div class="player-waiting__name">
									${this.game.serverData.player_1.user.username}
								</div>
							</div>
							<div>${this.game.serverData.player_1.score}</div>
						</div>
						<div class="finished-screen__score d-flex justify-content-between align-items-center">
							<div class="finished-screen__score--user d-flex gap-2 align-items-center">
								<div class="player-waiting__avatar">
									<img src="${this.game.serverData.player_2.user.avatar}" alt="Avatar" class=" rounded-circle" style="width: 50px; height: 50px;">
								</div>
								<div class="player-waiting__name">
									${this.game.serverData.player_2.user.username}
								</div>
							</div>
							<div>${this.game.serverData.player_2.score}</div>
						</div>
					</div>
					${this.game.serverData.match.tournament ? /*html*/`
						<button onclick="(() => window.location.href='/tournaments/' + ${this.game.serverData.match.tournament})()" type="button" class="btn btn-primary">Continue Tournament</button>
					` : /*html*/`
						<link-component href="/play" type="button" class="btn btn-primary">Play Again</link-component>
					`}
				</div>
			</div>
		`);
    }
}