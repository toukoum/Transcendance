

export function startNotification(){

	var wsStart = 'ws://'
	if (window.location.protocol === 'https:') {
		wsStart = 'wss://'
	}

	var endpoint = wsStart + window.location.hostname + ':8000/ws/notification/'

	const notifSocket = new WebSocket(endpoint)
	
	notifSocket.onmessage = function(e){
		const notification = JSON.parse(e.data)

		switch(notification.type){
			case 'friendship_request':
				console.log('Friendship request from: ', notification.data.user1_username)
				console.log(notification.data)
				break
			default:
				console.log('Unknown notification type', notification)
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