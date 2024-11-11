import { Router, Route } from "./utils/Router.js";

import "./provider/index.js";
import "./pages/index.js";
import "./components/index.js";
import "./layout/index.js";
import {
	authMiddleware,
	localeMiddleware
} from "./utils/middlewares/index.js";

export class App {
	#app;
	#router;
	constructor() {
		this.#app = document.getElementById("app");
		this.#router = new Router(this.#app, {
			routes: [
				new Route("/", "home-page"),
				new Route("/search", "search-page"),
				// Auth
				new Route("/auth/login", "auth-login-page"),
				new Route("/auth/signup", "auth-signup-page"),
				// User
				new Route("/user/:username", "user-page"),
				// Play
				new Route("/play", "play-page"),
				// Settings
				new Route("/settings", "settings-profile-page"),
				new Route("/settings/profile", "settings-profile-page"),
				new Route("/settings/security", "settings-security-page"),
				// 404
				new Route("", "not-found-page"),
			],
			// Order matters: the first middleware will be executed first
			middlewares: [
				localeMiddleware,
				authMiddleware,
			],
		});
		window.router = this.#router;
		document.title = "Transcendence";
		this.#router.init();
	}
}

const app = new App();