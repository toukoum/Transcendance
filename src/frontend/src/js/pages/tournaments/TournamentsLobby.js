import { Component } from "../../utils/Component.js";

import { api } from "../../utils/api/Api.js";

export class TournamentsLobby extends Component {
	content() {
		const gameId = parseInt(this.getAttribute("id"));
		// Redirect if not in game

		return (/*html*/`
		<main-layout>
			<div id="scene" class="h-100">Salut je suis la page Tournament lobby </div>
		</main-layout>
		`);
	}

	script() {
		console.log("Tournament script");
	}
}

customElements.define("tournaments-lobby", TournamentsLobby);