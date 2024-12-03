import { Component } from "../../../utils/Component.js";
import GameLocal from "./GameLocal.js";

export class PlayLocal extends Component {
	content() {
		this.classList.add("h-100");
		return (/*html*/`
		<main-layout>
			<div id="game" class="position-relative d-flex justify-content-center align-items-center">
			</div>
		</main-layout>
		`);
	}

	script() {
		const header = document.querySelector("header");
		const gameContainer = document.getElementById("game");
		const headerHeight = header ? header.offsetHeight : 0;
		gameContainer.style.height = `${window.innerHeight - headerHeight}px`;

		window.router.addListener(window, "resize", () => {
			const newAvailableHeight = window.innerHeight - (header ? header.offsetHeight : 0);
			gameContainer.style.height = `${newAvailableHeight}px`;
		});

		const urlParams = new URLSearchParams(window.location.search);

		let duration = parseInt(urlParams.get("duration") || 60);
		if (duration < 0) duration = 60;
		const maxScore = parseInt(urlParams.get("maxScore")) || null;
		if (maxScore < 0) maxScore = null;
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
		window.game = new GameLocal(settings);
		window.game.start();
	}

	disconnectedCallback() {
		if (window.game) {
			window.game.stop();
			window.game = null;
		}
		super.disconnectedCallback();
	}
}

customElements.define("play-local-page", PlayLocal);