import { Component } from "../../../utils/Component.js";
import GameTHREE from "./Game.js";

export class Game extends Component {
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
		window.addEventListener("resize", () => {
			const newAvailableHeight = window.innerHeight - (header ? header.offsetHeight : 0);
			gameContainer.style.height = `${newAvailableHeight}px`;
		});

		const gameId = parseInt(this.getAttribute("id"));
		let game = window.isInGame;
		if (!game || game.id !== gameId) {
			window.router.redirect("/play");
		}
		const settings = {
			gameId: gameId,
			camera: {
				position: {
					x: 0,
					y: 10,
					z: 10
				},
				angle: 70
			},
			container: "game",
			player_id: window.auth.id
		}

		window.game = new GameTHREE(settings);
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

customElements.define("play-game-page", Game);