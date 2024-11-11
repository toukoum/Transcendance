import { api } from "../api/Api.js";
import { startNotification } from "../notification/notification.js";
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
	
	const { data: user } = await api.auth.getUser();
	if (user) {
		console.log("User is logged in");
		startNotification();
		window.user = user;
	} else {
		console.log("User is not logged in");
		window.user = null;
	}

	if (!user && privateRoutes.includes(route.path)) {
		window.router.redirect("/auth/login");
		return
	}
	if (user && anonRoutes.includes(route.path)) {
		window.router.redirect("/");
		return
	}

	next();
}
