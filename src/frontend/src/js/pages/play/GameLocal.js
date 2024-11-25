import { Component } from "../../utils/Component.js";

export class GameLocal extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			ICI LOUP FOUT LE JEU LOCAL

			<div id="gameID"></div>

		</main-layout>
		`);
	}

	script() {
		const gameId = parseInt(this.getAttribute("id"));
		document.getElementById("gameID").innerHTML = gameId;
	}
}

customElements.define("game-local-page", GameLocal);