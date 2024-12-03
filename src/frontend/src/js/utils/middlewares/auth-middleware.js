import { api } from "../api/Api.js";
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
	
	const { data: user } = await api.auth.getUser();
	if (user) {
		window.auth = user;
	} else {
		window.auth = null;
	}

	if (!user && privateRoutes.some((r) => route.path.startsWith(r))) {
		window.router.redirect("/auth/login");
		return
	}

	if (user && anonRoutes.some((r) => route.path.startsWith(r))) {
		window.router.redirect("/");
		return;
	}

	if (window.auth){
		if (!window.notif) {
			window.notif = new ApiWebSocket('notification/');
			window.notif.on('message', (data) => {
				document.dispatchEvent(new Event('notification'));
				if (data.action != null){
					Toast.notificationAction(data)
				}else{
					if (data.data.message != null)
						Toast.info(data.data.message, data.event_type)
					else if (data.message != null)
						Toast.info(data.message)
				}
			});
		}
	}


	next();
}
