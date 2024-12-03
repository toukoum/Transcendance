import { Component } from "../../utils/Component.js";

export class Secret extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div id="dvd-container" class="position-relative" style="height: 100vh;">
				<img id="dvd-animation" src="/public/assets/secret/secret.webp" class="position-absolute" alt="Secret" style="width: 25px;">
			</div>
		</main-layout>
		`);
	}

	script() {
		let x = 0,
			y = 0,
			dirX = 1,
			dirY = 1;
		const speed = 2;
		const dvd = document.getElementById("dvd-animation");
		const dvdContainer = document.getElementById("dvd-container");
		const dvdWidth = dvd.width;
		const dvdHeight = dvd.height;

		const animate = () => {
			const screenHeight = dvdContainer.clientHeight;
			const screenWidth = dvdContainer.clientWidth;

			if (y + dvdHeight >= screenHeight || y < 0) {
				dirY *= -1;
			}
			if (x + dvdWidth >= screenWidth || x < 0) {
				dirX *= -1;

			}
			x += dirX * speed;
			y += dirY * speed;
			dvd.style.left = x + "px";
			dvd.style.top = y + "px";
			window.secretAnimation = requestAnimationFrame(animate);
		}

		animate();
	}

	disconnectedCallback() {
		if (window.secretAnimation) {
			cancelAnimationFrame(window.secretAnimation);
			window.secretAnimation = null;
		}
		super.disconnectedCallback();
	}

}

customElements.define("secret-page", Secret);