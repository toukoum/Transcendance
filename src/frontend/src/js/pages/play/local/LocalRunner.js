import { Ball } from "./_components/Ball.js";
import { Player } from "./_components/Player.js";
import { Paddle } from "./_components/Paddle.js";
import GameLocal from "./GameLocal.js";

export const FIELD_WIDTH = 40
export const FIELD_HEIGHT = 18
export const BALL_RADIUS = 1
export const BALL_SPEED = 10
export const BALL_MAX_SPEED = {
	'easy': 15,
	'medium': 30,
	'hard': 40
}
export const BALL_ACCELERATION_FACTOR = {
	'easy': 1.025,
	'medium': 1.05,
	'hard': 1.1
}
export const PADDLE_WIDTH = 1
export const PADDLE_HEIGHT = 4
export const PADDLE_SPEED = {
	'easy': 14,
	'medium': 16,
	'hard': 20
}
export const COUNTDOWN_DURATION = 3
export const TICK_RATE = 60

export class LocalRunner {
	constructor(game) {
		if (!game || !(game instanceof GameLocal)) {
			throw new Error("[Game: Local] Game instance is required");
		}
		this.game = game;
		this.isRunning = false;

		this.match = {
			id: null,
			state: "created",
			duration: this.game.settings.duration,
			maxScore: this.game.settings.maxScore || null,
			difficulty: this.game.settings.difficulty || 'medium',
			map: this.game.settings.map,
			started_at: null,
		}
	
		this.players = [];

		this.elapsed_time = 0;
		this.ball = null;
		this.player_1 = null;
		this.player_2 = null;

		// Time
		this.start_time = null;
		this.end_time = null;

		this.isInitialized = false;
	}

	init() {
		if (this.isInitialized) {
			console.error("[Game: Local] Game is already initialized");
			return;
		}
		this.ball = new Ball(BALL_ACCELERATION_FACTOR[this.match.difficulty], this.match.difficulty == 'hard' ? BALL_MAX_SPEED.hard : this.match.difficulty == 'easy' ? BALL_MAX_SPEED.easy : BALL_MAX_SPEED.medium);
		this.player_1 = new Player(this.game.settings.player1);
		this.player_2 = new Player(this.game.settings.player2);
		this.player_1.paddle = new Paddle((-FIELD_WIDTH / 2) - (PADDLE_WIDTH / 2), 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED[this.match.difficulty]);
		this.player_2.paddle = new Paddle((FIELD_WIDTH / 2) + (PADDLE_WIDTH / 2), 0, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED[this.match.difficulty]);
		this.isInitialized = true;
		this.send_state();
	}

	start() {
		this.init();

		this.match.started_at = new Date();
		this.update_state("in_progress");

		this.run();
	}

	async run() {
		this.isRunning = true;
		while (!this.isGameOver()) {
			this.ball.reset();
			this.player_1.paddle.reset();
			this.player_2.paddle.reset();


			const round_winner = await this.playRound();
			if (!this.isRunning) {
				return;
			}
			if (!round_winner) {
				break;
			}

			round_winner.score_point();
			this.send_state({
				round_winner: round_winner.to_json(),
			});
			await this.sleep(2);
		}

		this.winner = this.player_1.player.score > this.player_2.player.score ? this.player_1.player.user : this.player_2.player.user;
		await this.end();
	}

	async playRound() {
		const countdow_end = this.getTime() + COUNTDOWN_DURATION;
		let winner = null;

		const tick_duration = 1 / TICK_RATE;
		let next_tick_time = this.getTime() + tick_duration;

		let last_time = this.getTime();

		while (!winner) {
			if (!this.isRunning) {
				return null;
			}
			if (this.isGameOver()) {
				return null;
			}
			const current_time = this.getTime();
			const delta_time = current_time - last_time;
			last_time = current_time;

			const countdown_left = countdow_end - current_time;
			const is_countdown = countdown_left > 0;

			this.player_1.paddle.move(delta_time);
			this.player_2.paddle.move(delta_time);

			if (!is_countdown) {
				this.elapsed_time += delta_time;
				this.ball.move(delta_time);
				this.ball.check_collision_with_wall();
				this.ball.check_collision_with_paddle(this.player_1.paddle);
				this.ball.check_collision_with_paddle(this.player_2.paddle);
				if (this.ball.is_out_of_field()) {
					winner = this.ball.x < 0 ? this.player_2 : this.player_1;
				}
			}

			this.send_state(is_countdown ? { countdown: countdown_left } : null);
	
			next_tick_time += tick_duration;
			const sleep_time = Math.max(0, next_tick_time - this.getTime());
			await this.sleep(sleep_time);
		}

		return winner;
	}

	async end() {
		this.match.finished_at = new Date();
		this.update_state("finished", {
			winner: this.winner,
		});
	}


	/* ---------------------------------- STATE --------------------------------- */

	send_state(data = null) {
		this.game.serverData.update(this.to_json());

		this.game.ui.activateScreen(this.match.state, data);
	}

	update_state(state, data = null) {
		this.match.state = state;
		this.send_state(data);
	}


	to_json() {
		return {
			match: {
				id: null,
				state: this.match.state,
				duration: this.game.settings.duration,
				maxScore: this.game.settings.maxScore,
				map: this.game.settings.map,
			},
			player_1: this.player_1.to_json(),
			player_2: this.player_2.to_json(),
			ball: this.ball,
			field: {
				width: FIELD_WIDTH,
				height: FIELD_HEIGHT,
			},
			elapsed_time: this.elapsed_time,
		}
	}

	/* ------------------------------- Conditions ------------------------------- */

	isGameOver() {
		if (this.match.state == "finished" || this.match.state == "cancelled") {
			return true;
		}
		if (this.match.maxScore) {
			if (this.player_1.player.score >= this.match.maxScore || this.player_2.player.score >= this.match.maxScore) {
				return true;
			}
		}
		if (this.match.duration && this.elapsed_time >= this.match.duration) {
			if (this.player_1.player.score != this.player_2.player.score) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	/* ---------------------------------- Utils --------------------------------- */

	sleep(seconds) {
		return new Promise(resolve => setTimeout(resolve, seconds * 1000));
	}

	getTime() {
		return new Date().getTime() / 1000;
	}

	stop() {
		this.isRunning = false;
		// Stop the game
	}
}