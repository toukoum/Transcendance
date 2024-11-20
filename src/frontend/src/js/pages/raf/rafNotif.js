import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { socketGameManager } from "./socketGameManager.js";

export class RafNotifPage extends Component {
	constructor() {
		super("main-layout");
	}

	content() {
		return (/*html*/`
			<div id="game" class="w-100 border border-primary p-4 rounded shadow-sm bg-dark text-light">
				<button id="trigger-notif" class="btn btn-primary mb-3">Trigger Notif for myself</button>

				<form id='trigger-notif-user' class="w-100 mt-4 border border-primary p-3 rounded bg-secondary shadow-sm">
					<div class="form-group">
						<label for="user-id" class="form-label">Username</label>
						<input type='text' id='user-id' class="form-control bg-dark text-light" required></input>
					</div>
					<button id="user-id" type='submit' class="btn btn-success mt-2">Ask Friendship</button>
				</form>
			</div>
		`);
	}


	script() {
		const button = document.getElementById("trigger-notif");

		try {
			button.addEventListener("click", async (e) => {
				const response = await fetch("http://localhost:8000/v1/testNotif/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				})
			})
		} catch (error) {
			console.log("Error with request notif")
		}


		const formId = document.getElementById("trigger-notif-user");
		try {
			formId.addEventListener("submit", async (e) => {
				e.preventDefault();
				const userId = formId.querySelector("#user-id").value;
				console.log("on envoit une notif au user name: ", userId);
				const response = await fetch("http://localhost:8000/v1/friends/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						user2: userId,
					}),
				})


				if (response.ok) {
					const responseData = await response.json();
					console.log("Success:", responseData);
				} else {
					const errorData = await response.json(); // Si ton backend retourne du JSON
					console.log("Error:", errorData);
					Toast.error(errorData.error.message);
				}
			})
		} catch (error) {
			console.log("erreur avec la requete: ", error)
		}

	}
}

customElements.define("raf-notif-page", RafNotifPage);
