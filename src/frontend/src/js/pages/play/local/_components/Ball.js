import { BALL_ACCELERATION_FACTOR, BALL_RADIUS, BALL_SPEED, FIELD_HEIGHT, FIELD_WIDTH } from "../LocalRunner.js";
import { Paddle } from "./Paddle.js";

export class Ball {
	constructor(acceleration_factor = BALL_ACCELERATION_FACTOR.medium, max_speed = BALL_SPEED) {
		this.x = 0;
		this.y = 0;
		this.radius = BALL_RADIUS;
		this.speed = BALL_SPEED;
		this.acceleration_factor = acceleration_factor;
		this.max_speed = max_speed;
		this.vx = Math.random() > 0.5 ? 1 : -1;
		this.vy = this.generate_vy();

		this.previous_side = this.vx;
	}

	move(delta_time) {
		this.x += this.vx * this.speed * delta_time;
		this.y += this.vy * this.speed * delta_time;
	}

	reset() {
		this.x = 0;
		this.y = 0;
		this.speed = BALL_SPEED;
		this.vy = this.generate_vy();
		this.previous_side = -this.previous_side;
		this.vx = this.previous_side;
	}

	/* -------------------------------- Collision ------------------------------- */

	check_collision_with_wall() {
		if (-FIELD_WIDTH / 2 <= this.x <= FIELD_WIDTH / 2) {
			if (this.y + this.radius >= FIELD_HEIGHT / 2) {
				this.vy = -Math.abs(this.vy);
			} else if (this.y - this.radius <= -FIELD_HEIGHT / 2) {
				this.vy = Math.abs(this.vy);
			}
		}
	}

	check_collision_with_paddle(paddle) {
		if (!paddle || !(paddle instanceof Paddle)) {
			console.warn("[Ball] Invalid paddle instance");
			return;
		}
		const paddle_top = paddle.y + paddle.height / 2;
		const paddle_bottom = paddle.y - paddle.height / 2;
		const paddle_left = paddle.x - paddle.width / 2;
		const paddle_right = paddle.x + paddle.width / 2;

		if (this.x + this.radius >= paddle_left && this.x - this.radius <= paddle_right && this.y + this.radius >= paddle_bottom && this.y - this.radius <= paddle_top) {
			if (this.x < paddle_left) {
				this.x = paddle_left - this.radius;
				this.vx = -Math.abs(this.vx);
			} else if (this.x > paddle_right) {
				this.x = paddle_right + this.radius;
				this.vx = Math.abs(this.vx);
			}

			if (this.y < paddle_bottom) {
				this.y = paddle_bottom - this.radius;
				this.vy = -Math.abs(this.vy);
			} else if (this.y > paddle_top) {
				this.y = paddle_top + this.radius;
				this.vy = Math.abs(this.vy);
			}

			this.speed *= this.acceleration_factor;
			this.speed = Math.min(this.speed, this.max_speed);
		}
	}

	is_out_of_field() {
		return this.x + this.radius < -FIELD_WIDTH / 2 || this.x - this.radius > FIELD_WIDTH / 2;
	}

	generate_vy() {
		return Math.random() < 0.5 
    		? Math.random() * 0.5 + 0.5
    		: Math.random() * -0.5 - 0.5;
	}
}