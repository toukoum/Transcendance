import { Component } from "../../utils/Component.js";

export class HeaderLeftSide extends Component {
	content() {
		return (`
			<div class="d-flex bg-white p-1 rounded gap-2">
				<i class="bi bi-search"></i>
				<input type="text" class="form-control focus-none" placeholder="Search">
			</div>
		`);
	}
}

customElements.define("header-left-side", HeaderLeftSide);