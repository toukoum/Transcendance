export class NetworkStatusComponent {
    constructor(container) {
        this.container = container;
        this.element = null;
    }

    init() {
        this.element = document.createElement("div");
        this.element.id = "network-status-display";
        this.element.classList.add("network-status", "position-absolute", "bottom-0", "start-0", "p-2");

        this.element.innerHTML = /*html*/ `
            <span class="me-2">Ping: </span>
            <span id="network-status-ping">NaN</span>
        `;
        this.container.appendChild(this.element);
    }

    show() {
        if (!this.element) this.init();
    }

    update(data) {
        if (!this.element) this.init();
        const pingElement = this.element.querySelector("#network-status-ping");
        pingElement.textContent = `${data.ping.toFixed(1)} ms`;
        if (data.ping < 50) {
            pingElement.style.color = "#30D158";
        } else if (data.ping < 100) {
            pingElement.style.color = "#FFD60A";
        } else {
            pingElement.style.color = "#FF453A";
        }
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
