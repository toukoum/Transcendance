import { BaseScreen } from "./BaseScreen.js";
import { Toast } from "../../../../../../provider/toast-provider.js";
import { ABITournament } from "../../../../../../../constante/constanteBC.js";
import { api } from "../../../../../../utils/api/Api.js";
export class FinishedScreen extends BaseScreen {
	enter() {
		// add modals 
		this.element = document.createElement("div");
		this.element.id = "finished-screen";
		this.game.container.appendChild(this.element);

		this.element.innerHTML = (/*html*/`
			<div class="finished-screen position-absolute top-50 start-50 translate-middle p-2 border rounded bg-background w-50">
				<div class="finished-screen__content d-flex flex-column gap-2 align-items-center">
					<h3 style="font-size: 2rem;">👑 ${this.data.winner.username}</h3>
					<div class="finished-screen__scores d-flex flex-column gap-2 my-2 w-100">
						<div class="finished-screen__score d-flex justify-content-between align-items-center">
							<div class="finished-screen__score--user d-flex gap-2 align-items-center">
								<div class="player-waiting__avatar">
									<img src="${this.game.serverData.player_1.user.avatar}" alt="Avatar" class=" rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
								</div>
								<div class="player-waiting__name">
									${this.game.serverData.player_1.user.username}
								</div>
							</div>
							<div>${this.game.serverData.player_1.score}</div>
						</div>
						<div class="finished-screen__score d-flex justify-content-between align-items-center">
							<div class="finished-screen__score--user d-flex gap-2 align-items-center">
								<div class="player-waiting__avatar">
									<img src="${this.game.serverData.player_2.user.avatar}" alt="Avatar" class=" rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
								</div>
								<div class="player-waiting__name">
									${this.game.serverData.player_2.user.username}
								</div>
							</div>
							<div>${this.game.serverData.player_2.score}</div>
						</div>
					</div>
					<div id="winCondition">

					</div>
				</div>
			</div>
		`);

		const diCondition = document.getElementById("winCondition");
		const tournamentId = this.game.serverData.match.tournament;

		const buttonWin = document.createElement("button");
		buttonWin.classList.add("btn", "btn-primary");
		buttonWin.textContent = "Continue the tournament";


		const getUsernameWinner = () => {
			if (this.game.serverData.player_1.score > this.game.serverData.player_2.score) {
				return this.game.serverData.player_1.user.username;
			}
			return this.game.serverData.player_2.user.username;
		}


		let provider;
		let signer;
		let contract;
		const getValues = async () => {
			try {
				const { data, error } = await api.request.get(
					`tournaments/${tournamentId}/`
				);
				contract = new ethers.Contract(data.address_tournament, ABITournament, signer);
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

		const winTT = async () => {
			const contractWithWallet = contract.connect(signer);
			const tx = await contractWithWallet.setWinner();
			await tx.wait();
			console.log(tx);
			Toast.success("Transaction passed:\n" + tx.hash);
		}
		if (!this.game.serverData.match.tournament)
			diCondition.innerHTML = `<link-component href="/play" type="button" class="btn btn-primary">Play Again</link-component>`;
		else if (getUsernameWinner() === window.auth.username) {
			diCondition.appendChild(buttonWin);
			diCondition.addEventListener("click", async () => {
				try {
					await winTT();
					window.location.href = `/tournaments/${this.game.serverData.match.tournament}`
				}
				catch (error) {
					// console.log(error);
					Toast.error("Revert: Player already win or not enought player");
				}
			});
		}
		else
			window.location.href = `/tournaments/${this.game.serverData.match.tournament}`;
	}
}