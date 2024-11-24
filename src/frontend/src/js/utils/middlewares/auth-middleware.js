import { api } from "../api/Api.js";
import { startNotification } from "../notification/notification.js";
// import { Route } from "../Router";
 import { Toast } from "../../provider/toast-provider.js";
import { ApiWebSocket } from "../api/ApiWebSocket.js";

const privateRoutes = [
	"/settings",
	"/play",
	"/tournament",
	"/friends",
];

const anonRoutes = [
	"/auth",
];

export const authMiddleware = async (route, next) => {

	// const notif = api.websocket.connect('notification/');
	if (!window.notif) {
		window.notif = new ApiWebSocket('notification/');
	}
	window.notif.on('message', (data) => {
		console.log("===========>> Notification", data);
		if (data.action != null){
			Toast.notificationAction(data)
		}else{
			if (data.data.message != null)
				Toast.info(data.data.message, data.event_type)
			else if (data.message != null)
				Toast.info(data.message)
		}
	});

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
		// window.router.redirect(`/auth/login?redirect=${route.path}`); TODO: Implement redirect
		window.router.redirect("/auth/login");
		return
	}

	if (user && anonRoutes.some((r) => route.path.startsWith(r))) {
		window.router.redirect("/"); // Redirect to home
		return;
	}

	next();
}
