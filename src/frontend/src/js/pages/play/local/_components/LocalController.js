import GameLocal from "../GameLocal.js";

export class LocalController {
	constructor(game) {
		if (!game || !(game instanceof GameLocal)) {
			throw new Error('Invalid game instance');
		}

		this.game = game;

		this.player_1 = {
			up: false,
			down: false
		}

		this.player_2 = {
			up: false,
			down: false
		}

		this.init();
	}

	init() {
		window.router.addListener(document, 'keydown', this.onKeyDown.bind(this));
		window.router.addListener(document, 'keyup', this.onKeyUp.bind(this));
	}

	assignPlayer() {
	}

	onKeyDown(event) {
		if (event.key == 'ArrowUp') {
			this.player_2.up = true;
		} else if (event.key == 'ArrowDown') {
			this.player_2.down = true;
		} else if (event.key == 'w') {
			this.player_1.up = true;
		} else if (event.key == 's') {
			this.player_1.down = true;
		}
		this.sendMovement();
	}

	onKeyUp(event) {
		if (event.key == 'ArrowUp') {
			this.player_2.up = false;
		} else if (event.key == 'ArrowDown') {
			this.player_2.down = false;
		} else if (event.key == 'w') {
			this.player_1.up = false;
		} else if (event.key == 's') {
			this.player_1.down = false;
		}
		this.sendMovement();
	}

	sendMovement() {
		this.game.localRunner.player_1.paddle.moveUp(this.player_1.up);
		this.game.localRunner.player_1.paddle.moveDown(this.player_1.down);
		this.game.localRunner.player_2.paddle.moveUp(this.player_2.up);
		this.game.localRunner.player_2.paddle.moveDown(this.player_2.down);
	}
}