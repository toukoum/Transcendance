import GameLocal from "./GameLocal.js";

const FIELD_WIDTH = 40
const FIELD_HEIGHT = 24
const BALL_RADIUS = 1
const BALL_SPEED = 4
const BALL_MAX_SPEED = {
	'easy': 15,
	'medium': 30,
	'hard': 50
}
const BALL_ACCELERATION_FACTOR = {
	'easy': 1.1,
	'medium': 1.2,
	'hard': 1.3
}
const PADDLE_WIDTH = 1
const PADDLE_HEIGHT = 4
const PADDLE_SPEED = {
	'easy': 10,
	'medium': 12,
	'hard': 14
}
const COUNTDOWN_DURATION = 3
const TICK_RATE = 60

export class LocalRunner {
	constructor(game) {
		if (!game || !(game instanceof GameLocal)) {
			throw new Error("[Game: Local] Game instance is required");
		}
		this.game = game;
		this.difficulty = this.game.settings.difficulty || 'medium';

		this.state = "created"; // "created", "in_progress", "finished"
		this.players = [];

		this.elapsed_time = 0;
		this.ball = null;
		this.player_1 = null;
		this.player_2 = null;

		// Time
		this.start_time = null;
		this.end_time = null;
	}

	init() {
		this.createBall();
		this.createPlayer1();
		this.createPlayer2();
	}

	/* ---------------------------------- STATE --------------------------------- */

	send_state() {
		this.game.serverData.update({

		})
	}

	/* ---------------------------------- ITEMS --------------------------------- */

	createBall() {
		if (!this.ball) {
			const vx = Math.random() > 0.5 ? 1 : -1;
			this.ball = {
				x: 0,
				y: 0,
				radius: BALL_RADIUS,
				speed: BALL_SPEED,
				acceleration_factor: BALL_ACCELERATION_FACTOR[this.difficulty],
				max_speed: BALL_MAX_SPEED[this.difficulty],
				vx: vx,
				vy: Math.random() > 0.5 ? 1 : -1,
				previous_side: vx,
			}
		}
	}

	createPlayer(pseudo) {
		const player = {
			user: {
				id: 1,
				username: pseudo,
				avatar: "https://www.gravatar.com/avatar/"
			},
			state: "connected",
			score: 0,
		}
		return player;
	}

	createPlayer1(pseudo = "Player 1") {
		this.player_1 = this.createPlayer(pseudo);
		const paddle_default = {
			default_x: (-FIELD_WIDTH / 2) - (PADDLE_WIDTH / 2),
			default_y: 0,
			default_width: PADDLE_WIDTH,
			default_height: PADDLE_HEIGHT,
			default_speed: PADDLE_SPEED[this.difficulty],
			default_vy: 0,
		}
		this.player_1.paddle = {
			default_x: paddle_default.default_x,
			default_y: paddle_default.default_y,
			default_width: paddle_default.default_width,
			default_height: paddle_default.default_height,
			default_speed: paddle_default.default_speed,
			default_vy: paddle_default.default_vy,

			x: paddle_default.default_x,
			y: paddle_default.default_y,
			width: paddle_default.default_width,
			height: paddle_default.default_height,
			speed: paddle_default.default_speed,
			vy: paddle_default.default_vy,
		}
	}

	createPlayer2(pseudo = "Player 2") {
		this.player_2 = this.createPlayer(pseudo);
		const paddle_default = {
			default_x: (FIELD_WIDTH / 2) + (PADDLE_WIDTH / 2),
			default_y: 0,
			default_width: PADDLE_WIDTH,
			default_height: PADDLE_HEIGHT,
			default_speed: PADDLE_SPEED[this.difficulty],
			default_vy: 0,
		}
		this.player_2.paddle = {
			default_x: paddle_default.default_x,
			default_y: paddle_default.default_y,
			default_width: paddle_default.default_width,
			default_height: paddle_default.default_height,
			default_speed: paddle_default.default_speed,
			default_vy: paddle_default.default_vy,

			x: paddle_default.default_x,
			y: paddle_default.default_y,
			width: paddle_default.default_width,
			height: paddle_default.default_height,
			speed: paddle_default.default_speed,
			vy: paddle_default.default_vy,
		}
	}
}