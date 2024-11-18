
import { Toast } from "../../provider/toast-provider.js";

export function startNotification(){

	var wsStart = 'ws://'
	if (window.location.protocol === 'https:') {
		wsStart = 'wss://'
	}

	var endpoint = wsStart + window.location.hostname + ':8000/ws/notification/'

	const notifSocket = new WebSocket(endpoint)
	
	notifSocket.onmessage = function(e){
		const notification = JSON.parse(e.data)

		// Display Toast notification
		if (notification.data.action !== null){
			Toast.notificationAction(notification)
		}else{
			Toast.info(notification.data.data.message, notification.data.event_type)
		}
	}

	notifSocket.onerror = function(e){
		console.log('Notification socket error', e)
	}


	notifSocket.onopen = function(e){
		console.log('Notification socket opened')
	}

	notifSocket.onclose = function(e){
		console.log('Notification socket closed')
	}
}