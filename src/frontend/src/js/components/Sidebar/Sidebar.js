import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js"

export class Sidebar extends Component {




	content() {
		return (/*html*/`
		<div class="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style="width: 280px; height: 100vh;">

				<div id="wrapper-notif">
				</div>
		</div>
		`);
	}

	script () {
		
		const response = api.request.get('notifications/');

		const wrapperNotif = document.getElementById("wrapper-notif");

		wrapperNotif.innerHTML = "Salut";
		console.log(response.data);


	}
}

customElements.define("sidebar-component", Sidebar);