import { Component } from "../../utils/Component.js";

export class Secret extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div class="h-100 d-flex justify-content-center align-items-center">
				<img src="/public/assets/secret/secret.webp" class="img-fluid" alt="Secret" style="width: 10px;">
			</div>
		</main-layout>
		`);
	}
}

customElements.define("secret-page", Secret);