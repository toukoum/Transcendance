import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'
import Game from '../../Game.js';
import GameLocal from '../../../local/GameLocal.js';

export class ServerData {
	constructor(game) {
		if (!game ||(!(game instanceof Game) && !game instanceof GameLocal)) {
			throw new Error("[Game: ServerData] Game instance is required");
		}
		this.game = game;
		this.match = null;
		this.ball = null;
		this.player_1 = null;
		this.player_2 = null;
		this.field = null;
		this.elapsed_time = 0;


		this.subscribers = [];
	}

	static matchSchema = zod.object({
		'id': zod.number(),
		'state': zod.string(),
		'duration': zod.number(),
		'max_players': zod.number(),
		'max_score': zod.number(),
		'map': zod.string(),
		'difficulty': zod.string(),
		'tournament': zod.number().nullable(),
	});

	static userSchema = zod.object({
		'id': zod.number(),
		'username': zod.string(),
		'avatar': zod.string(),
	});

	static paddleSchema = zod.object({
		'x': zod.number(),
		'y': zod.number(),
		'width': zod.number(),
		'height': zod.number(),
	}).nullable();

	static schema = zod.object({
		ball: zod.object({
			x: zod.number(),
			y: zod.number(),
			radius: zod.number(),
			vx: zod.number(),
			vy: zod.number(),
		}).nullable(),
		player_1: zod.object({
			'user': ServerData.userSchema,
			'state': zod.string(),
			'score': zod.number(),
			'paddle': ServerData.paddleSchema,
		}).nullable(),
		player_2: zod.object({
			'user': ServerData.userSchema,
			'state': zod.string(),
			'score': zod.number(),
			'paddle': ServerData.paddleSchema,
		}).nullable(),
		field: zod.object({
			width: zod.number(),
			height: zod.number(),
		}),
		elapsed_time: zod.number(),
	});

	validateData(data) {
		return ServerData.schema.parse(data);
	}

	update(data) {
		this.validateData(data);

		if (data.match) {
			this.match = {
				id: data.match.id,
				state: data.match.state,
				duration: data.match.duration,
				max_players: data.match.max_players,
				max_score: data.match.max_score,
				map: data.match.map,
				difficulty: data.match.difficulty,
				tournament: data.match.tournament,
			};
		}

		if (data.field) {
			this.field = {
				width: data.field.width,
				height: data.field.height,
			};
		}

		if (data.ball) {
			this.ball = {
				x: data.ball.x,
				y: data.ball.y,
				radius: data.ball.radius,
				vx: data.ball.vx,
				vy: data.ball.vy,
			};
		}

		if (data.player_1) {
			this.player_1 = {
				'user': data.player_1.user,
				'state': data.player_1.state,
				'score': data.player_1.score,
				'paddle': data.player_1.paddle ? {
					x: data.player_1.paddle.x,
					y: data.player_1.paddle.y,
					width: data.player_1.paddle.width,
					height: data.player_1.paddle.height,
				} : null
			};
		}

		if (data.player_2) {
			this.player_2 = {
				'user': data.player_2.user,
				'state': data.player_2.state,
				'score': data.player_2.score,
				'paddle': data.player_2.paddle ? {
					x: data.player_2.paddle.x,
					y: data.player_2.paddle.y,
					width: data.player_2.paddle.width,
					height: data.player_2.paddle.height,
				} : null
			};
		}

		if (data.elapsed_time) {
			this.elapsed_time = data.elapsed_time;
		}

		if (this.game.scene) {
			this.game.scene.syncWithServer();

			if (this.game.controller) {
				if (!this.game.controller.player && this.player_1 && this.player_2) {
					this.game.controller.assignPlayer();
				}
			}
		}

		this.notify();
	}


	/* -------------------------------- Subscribe ------------------------------- */

	subscribe(callback) {
		if (typeof callback === "function") {
			this.subscribers.push(callback);
		}
	}

	unsubscribe(callback) {
		this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
	}

	notify() {
		for (const callback of this.subscribers) {
			callback(this);
		}
	}
}