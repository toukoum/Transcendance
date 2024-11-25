import Game from "../../Game.js";

export class State {
    constructor(game, name) {
        if (!game || !(game instanceof Game)) {
            throw new Error("[Game: BaseState] Game instance is required");
        }
        this.game = game;
        this.name = name;
    }

    enter(data = {}) {
        console.log(`[BaseState] Entering state ${this.name}`);
        this.game.ui.activateScreen(this.name, data);
    }

    exit() {
        console.log(`[BaseState] Exiting state ${this.name}`);
        this.game.ui.desactivateScreen();
    }
}