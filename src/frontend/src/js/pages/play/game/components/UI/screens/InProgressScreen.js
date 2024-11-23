import { BaseScreen } from "./BaseScreen.js";

export class InProgressScreen extends BaseScreen {
    constructor(game, name, data = {}) {
        super(game, name, data);

        this.components = [
            
        ]
    }
    enter() {
        // create parents for components
        this.element = document.createElement("div");
        this.element.id = "in-progress-screen";
        this.game.container.appendChild(this.element);

        // add components to the screen
        this.components.forEach(component => {
            this.element.appendChild(component.element);
        });
    }

    update(data) {
		super.update(data);
	}
}
