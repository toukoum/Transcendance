import Game from "../../../Game.js";

export class LeaveButton {
	constructor(game) {
		if (!game || !(game instanceof Game)) {
			throw new Error("[Game: UI] Game instance is required");
		}

		this.game = game;
		this.element = null;

		this.render();
	}

	render() {
		this.element = document.createElement("button");
		this.element.classList.add("leave-button");
		
		this.element.classList.add("btn", "btn-danger", "position-absolute", "top-0", "end-0", "m-2");
		this.element.textContent = "Leave game";
		this.element.addEventListener("click", () => {
			this.game.client.leave();
		});

		this.game.container.appendChild(this.element);
	}

	destroy() {
		if (this.element) {
			this.element.remove();
		}
	}
}