import { FIELD_HEIGHT } from "../LocalRunner.js";

export class Paddle {
	constructor(x, y, width, height, speed) {
		this.default_x = x;
		this.default_y = y;
		this.default_width = width;
		this.default_height = height;
		this.default_speed = speed;
		this.default_vy = 0;

		this.x = this.default_x;
		this.y = this.default_y;
		this.width = this.default_width;
		this.height = this.default_height;
		this.speed = this.default_speed;
		this.vy = this.default_vy;
	}

	move(dt) {
		this.y += this.vy * dt;

		if (this.y - this.height / 2 < -FIELD_HEIGHT / 2) {
			this.y = -FIELD_HEIGHT / 2 + this.height / 2;
		} else if (this.y + this.height / 2 > FIELD_HEIGHT / 2) {
			this.y = FIELD_HEIGHT / 2 - this.height / 2;
		}
	}

	moveUp(is_pressed) {
		if (is_pressed) {
			this.vy = -this.speed;
		} else {
			this.vy = this.vy < 0 ? 0 : this.vy;
		}
	}

	moveDown(is_pressed) {
		if (is_pressed) {
			this.vy = this.speed;
		} else {
			this.vy = this.vy > 0 ? 0 : this.vy;
		}
	}

	reset() {
		this.x = this.default_x;
		this.y = this.default_y;
		this.width = this.default_width;
		this.height = this.default_height;
		this.speed = this.default_speed;
		this.vy = this.default_vy;
	}

	to_json() {
		return {
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height,
			vy: this.vy,
		};
	}
}