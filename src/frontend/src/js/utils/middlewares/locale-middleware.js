// import { Route } from "../Router";

export const localeMiddleware = (route, next) => {
	// if (!(route instanceof Route)) {
	// 	throw new TypeError("Route must be an instance of Route");
	// }
	console.log("Locale Middleware");
	next();
}