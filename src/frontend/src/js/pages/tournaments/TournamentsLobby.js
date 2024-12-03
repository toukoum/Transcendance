import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";
import { ABITournament } from "../../../constante/constanteBC.js";

export class TournamentsLobby extends Component {
	content() {
		this.classList.add("h-100");
		const tournamentId = parseInt(this.getAttribute("id"));

		return /*html*/ `
      	<main-layout>
			<div class="wrapper-all">
				<h1 class="text-center">Tournament Lobby</h1>
				<div class="wrapper-lobby">
					<div class="left-part">
						<div class="invite-player-list">
							<h2>Invite Players</h2>
							<div class="list-users"></div>
						</div>
						<form id="invite-player" class="invite-form">
							<div class="form-group">
								<label for="username" class="form-label">Username</label>
								<input type="text" id="username" class="form-control" required />
							</div>
							<button type="submit" class="btn btn-success mt-2">Invite Player</button>
						</form>
					</div>
					<div class="right-part">
						<div id="titleRegister">
							<h2>Players in Tournament</h2>
							<button class="btn btn-primary" id="btnRegister">Register</button>
						</div>
						<div class="connected-players"></div>
						<div class="bottom-right">
							<div class="waiting-text">Waiting for other players<span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span> <span id="numbers-players-connected"></span></div>
							<button class="start-btn btn px-2 text-center" disabled>Start Tournament</button>
						</div>
						</div>
				</div>
			</div>
      	</main-layout>
    `;
	}

	style() {
		return /*css*/ `
			<style>

				.titleRegister {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.wrapper-all {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
					
				h1, h2 {
					font-weight: 600;
					color: #FFFFFF;
				}

				h1 {
					font-size: 2em;
					margin-top: 20px;
					margin-bottom: 0px;
				}

				h2 {
					font-size: 1.5em;
					margin-bottom: 15px;
					border-bottom: 1px solid #3A3A3C;
					padding-bottom: 10px;
				}

				.wrapper-lobby {
					display: flex;
					justify-content: center;
					flex-grow: 1;
					padding: 20px;
					overflow: hidden;
					flex-wrap: wrap;
					gap: 2rem;

				}

				.bottom-right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;
				}

				.left-part,
				.right-part {
					display: flex;
					flex-direction: column;
					width: 48%;
					max-width: 600px;
					overflow: hidden;
					background-color: #2C2C2E;
					border-radius: 10px;
					padding: 20px;
				}


        @media (max-width: 800px) {
          .left-part,
					.right-part {
						width: 100%;
            
          }
				}

				.invite-player-list {
					flex-grow: 1;
					overflow-y: auto;
					margin-bottom: 20px;
				}

				.list-users {
					overflow-y: auto;
					height: 300px;
				}

				.list-users::-webkit-scrollbar {
					display: none;
				}

				.list-users {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				.list-users .player,
				.connected-players .player {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10px;
					margin: 5px 0;
					border: 1px solid #3A3A3C;
					border-radius: 8px;
					background-color: #2C2C2E;
					color: #FFFFFF;
				}

				.list-users .player p,
				.connected-players .player p {
					margin: 0;
					font-weight: 500;
					color: #FFFFFF;
				}

				.list-users .btn,
				.invite-form .btn,
				.start-btn {
					padding: 8px 12px;
					border: none;
					border-radius: 6px;
					cursor: pointer;
					background-color: #0A84FF;
					color: #FFFFFF;
					font-weight: 500;
				}

				.list-users .btn:hover,
				.invite-form .btn:hover,
				.start-btn:hover {
					background-color: #0A84FF;
					opacity: 0.8;
				}

				.start-btn:disabled {
					background-color: #48484A;
					cursor: not-allowed;
				}

				.invite-form {
					border: 1px solid #3A3A3C;
					padding: 15px;
					border-radius: 10px;
					background-color: #2C2C2E;
				}

				.invite-form .form-group {
					margin-bottom: 15px;
				}

				.invite-form .form-label {
					color: #8E8E93;
					margin-bottom: 5px;
					display: block;
				}

				.invite-form .form-control {
					width: 100%;
					padding: 8px;
					border: 1px solid #3A3A3C;
					border-radius: 6px;
					background-color: #1C1C1E;
					color: #FFFFFF;
				}

				.invite-form .form-control::placeholder {
					color: #8E8E93;
				}

				.btn-success {
					background-color: #30D158;
					color: #FFFFFF;
				}

				.btn-success:hover {
					background-color: #30D158;
					opacity: 0.8;
				}

				.btn:hover {
					opacity: 0.9;
				}

				.waiting-text {
          text-align: center;
          font-size: 1.2em;
          margin: 20px 0;
          color: #8E8E93;
          display: none; /* Caché par défaut */
        }

        .waiting-text .dot1,
        .waiting-text .dot2,
        .waiting-text .dot3 {
          animation: blink 1.5s infinite;
        }

        .waiting-text .dot2 {
          animation-delay: 0.3s;
        }

        .waiting-text .dot3 {
          animation-delay: 0.6s;
        }

        @keyframes blink {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
			</style>
		`;
	}



	getComponentUserInvit(player) {
		const playerComponent = document.createElement("div");
		playerComponent.classList.add("player");
		playerComponent.dataset.id = player.id;
		playerComponent.innerHTML = `
      <p>${player.username}</p>
      <button class="btn btn-primary send-invit-button" data-username="${player.username}">Invite</button>
    `;
		return playerComponent;
	}

	getComponentUser(player) {
		const playerComponent = document.createElement("div");
		playerComponent.classList.add("player");
		playerComponent.dataset.id = player.id;
		playerComponent.innerHTML = `<p>${player.pseudo}</p>`;
		return playerComponent;
	}

	async fillPlayersInvite(tournamentId) {
		const { data, error } = await api.request.get(`users/`);
		if (error) {
			Toast.error("No players found");
			return;
		}
		const listPlayers = document.querySelector(".list-users");
		listPlayers.innerHTML = "";
		data.forEach((player) => {
			listPlayers.appendChild(this.getComponentUserInvit(player));
		});
		this.sendInvitationButton(tournamentId);
	}

	sendInvitation(tournamentId) {
		const formId = document.getElementById("invite-player");
		formId.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				const username = document.getElementById("username").value;
				const { data, error } = await api.request.post(
					`tournaments/${tournamentId}/invite-player/`,
					{ player: username }
				);
				if (error) throw error;
				Toast.success("Invitation sent");
			} catch (error) {
				Toast.error(error.message);
			}
		});
	}

	sendInvitationButton(tournamentId) {
		const listUsers = document.querySelector(".list-users");
		if (!listUsers) return;

		listUsers.addEventListener("click", async (e) => {
			const button = e.target.closest(".send-invit-button");
			if (!button) return;
			try {
				const username = button.getAttribute("data-username");
				const { data, error } = await api.request.post(
					`tournaments/${tournamentId}/invite-player/`,
					{ player: username }
				);
				if (error) throw error;
				Toast.success("Invitation sent");
			} catch (error) {
				Toast.error(error.message);
			}
		});
	}

	async fillPlayersConnected(tournamentId, status) {
		const connectedPlayers = document.querySelector(".connected-players");
		const existingPlayerIds = new Set();
		const buttonRegister = document.getElementById("btnRegister");

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		if (!connectedPlayers) return;

		Array.from(connectedPlayers.children).forEach((player) => {
			existingPlayerIds.add(parseInt(player.dataset.id));
		});

		let contract;
		try {
			const { data, error } = await api.request.get(
				`tournaments/${tournamentId}/`
			);
			console.log(data);
			contract = new ethers.Contract(data.address_tournament, ABITournament, signer);
			console.log(contract);
		} catch (error) {
			console.error(error);
		}

		const nbPlayerRegistered = await contract.getPlayers();

		console.log(nbPlayerRegistered.length);

		if (await contract.checkIfIsAlreadyInside(window.auth.profile.publicKey)) {
			buttonRegister.setAttribute("disabled", "disabled");
		}
		if (existingPlayerIds.size === 4 && nbPlayerRegistered.length === 4) {
			status.isReady = true;
		}

		status.numberPlayers = existingPlayerIds.size;

		try {
			const { data, error } = await api.request.get(
				`tournaments/${tournamentId}/players/`
			);
			if (error) throw error;

			data.forEach((player) => {
				if (!existingPlayerIds.has(player.id)) {
					connectedPlayers.appendChild(
						this.getComponentUser(player)
					);
				}
			});
		} catch (error) {
			Toast.error(error.message);
		}
	}

	async pollPlayersConnected(tournamentId) {
		const status = { isReady: false, numberPlayers: 0 };
		const waitingText = document.querySelector(".waiting-text");
		waitingText.style.display = "block";
		const numbersPlayersConnected = document.getElementById("numbers-players-connected");

		while (!status.isReady) {
			await this.fillPlayersConnected(tournamentId, status);
			numbersPlayersConnected.innerText = `(${status.numberPlayers}/4)`;
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		waitingText.style.display = "none";
		const startButton = document.querySelector(".start-btn");
		startButton.removeAttribute("disabled");
	}

	async startTournament(tournamentId) {
		const startButton = document.querySelector(".start-btn");
		startButton.addEventListener("click", async () => {
			if (startButton.hasAttribute("disabled")) return;

			try {
				const { data, error } = await api.request.post(`tournaments/${tournamentId}/start/`);
				if (error) throw error;

				Toast.success("Tournament started");
				// window.location.href = `/tournaments/${tournamentId}`;
			} catch (error) {
				Toast.error(error.message);
			}
		});

		let status = false;
		while (!status) {
			try {
				const { data, error } = await api.request.get(`tournaments/${tournamentId}/`);
				if (error) throw error;

				if (data.matches.length > 0) {
					window.location.href = `/tournaments/${tournamentId}/`;
				}

			} catch (error) {
				Toast.error(error.message);
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));

		}

	}

	script() {

		let provider;
		let signer;
		let contract;
		const tounamentId = parseInt(this.getAttribute("id"));
		const buttonRegister = document.getElementById("btnRegister");

		const getValues = async () => {
			try {
				const { data, error } = await api.request.get(
					`tournaments/${tounamentId}/`
				);
				console.log(data);
				contract = new ethers.Contract(data.address_tournament, ABITournament, signer);
				console.log(contract);
			} catch (error) {
				console.error(error);
			}
		};

		const connectWallet = async () => {
			try {
				if (typeof window.ethereum === 'undefined') {
					alert("Your wallet is not installed !");
					return;
				}
				console.log("Connexion au portefeuille en cours...");
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				console.log("Connecté avec le compte:", accounts[0]);
				provider = new ethers.providers.Web3Provider(window.ethereum);
				const balance = await provider.getBalance(accounts[0]);
				console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
				signer = provider.getSigner();
				getValues();
			} catch (error) {
				console.error("Erreur lors de la connexion au portefeuille:", error);
			}
		};

		if (window.auth.profile.publicKey !== "") {
			connectWallet();
		}

		buttonRegister.addEventListener("click", async () => {
			try {
				const contractWithWallet = contract.connect(signer);
				const tx = await contractWithWallet.register();
				await tx.wait();
				console.log(tx);
				Toast.success("Player registered:\n" + tx.hash);
			}
			catch (error) {
				Toast.error("Revert: Player already registered");
			}
		});

		const tournamentId = parseInt(this.getAttribute("id"));

		this.sendInvitation(tournamentId);
		this.fillPlayersInvite(tournamentId);
		this.pollPlayersConnected(tournamentId);
		this.startTournament(tournamentId);
	}
}

customElements.define("tournaments-lobby", TournamentsLobby);