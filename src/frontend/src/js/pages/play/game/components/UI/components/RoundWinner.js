export class RoundWinnerComponent {
    constructor(container) {
        this.container = container;
        this.element = null;
    }

    init() {
        this.element = document.createElement("div");
        this.element.id = "round-winner-display";
        this.element.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "user-select-none");
        this.element.style.fontSize = "3rem";
        this.element.style.color = "#fff";
        this.element.style.textAlign = "center";
        this.element.style.fontWeight = "bold";
        this.element.style.opacity = "0";

        this.container.appendChild(this.element);
    }

    show(winner) {
        if (!this.element) this.init();

        this.element.innerHTML = `
            <span style="display: block; font-size: 2rem;">${winner.user.username} a marqué</span>
            <span style="font-size: 5rem; font-weight: bold;">GOAL!</span>
        `;

        this.animate();
    }

    animate() {
        if (!this.element) return;

        this.element.style.opacity = "0";
        const animation = this.element.animate(
			[
				{ opacity: "0", transform: "scale(0.8)" }, // Début très petit
				{ opacity: "1", transform: "scale(2)", offset: 0.1 }, // Grandit très rapidement
				{ opacity: "1", transform: "scale(1.3)", offset: 0.6 }, // Ralentit et garde la taille
				{ opacity: "0", transform: "scale(1.5)" } // Fin lente et grande
			],
			{
				duration: 4000, // 4 secondes
				easing: "ease-in-out", // Transition douce
				fill: "forwards"
			}
		);
		animation.onfinish = () => this.remove();
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
