import Game from "../index.js";

export class Controller {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
			throw new Error('Invalid game instance');
		}

		this.game = game;

		// this.keys = {
		// 	ArrowUp: false,
		// 	ArrowDown: false,
		// 	ArrowLeft: false,
		// 	ArrowRight: false,
		// };
		this.direction = {
			up: false,
			down: false,
			left: false,
			right: false,
		};

		this.player = null;

		this.init();
	}

	init() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	assignPlayer() {
		if (!window.auth) {
			return console.warn('No auth');
		}

		if (window.auth.id == this.game.scene.player_1.user_id) {
			this.player = this.game.scene.player_1;
		} else if (window.auth.id == this.game.scene.player_2.user_id) {
			this.player = this.game.scene.player_2;
		}
	}

	onKeyDown(event) {
		// if (event.key in this.keys) {
		// 	this.keys[event.key] = true;
		// 	console.log('Key down', this.keys);
		// 	this.sendMovement();
		// }
		if (event.key == 'ArrowUp') {
			this.direction.up = true;
		} else if (event.key == 'ArrowDown') {
			this.direction.down = true;
		} else if (event.key == 'ArrowLeft') {
			this.direction.left = true;
		} else if (event.key == 'ArrowRight') {
			this.direction.right = true;
		}
		this.sendMovement();
	}

	onKeyUp(event) {
		// if (event.key in this.keys) {
		// 	this.keys[event.key] = false;
		// 	this.sendMovement();
		// }
		if (event.key == 'ArrowUp') {
			this.direction.up = false;
		} else if (event.key == 'ArrowDown') {
			this.direction.down = false;
		} else if (event.key == 'ArrowLeft') {
			this.direction.left = false;
		} else if (event.key == 'ArrowRight') {
			this.direction.right = false;
		}
		this.sendMovement();
	}

	sendMovement() {
		if (this.player) {
			// this.game.client.sendMovement(this.keys);
			this.game.client.ws.send({
				type: 'paddle.move',
				direction: this.direction,
			});
		}
		// if (this.player) {
		// 	this.game.client.sendMovement(this.keys);
		// }
	}
}