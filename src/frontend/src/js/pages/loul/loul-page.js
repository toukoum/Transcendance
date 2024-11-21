import { Component } from "../../utils/Component.js"
import {contractAddressTournament, contractAddressFactory, ABITournament, ABIFactory} from "../../../constante/constanteBC.js"
import { api } from "../../utils/api/Api.js"
import { Toast } from "../../provider/toast-provider.js"
export class Loul extends Component {
	constructor() {
		super("main-layout");
	}

	content() {
		return (/*html*/`
			<button id="connectButton">Connect Wallet</button>
			<button id="createTournamentButton">Create Tournament</button>
			<button id="getTournamentsButton">Get Tournaments</button>
			<button id="updateBtn">Update Profile</button>
		`);
	}

	async updatePC(){
		console.log("update");
		try{
			const { data, error } = await api.request.patch("me/", {
				"username": "Juiceee",
				"first_name": "Louis",
			});
			if (error) throw error;
			console.log(data);
			Toast.success("Profile updated");
		} catch (error) {
			Toast.error(error.error);
		}
	}


	script() {
		let provider;
		let signer;
		let accounts;
		let contract;

		const updateBtn = document.getElementById("updateBtn");
		updateBtn.addEventListener("click", this.updatePC);




		const connectWallet = async () => {
			try {
				if (typeof window.ethereum === 'undefined') {
					alert("MetaMask n'est pas installé !");
					return;
				}
				if (sessionStorage.getItem("isConnected")) {
					sessionStorage.removeItem("isConnected");
					document.getElementById("connectButton").innerHTML = "Connect Wallet";
				} else {
					console.log("Connexion au portefeuille en cours...");
					document.getElementById("connectButton").innerHTML = "Connexion en cours...";
					document.getElementById("connectButton").disabled = true;
					accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
					console.log("Connecté avec le compte:", accounts[0]);
					document.getElementById("connectButton").disabled = false;
					document.getElementById("connectButton").innerHTML = "Disconnect Wallet";
					provider = new ethers.providers.Web3Provider(window.ethereum);
					const balance = await provider.getBalance(accounts[0]);
					console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
					signer = provider.getSigner();
					contract = new ethers.Contract(contractAddressFactory, ABIFactory, signer);
					sessionStorage.setItem("isConnected", true)
				}
			} catch (error) {
				console.error("Erreur lors de la connexion au portefeuille:", error);
			}
		};

		const createTournament = async () => {
			const contractWithWallet = contract.connect(signer);
			const tx = await contractWithWallet.createTournament();
			await tx.wait();
			console.log(tx);
		}

		const getTournaments = async () => {
			const oui = await contract.getTournaments();
			console.log(oui);
		}


		document.getElementById("connectButton").addEventListener("click", connectWallet);
		document.getElementById("createTournamentButton").addEventListener("click", createTournament);
		document.getElementById("getTournamentsButton").addEventListener("click", getTournaments);
	}
}

customElements.define("loul-page", Loul);