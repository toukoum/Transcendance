export class CountdownComponent {
    constructor(container) {
        this.container = container;
        this.element = null;
        this.currentCountdown = null; // Stocke la valeur actuelle du countdown
    }

    init() {
        this.element = document.createElement("div");
        this.element.id = "countdown-display";
        this.element.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "user-select-none");
        this.element.style.fontSize = "5rem";
        this.element.style.color = "#fff";
        this.element.style.textAlign = "center";
        this.element.style.fontWeight = "bold";
        this.element.style.opacity = "0"; // Commence invisible pour l'animation

        this.container.appendChild(this.element);
    }

    update(countdownValue) {
        if (!this.element) this.init();

        const roundedCountdown = countdownValue !== undefined ? Math.ceil(countdownValue) : null;
        if (roundedCountdown === this.currentCountdown) return;

        this.currentCountdown = roundedCountdown;
        this.animateCountdown(roundedCountdown);
    }

    animateCountdown(value) {
        if (!this.element) return;

        this.element.textContent = value;
        this.element.style.opacity = "0";
        this.element.animate(
            [
                { opacity: "0", transform: "scale(0.5)" },
                { opacity: "1", transform: "scale(1.2)" },
                { opacity: "0.8", transform: "scale(1)" },
            ],
            {
                duration: 800,
                easing: "ease-out",
            }
        );
    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}