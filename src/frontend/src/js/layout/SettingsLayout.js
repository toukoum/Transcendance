import { Component } from "../utils/Component.js";

export class SettingsLayout extends Component {
	content() {
		return (/*html*/`
			<main-layout>
				<div class="container container-md bg-background rounded rounded-3 p-4 my-4 d-flex flex-column gap-2">
					<h2>Settings</h2>
					<settings-nav-component></settings-nav-component>
					<separator-component></separator-component>
					${this.childrens()}
				</div>
			</main-layout>
		`);
	}
}

customElements.define("settings-layout", SettingsLayout);