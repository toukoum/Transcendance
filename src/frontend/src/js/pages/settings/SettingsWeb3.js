import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";

import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'

export class SettingsWeb3 extends Component {
	content() {
		return (/*html*/`
			<settings-layout>
				<div class="d-flex flex-column gap-3">
					<div class="d-flex flex-column gap-1">
						<h3>Two-Factor Authentication</h3>
					</div>
				</div>
			</settings-layout>
		`);
	}

	script() {
		
	}
}

customElements.define("settings-web3-page", SettingsWeb3);