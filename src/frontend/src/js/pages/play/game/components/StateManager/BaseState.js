import Game from "../../index.js";

export class BaseState {
    constructor(game, data = {}) {
        if (!game || !(game instanceof Game)) {
            throw new Error("[Game: BaseState] Game instance is required");
        }
        this.game = game;
		this.data = data;
    }

    enter() {
        console.log("[BaseState] Entering state...");
        // Par défaut, aucune action
    }

    exit() {
        console.log("[BaseState] Exiting state...");
        // Par défaut, aucune action
    }

    defaultHandler(eventType, data) {
        console.log(`[BaseState] Unhandled event ${eventType}`, data);
    }
}