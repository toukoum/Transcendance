import { Component } from "../../utils/Component.js";
import { socketGameManager } from "./socketGameManager.js";

export class RafPlayPage extends Component {
	constructor() {
		super("main-layout");
	}
	
	content() {
		return (/*html*/`

			<div id="game" class="w-100 border border-primary">
				Le jeu va commencer...
			</div>
		`);
	}


	script() {

		const game = document.getElementById("game");
		const socketGame = socketGameManager.getSocket();

		if (!socketGame) {
			console.error("No game socket available");
		} else {
			socketGame.onmessage = (event) => {
				const messageData = JSON.parse(event.data);
				console.log("Message from game server:", messageData);

				// Mise à jour de l'affichage des informations de jeu
				const messageDiv = document.createElement("div");
				messageDiv.innerHTML = `
					<p>Ball position - X: ${messageData.ball.x}, Y: ${messageData.ball.y}</p>
					<p>Score - Player 1: ${messageData.score.player1}, Player 2: ${messageData.score.player2}</p>
				`;

				// Efface le contenu précédent et ajoute le nouveau
				game.innerHTML = "";
				game.appendChild(messageDiv);
			};
		}
	}
}

customElements.define("raf-play-page", RafPlayPage);
