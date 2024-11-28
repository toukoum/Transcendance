export class ScoreboardComponent {
    constructor(container) {
        this.container = container;
        this.element = null;
    }

    init() {
        this.element = document.createElement("game-scoreboard-component");
        this.element.id = "game-scoreboard";
        this.game.container.appendChild(this.element);
        this.element = document.querySelector('#game-scoreboard');
    }

    show() {
        if (!this.element) this.init();
    }

    update(data) {
        console.log('ScoreboardComponent.update', data);
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
