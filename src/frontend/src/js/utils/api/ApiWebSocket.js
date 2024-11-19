import { Api } from "./Api.js";

export class ApiWebSocket {
	constructor(api, baseUrl) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		if (!baseUrl) {
			throw new Error("Invalid baseUrl");
		}

		this.api = api;
		this.baseUrl = baseUrl;
		this.socket = null;
		this.listeners = {};
		this.isConnected = false;
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
			console.log(`WebSocket connected to ${this.baseUrl}/${endpoint}`);
			this.isConnected = true;
			this.emit("open");
		}
		this.socket.onmessage = (event) => {
			console.log(`WebSocket message`, event.data);
			this.emit("message", JSON.parse(event.data));
		}
		this.socket.onclose = () => {
			console.log(`WebSocket closed`);
			this.isConnected = false;
			this.emit("close");
		}
		this.socket.onerror = (error) => {
			console.error(`WebSocket error`, error);
			this.emit("error", error);
		}

		return this;
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
	isConnected() {
		return this.isConnected;
	}
	
}