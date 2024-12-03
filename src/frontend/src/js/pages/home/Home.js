import { Component } from "../../utils/Component.js";
import { Dashboard } from "./_components/Dashboard.js";

export class Home extends Component {
  constructor() {
    super("main-layout");

    this.sequence = [];
    this.expectedSequence = ["s", "e", "c", "r", "e", "t"];
    this.maxDelay = 2000;
    this.timeout = null;
  }

  content() {
    this.classList.add("h-100");
    const isLogged = !!window.auth;
    if (!isLogged) {
      return /*html*/ `
        <div class="hero">
          <div class="hero-content">
            <h1 class="hero-title">Transcendance</h1>
            <p class="hero-subtitle">Challenge your friends, dominate them, and bully them.</p>
            <button class="hero-btn" onclick="window.router.push('/auth/login')">Get Started</button>
          </div>
        </div>
      `;
    }
    return /*html*/ `
      <dashboard-component></dashboard-component>
    `;
  }

  style() {
    return /*css*/ `
      <style>
        :host {
          display: block;
          height: 100vh;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #fff;
          background: #000;
        }

        .hero {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 100%;
          background: linear-gradient(145deg, #121212, #000000);
        }

        .hero-content {
          max-width: 600px;
          padding: 20px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #4caf50, #2196f3, #9c27b0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          font-weight: 300;
          color: #bbbbbb;
          margin-bottom: 2rem;
        }

        .hero-btn {
          background: linear-gradient(to right, #4caf50, #2196f3);
          color: #fff;
          font-size: 1rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(66, 165, 245, 0.3);
        }

        .hero-btn:active {
          transform: translateY(0);
          box-shadow: 0 5px 10px rgba(66, 165, 245, 0.2);
        }
      </style>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startListeningForSecret();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopListeningForSecret();
  }

  startListeningForSecret() {
    this.onKeyPress = this.handleKeyPress.bind(this);
    window.addEventListener("keydown", this.onKeyPress);
  }

  stopListeningForSecret() {
    window.removeEventListener("keydown", this.onKeyPress);
    this.resetSequence();
  }

  handleKeyPress(event) {
    const key = event.key.toLowerCase();
    this.sequence.push(key);

    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.resetSequence();
    }, this.maxDelay);

    if (this.sequence.join("") === this.expectedSequence.join("")) {
      this.resetSequence();
      window.router.push("/7NGjdgKWmo7bQpSgdRN5ADNjAPQpJm5l1vRqzKP4lt8=");
    } else if (!this.expectedSequence.slice(0, this.sequence.length).every((k, i) => k === this.sequence[i])) {
      this.resetSequence();
    }
  }

  resetSequence() {
    this.sequence = [];
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = null;
  }
}

customElements.define("home-page", Home);
