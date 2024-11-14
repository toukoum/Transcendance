import { Component } from "../../utils/Component.js";
import { socketGameManager } from "./socketGameManager.js";

export class RafTestPage extends Component {
	constructor() {
		super("main-layout");
	}
	
	content() {
		return (/*html*/`
			<div id="users" class="w-100 border border-primary">
				Chargement des utilisateurs...
			</div>


			<form id="join-game-form" class="w-100 mt-4 border border-primary">
				<label for="game-id">Game ID:</label>
				<input type="text" id="game-id" name="game-id" required>
				<button type="submit">Join game</button>
			</form>

		`);
	}

	async createGame(username) {
		try {
			// Crée une nouvelle partie en invitant l'opponent
			const gameResponse = await fetch("http://localhost:8000/v1/game/new/", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ opponent: username }),
			});
			
			if (gameResponse.ok) {
				const gameData = await gameResponse.json();
				console.log("Game created:", gameData);
				const gameId = gameData.id;

				// Connexion WebSocket à la partie
				socketGameManager.connect(gameId);
			} else {
				console.error("Erreur lors de la création du jeu:", gameResponse);
			}
		} catch (error) {
			console.error("Erreur lors de la requête:", error);
		}
	}


	// Fonction pour charger les utilisateurs avec la possibilité de lancer une partie
	async loadUsers() {
		const userContainer = this.querySelector("#users");

		try {
			const response = await fetch("http://localhost:8000/v1/users/", {
				method: "GET",
				credentials: "include",
			});

			if (response.ok) {
				const data = await response.json();
				userContainer.innerHTML = "";  // Efface le texte de chargement

				data.forEach((user) => {
					const userDiv = document.createElement("div");
					userDiv.className = "user";
					userDiv.style = "border: 1px solid black; margin: 5px; padding: 5px;";
					userDiv.innerHTML = `<strong>${user.username}</strong><br>${user.email}`;

					// Ajouter un bouton pour inviter l'utilisateur à une partie
					const playButton = document.createElement("button");
					playButton.className = "play-button";
					playButton.textContent = "Play";
					playButton.addEventListener("click", () => {
						this.createGame(user.username);
					});
					userDiv.appendChild(playButton);

					userContainer.appendChild(userDiv);
				});
			} else {
				userContainer.innerHTML = "Erreur lors du chargement des utilisateurs.";
			}
		} catch (error) {
			console.error("Erreur lors de la requête:", error);
			userContainer.innerHTML = "Impossible de charger les utilisateurs.";
		}
	}

	script() {
		// Charger les utilisateurs au démarrage
		this.loadUsers();

		// Gérer la soumission du formulaire pour rejoindre une partie
		const joinGameForm = this.querySelector("#join-game-form");
		joinGameForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const gameId = joinGameForm.querySelector("#game-id").value;
			console.log("Joining game:", gameId);

			// Connexion WebSocket à la partie spécifiée par l'ID
			socketGameManager.connect(gameId);
		});


		
	}
}

customElements.define("raf-test-page", RafTestPage);
