import { Component } from "../../utils/Component.js";

export class SettingsSecurity extends Component {
	content() {
		return (/*html*/`
			<settings-layout>
				security settings
			</settings-layout>
		`);
	}
}

customElements.define("settings-security-page", SettingsSecurity);