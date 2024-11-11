import { Component } from "../../utils/Component.js";

export class SettingsProfile extends Component {
	content() {
		return (/*html*/`
			<settings-layout>
				okoko
			</settings-layout>
		`);
	}
}

customElements.define("settings-profile-page", SettingsProfile);