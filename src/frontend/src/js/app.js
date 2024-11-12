import { Router, Route } from "./utils/Router.js";

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

				// raf test
				new Route("/raf", "raf-test-page"),
				new Route("/raf/play", "raf-play-page"),
				new Route("/raf/notif", "raf-notif-page"),
				
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