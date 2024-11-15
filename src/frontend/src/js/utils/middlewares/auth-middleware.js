import { api } from "../api/Api.js";
import { startNotification } from "../notification/notification.js";
// import { Route } from "../Router";

const privateRoutes = [
	"/user/:username",
	"/settings",
];

const anonRoutes = [
	"/auth",
];

export const authMiddleware = async (route, next) => {
	console.log("Auth Middleware");
	
	const { data: user } = await api.auth.getUser();
	if (user) {
		console.log(`User is logged in as ${JSON.stringify(user)}`);
		window.auth = user;
	} else {
		console.log("User is not logged in");
		window.auth = null;
	}

	if (!user && privateRoutes.some((r) => route.path.startsWith(r))) {
		window.router.redirect("/auth/login");
		return
	}

	if (user && anonRoutes.some((r) => route.path.startsWith(r))) {
		window.router.redirect("/"); // Redirect to home
		return;
	}

	next();
}
