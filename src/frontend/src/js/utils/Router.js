/**
 * @file router.js
 * @brief Router for the frontend
 * @version 1.0
 * 
 * Router for the frontend
 */
export class Router {
	#app;
	/**
	 * @type {Route[]}
	 */
	#routes = [];
	/**
	 * @type {Function[]}
	 */
	#middlewares = [];
	/**
	 * @brief Constructor for the Router class
	 * @param {Object} app - The app object
	 * @param {Array} routes - The routes for the router
	 */
	#listeners = [];
	constructor(app, {
		routes = [],
		middlewares = []
	} = {}) {
	// constructor(app, routes = []) {
		if (Router.instance) { // Singleton
			return Router.instance;
		}
		if (!(app instanceof HTMLElement)) {
			throw new TypeError("App must be an instance of HTMLElement");
		}
		Router.instance = this;

		this.#app = app;
		this.#routes = routes;
		this.#routes.push(new Route("/7NGjdgKWmo7bQpSgdRN5ADNjAPQpJm5l1vRqzKP4lt8=", "secret-page"));
		this.#middlewares = middlewares;

		window.addEventListener("popstate", this.#handlePopState.bind(this));
	}

	/* ------------------------------- Middleware ------------------------------- */

	/**
	 * @brief Execute the middleware
	 * @param {Request} req - The request object
	 * @param {Response} res - The response object
	 * @param {Function} next - The next function
	 */
	#executeMiddlewares(route, next) {
		if (!(route instanceof Route)) {
			throw new TypeError("Route must be an instance of Route");
		}
		if (typeof next !== "function") {
			throw new TypeError("Next must be a function");
		}
	
		let index = 0;
	
		const executeNextMiddleware = () => {
			if (index < this.#middlewares.length) {
				const middleware = this.#middlewares[index];
				index++;
				middleware(route, executeNextMiddleware);
			} else {
				next();
			}
		};
	
		executeNextMiddleware();
	}

	/* -------------------------------- Handlers -------------------------------- */

	#handlePopState(event) {
		const route = this.#findMatchingRoute(document.location.pathname);
		if (!route) {
			console.error("Route not found");
			return;
		}
		this.#loadRoute(route);
	}

	/* ---------------------------------- Utils --------------------------------- */

	/**
	 * @brief find matching route
	 * @param {String} path - The path for the route
	 * @returns {Route} - The matching route
	 */
	#findMatchingRoute(path) {
		const route = this.#routes.find((route) => route.pathRegex.test(path));
		if (route) {
			Router.#setParamsValues(route, path);
		}
		// Return the route or the default route (empty path)
		return route || this.#routes.find((route) => route.path === "");
	}

	/**
	 * @brief Set the values for the parameters
	 * @param {Route} route - The route to set the values for
	 * @param {String} path - The path to set the values for
	 */
	static #setParamsValues(route, path) {
		if (!(route instanceof Route)) {
			throw new TypeError("Route must be an instance of Route");
		}
		if (typeof path !== "string") {
			throw new TypeError("Path must be a string");
		}

		const values = path.match(route.pathRegex);
		if (values) {
			values.shift();
			route.params.forEach((param, index) => {
				Router.#setParamValue(route, param.name, values[index]);
			});
		}
	}

	/**
	 * @brief Set the value for a given parameter
	 * @param {Route} route - The route to set the value for
	 * @param {String} id - The id to set the value for
	 * @param {String} value - The value to set
	 * 
	 */
	static #setParamValue(route, id, value) {
		if (!(route instanceof Route)) {
			throw new TypeError("Route must be an instance of Route");
		}
		if (typeof id !== "string") {
			throw new TypeError("Id must be a string");
		}
		if (typeof value !== "string") {
			throw new TypeError("Value must be a string");
		}

		const param = route.params.find((param) => param.name === id);
		if (param) {
			param.value = value;
		}
	}

	/**
	 * @brief Set the parameters for the component
	 * @param {HTMLElement} component - The component to set the parameters for
	 * @param {Route} route - The route to set the parameters for
	 */
	static #setParams(component, route) {
		if (!(component instanceof HTMLElement)) {
			throw new TypeError("Component must be an instance of HTMLElement");
		}
		if (!(route instanceof Route)) {
			throw new TypeError("Route must be an instance of Route");
		}

		route.params.forEach((param) => {
			component.setAttribute(param.name, param.value);
		});
	}


	/**
	 * @brief Load the route
	 * @param {Route} route - The route to load
	 */
	#loadRoute(route) {
		if (!route) {
			console.error("Route not defined");
			return;
		}
		if (!(route instanceof Route)) {
			throw new TypeError("Route must be an instance of Route");
		}
		// Clean up listeners
		this.cleanupListeners();
		const component = document.createElement(route.component);
		Router.#setParams(component, route);
		this.#app.innerHTML = "";
		this.#app.appendChild(component);
		return component;
	}

	/* -------------------------------- Methods -------------------------------- */

	init() {
		const path = window.location.pathname;
		const route = this.#findMatchingRoute(path);
		if (!route) {
			console.error("Route not found");
			return;
		}

		// Run middlewares
		this.#executeMiddlewares(route, () => {
			window.history.replaceState({}, "", path + window.location.search);
			this.#loadRoute(route);
		});
	}

	/**
	 * @brief Navigate to a path
	 * @param {String} path - The path to navigate to
	 */
	push(path) {
		const [pathRaw] = path.split("?");
		const route = this.#findMatchingRoute(pathRaw);
		if (!route) {
			console.error("Route not found");
			return;
		}
		if (window.location.pathname === path) {
			return;
		}

		// Run middlewares
		this.#executeMiddlewares(route, () => {
			if (window.location.pathname !== path) {
				window.history.pushState({}, "", path);
			}
			this.#loadRoute(route);
		});
	}

	redirect(path) {
		const [pathRaw] = path.split("?");
		const route = this.#findMatchingRoute(pathRaw);
		if (!route) {
			console.error("Route not found");
			return;
		}
		if (window.location.pathname === path) {
			return;
		}

		// Run middlewares
		this.#executeMiddlewares(route, () => {
			this.#loadRoute(route);
			window.location.pathname = path;
		});
	}

	/**
	 * @brief Add a route to the router
	 * @param {String} path - The path for the route
	 * @param {String} component - The component for the route
	 */
	addRoute(path, component) {
		if (typeof path !== "string") {
			throw new TypeError("Path must be a string");
		}
		if (typeof component !== "string") {
			throw new TypeError("Component must be a string");
		}

		this.#routes.push(new Route(path, component));
	}

	/* -------------------------------- Listeners ------------------------------- */
	addListener(target, event, handler, persistRoute = false) {
		if (!(target instanceof EventTarget)) {
			throw new TypeError("Target must be an EventTarget");
		}
	
		const exists = this.#listeners.some(
			(listener) => listener.target === target &&
						  listener.event === event &&
						  listener.handler === handler
		);
		if (!exists) {
			target.addEventListener(event, handler);
			this.#listeners.push({ target, event, handler, persistRoute });
		}
	}

	cleanupListeners(force = false) {
		this.#listeners = this.#listeners.filter(({ target, event, handler, persistRoute }) => {
			if (force || !persistRoute) {
				target.removeEventListener(event, handler);
				return false;
			}
			return true;
		});
	}

	removeListener(target, event, handler) {
		this.#listeners = this.#listeners.filter((listener) => {
			if (listener.target === target && listener.event === event && listener.handler === handler) {
				target.removeEventListener(event, handler);
				return false;
			}
			return true;
		});
	}
}


export class Route {
	/**
	 * @brief Constructor for the Route class
	 * @param {String} path - The path for the route
	 * @param {String} component - The component for the route
	 */
	constructor(path, component) {
		// Check if path is a string
		if (typeof path !== "string") {
			throw new TypeError("Path must be a string");
		}
		// Check if component is a string
		if (typeof component !== "string") {
			throw new TypeError("Component must be a string");
		}

		this.path = path;
		this.component = component;
		/**
		 * @type {Object[]}
		 * @property {String} name - The name of the parameter
		 * @property {String} value - The value of the parameter
		 * @example
		 * [
		 * 	{
		 * 		name: "id",
		 * 		value: "1"
		 * 	}
		 * ]
		 */
		this.params = [];
		this.pathRegex = null;

		this.#parseParams();
		this.#createPathRegex();
	}

	/**
	 * @brief Parse the parameters for the route
	 */
	#parseParams() {
		const match = this.path.match(/:\w+/g);
		if (match) {
			this.params = match.map((param) => {
				return {
					name: param.substring(1),
					value: null
				};
			});
		}
	}

	/**
	 * @brief Create a regex for the path
	 */
	// #createPathRegex() {
	// 	this.pathRegex = new RegExp(`^${this.path.replace(/:\w+/g, "([\\w-]+)")}/?$`);
	// }
	// #createPathRegex() {
	// 	this.pathRegex = new RegExp(`^${this.path.replace(/:\w+/g, "(\\w+)")}$`);
	// }
	#createPathRegex() {
		// Remplacer les paramètres de route :param par des groupes de capture, et ajouter la gestion du slash optionnel à la fin
		this.pathRegex = new RegExp(`^${this.path.replace(/:\w+/g, "(\\w+)")}/?$`);
	}
}

export function getRouter() {
	return Router.instance;
}