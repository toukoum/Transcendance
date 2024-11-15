import { Component } from "../../utils/Component.js";
import { socketGameManager } from "./socketGameManager.js";

export class RafNotifPage extends Component {
	constructor() {
		super("main-layout");
	}
	
	content() {
		return (/*html*/`

			<div id="game" class="w-100 border border-primary">
				<button id="trigger-notif">Trigger Notif for myself</button>

				<form id='trigger-notif-user' class="w-100 mt-4 border border-primary">
					<label for="user-id">User id</label>
					<input type='text' id='user-id' required></input>
					<button id="user-id" type='submit'>Trigger Notif for a user</button>
				</form>
			</div>
		`);
	}


	script() {
        const button = document.getElementById("trigger-notif");

        try{
            button.addEventListener("click", async (e) => {
                const response = await fetch("http://localhost:8000/v1/notif/testNotif/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				})

				if (response.ok){
					const responseData = await response.json()
					console.log("request well sent!: ", responseData)
				}else{
					console.log("Error with trigger notif")
				}
            })
        }catch (error){
            console.log("Error with request notif")
        }


		const formId = document.getElementById("trigger-notif-user");
		try{
			formId.addEventListener("submit", async (e) => {
				e.preventDefault();
				const userId = formId.querySelector("#user-id").value;
				console.log("on envoit une notif au user id: ", userId);
				const response = await fetch("http://localhost:8000/v1/notif/testNotifUser/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						userId: userId,
					}),
				})

				if (response.ok){
					console.log("cool")
				}else{
					console.log("erreur")
				}
			})
		}catch(error){
			console.log("erreur avec la requete: ", error)
		}

	}
}

customElements.define("raf-notif-page", RafNotifPage);
