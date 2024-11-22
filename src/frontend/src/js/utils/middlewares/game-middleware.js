import { Toast } from "../../provider/toast-provider.js";
import { api } from "../api/Api.js";

export const gameMiddleware = async (route, next) => {
	console.log("Game Middleware");
	console.log('path', window.path);
	console.log('router', route);

	// Check if user is in a game
	if (window.auth) {
		const { data, error } = await api.game.onGame();
		if (error) return console.error(`GAME MIDDLEWARE ERROR: ${error}`);
		// TODO: handle throw on middleware and show error page
		if (data) {
			window.isInGame = data;
			console.log("User is in a game");
			if (route.path !== `/play/:id`) {
				// A REMETTRE C'est raf qui l'a enlevé
				window.router.redirect(`/play/${data.id}`);
			}
		} else {
			window.isInGame = null;
		}
		// if (data) {
		// 	console.log("User is in a game");
		// 	window.router.push(`/play/${data.id}`);
		// }

	}


	next();
}
