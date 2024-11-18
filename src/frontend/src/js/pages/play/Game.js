import { Component } from "../../utils/Component.js";
import GameTHREE from "./game/index.js";

import { api } from "../../utils/api/Api.js";

export class Game extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div id="game" class="h-100 position-relative">
			</div>
		</main-layout>
		`);
	}

	script() {
		const gameId = parseInt(this.getAttribute("id"));
		let game = window.isInGame;
		if (!game || game.id !== gameId) {
			window.router.redirect("/play");
		}
		const settings = {
			gameId: gameId,
			camera: {
				x: 0,
				y: 10,
				z: 10
			},
			container: "game",
			player_id: window.auth.id
		}

		const gameThree = new GameTHREE(settings);
		gameThree.start();
	}
}

customElements.define("play-game-page", Game);