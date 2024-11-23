export class BaseScreen {
    constructor(game, name, data = {}) {
        this.game = game;
		this.element = null;
        this.data = data;
        this.name = name;
    }

    enter() {
    }

    exit() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    update(data) {
        this.data = data;
    }
}
