import { Component } from "../../../utils/Component.js";
import GameLocal from "./GameLocal.js";

export class PlayLocal extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div id="game" class="h-100 position-relative d-flex justify-content-center align-items-center">
			</div>
		</main-layout>
		`);
	}

	script() {
		const urlParams = new URLSearchParams(window.location.search);

		const duration = urlParams.get("duration") || 60;
		const maxScore = urlParams.get("maxScore") || null;
		const map = urlParams.get("map") || "default";
		const difficulty = urlParams.get("difficulty") || "medium";
		const player1 = urlParams.get("player1") || "Player 1";
		const player2 = urlParams.get("player2") || "Player 2";

		const settings = {
			camera: {
				position: {
					x: 0,
					y: 10,
					z: 10
				},
				angle: 70
			},
			container: "game",
			duration,
			maxScore,
			map,
			difficulty,
			player1,
			player2
		}
		const game = new GameLocal(settings);
		game.start();
	}
}

customElements.define("play-local-page", PlayLocal);