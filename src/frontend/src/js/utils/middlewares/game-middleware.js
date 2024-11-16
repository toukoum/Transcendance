import { api } from "../api/Api.js";

export const gameMiddleware = async (route, next) => {
	console.log("Game Middleware");

	// Check if user is in a game
	if (window.auth) {
		const { data, error } = await api.game.onGame();
		console.log(data, error);
		if (error) console.error(`GAME MIDDLEWARE ERROR: ${error}`);
		// TODO: handle throw on middleware and show error page
		console.log(data);
		// if (data) {
		// 	console.log("User is in a game");
		// 	window.router.push(`/play/${data.id}`);
		// }

	}


	next();
}
