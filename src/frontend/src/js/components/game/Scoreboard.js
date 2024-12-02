import { Component } from "../../utils/Component.js";
export class Scoreboard extends Component {
	content() {
		return (/*html*/`
		<div class="scoreboard position-absolute top-0 m-2 start-50 translate-middle-x d-flex flex-column justify-content-center align-items-center">
			<div class="scoreboard__content d-flex border gap-2">
				<div id="scoreboard__player_1" class="scoreboard__team scoreboard__team_home">Player 1</div>
				<div class="scoreboard__score"><span id="scoreboard__score_player1">1</span> - <span id="scoreboard__score_player2">1</span></div>
				<div id="scoreboard__player_2" class="scoreboard__team scoreboard__team_away">Player 2</div>
			</div>
			<div class="scoreboard__timer">
				<span id="scoreboard__timer_value"></span>
			</div>
		</div>
		`);
	}
	

	style() {
		return (/*html*/`
		<style>
			.scoreboard__content {
				background-color: #7d7e80;
				border-radius: 0.5rem;
				overflow: hidden;
			}
			.scoreboard__team {
				padding: 0.5rem 1rem;
			}
			.scoreboard__team_home {
				background-color: #007bff;
				color: #fff;
			}
			.scoreboard__team_away {
				background-color: #dc3545;
				color: #fff;
			}
			.scoreboard__score {
				padding: 0.5rem 1rem;
				background-color: #f8f9fa;
				color: #000;
			}
		</style>
		`);
	}
}

customElements.define("game-scoreboard-component", Scoreboard);
