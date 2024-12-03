export class ApiWebSocket {
	constructor(endpoint) {
		if (!endpoint) {
			throw new Error("Invalid endpoint");
		}
		this.baseUrl = "wss://10.32.8.13:3000/ws/ws";
		this.socket = null;
		this.listeners = {};
		this.isConnected = false;
		this.connect(endpoint);
	}

	/**
	 * @brief Connect to the websocket
	 */
	connect(endpoint) {
		if (!endpoint) {
			throw new Error("WebSocket endpoint is required");
		}
		this.socket = new WebSocket(`${this.baseUrl}/${endpoint}`);
		this.socket.onopen = () => {
			// console.log(`WebSocket connected to ${this.baseUrl}/${endpoint}`);
			this.isConnected = true;
			this.emit("open");
		}
		this.socket.onmessage = (event) => {
			this.emit("message", JSON.parse(event.data));
		}
		this.socket.onclose = () => {
			this.isConnected = false;
			this.emit("close");
		}
		this.socket.onerror = (error) => {
			this.emit("error", error);
		}
	}

	/**
	 * @brief Emit an event
	 */
	emit(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(listener => listener(data));
		}
	}

	/**
	 * @brief Add a listener
	 */
	on(event, listener) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	}

	/**
	 * @brief Send a message
	 */
	send(data) {
		if (!this.isConnected) {
			throw new Error("WebSocket is not connected");
		}
		this.socket.send(JSON.stringify(data));
	}

	/**
	 * @brief Close the connection
	 */
	close() {
		if (this.isConnected) {
			this.socket.close();
		}
	}

	/**
	 * @brief Get the connection state
	 */
	get connected() {
		return this.isConnected;
	}
	
}