import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'

export class ServerData {
	constructor(data) {
		this.data = this.validateData(data);
	
		this.ball = this.data.ball ?{
			x: this.data.ball.x,
			y: this.data.ball.y,
			radius: this.data.ball.radius,
			vx: this.data.ball.vx,
			vy: this.data.ball.vy,
		} : null;
		this.player_1 = this.data.player_1 ? {
			'user_id': this.data.player_1.user_id,
			'state': this.data.player_1.state,
			'score': this.data.player_1.score,
			'paddle': this.data.player_1.paddle ? {
				x: this.data.player_1.paddle.x,
				y: this.data.player_1.paddle.y,
				width: this.data.player_1.paddle.width,
				height: this.data.player_1.paddle.height,
			} : null
		} : null;
		this.player_2 = this.data.player_2 ? {
			'user_id': this.data.player_2.user_id,
			'state': this.data.player_2.state,
			'score': this.data.player_2.score,
			'paddle': this.data.player_2.paddle ? {
				x: this.data.player_2.paddle.x,
				y: this.data.player_2.paddle.y,
				width: this.data.player_2.paddle.width,
				height: this.data.player_2.paddle.height,
			} : null
		} : null;
		this.field = {
			width: this.data.field.width,
			height: this.data.field.height,
		}
	}

	static schema = zod.object({
		ball: zod.object({
			x: zod.number(),
			y: zod.number(),
			radius: zod.number(),
			vx: zod.number(),
			vy: zod.number(),
		}).nullable(),
		player_1: zod.object({
			'user_id': zod.number(),
			'state': zod.string(),
			'score': zod.number(),
			'paddle': zod.object({
				x: zod.number(),
				y: zod.number(),
				width: zod.number(),
				height: zod.number(),
			}).nullable(),
		}).nullable(),
		player_2: zod.object({
			'user_id': zod.number(),
			'state': zod.string(),
			'score': zod.number(),
			'paddle': zod.object({
				x: zod.number(),
				y: zod.number(),
				width: zod.number(),
				height: zod.number(),
			}).nullable(),
		}).nullable(),
		field: zod.object({
			width: zod.number(),
			height: zod.number(),
		}),
	});

	validateData(data) {
		return ServerData.schema.parse(data);
	}

	update(data) {
		console.log(`[Game: ServerData] Updating server data`, data);

		this.data = this.validateData(data);

		if (this.data.ball) {
			this.ball = {
				x: this.data.ball.x,
				y: this.data.ball.y,
				radius: this.data.ball.radius,
				vx: this.data.ball.vx,
				vy: this.data.ball.vy,
			};
		}

		if (this.data.player_1) {
			this.player_1 = {
				'user_id': this.data.player_1.user_id,
				'state': this.data.player_1.state,
				'score': this.data.player_1.score,
				'paddle': this.data.player_1.paddle ? {
					x: this.data.player_1.paddle.x,
					y: this.data.player_1.paddle.y,
					width: this.data.player_1.paddle.width,
					height: this.data.player_1.paddle.height,
				} : null
			};
		}

		if (this.data.player_2) {
			this.player_2 = {
				'user_id': this.data.player_2.user_id,
				'state': this.data.player_2.state,
				'score': this.data.player_2.score,
				'paddle': this.data.player_2.paddle ? {
					x: this.data.player_2.paddle.x,
					y: this.data.player_2.paddle.y,
					width: this.data.player_2.paddle.width,
					height: this.data.player_2.paddle.height,
				} : null
			};
		}
	}
}