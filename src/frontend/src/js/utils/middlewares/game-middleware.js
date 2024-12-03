import { Toast } from "../../provider/toast-provider.js";
import { api } from "../api/Api.js";

export const gameMiddleware = async (route, next) => {
	if (window.auth) {
		const { data, error } = await api.game.onGame();
		if (error) return console.error(error);
		if (data) {
			window.isInGame = data;
			if (route.path !== `/play/:id`) {
				window.router.redirect(`/play/${data.id}`);
			}
		} else {
			window.isInGame = null;
		}
	}
	
	next();
}
