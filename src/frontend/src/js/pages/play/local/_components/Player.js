export class Player {
	constructor(pseudo) {
		this.player = {
			user: {
				id: Math.floor(Math.random() * 1000),
				username: pseudo,
				email: null,
				avatar: 'https://10.32.8.13:3000/media/avatars/defaultPicture.jpg'
			},
			state: "connected",
			score: 0,
		}
		this.paddle = null;
	}

	score_point() {
		this.player.score++;
	}

	to_json() {
		return {
			user: this.player.user,
			state: this.player.state,
			score: this.player.score,
			paddle: this.paddle ? this.paddle.to_json() : null,
		}
	}
}