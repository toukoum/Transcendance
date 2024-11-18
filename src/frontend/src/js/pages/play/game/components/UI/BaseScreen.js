export class BaseScreen {
    constructor(game, data = {}) {
        this.game = game;
        this.data = data;
		this.element = null;
    }

    enter() {
        console.log("[BaseScreen] Entering screen");
    }

    exit() {
        console.log("[BaseScreen] Exiting screen");
    }
}
