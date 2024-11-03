import { Component } from "../../utils/Component.js";

export class HeaderRightSide extends Component {
	content() {
		return (`
			<button class="btn bg-white px-2" onclick="window.router.push('/auth/login')">Se connecter</button>
		`);
	}
}

customElements.define("header-right-side", HeaderRightSide);