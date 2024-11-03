// import { api } from "../api/Api";
// import { Route } from "../Router";

const privateRoutes = [
	"/user/:username",
];

const anonRoutes = [
	"/auth/login",
	"/auth/signup",
];

export const authMiddleware = async (route, next) => {
	console.log("Auth Middleware");

	const isLogged = false;

	if (!isLogged && privateRoutes.includes(route.path)) {
		window.router.redirect("/auth/login");
		return
	}
	if (isLogged && anonRoutes.includes(route.path)) {
		window.router.redirect("/");
		return
	}

	next();
}
