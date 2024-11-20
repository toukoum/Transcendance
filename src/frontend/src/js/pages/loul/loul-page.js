import { Component } from "../../utils/Component.js"

export class Loul extends Component {
	constructor() {
		super("main-layout");
	}

	content() {
		return (/*html*/`
			<button id="connectButton">Connect Wallet</button>
		`);
	}
	script() {
		let provider;
		let signer;
		let contract;

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
					const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
					console.log("Connecté avec le compte:", accounts[0]);
					document.getElementById("connectButton").disabled = false;
					document.getElementById("connectButton").innerHTML = "Disconnect Wallet";
					provider = new ethers.providers.Web3Provider(window.ethereum);
					const balance = await provider.getBalance(accounts[0]);
					console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
					signer = provider.getSigner();
					// contract = new ethers.Contract(contractAddress, ABI, signer);
					sessionStorage.setItem("isConnected", true)
				}
			} catch (error) {
				console.error("Erreur lors de la connexion au portefeuille:", error);
			}
		};

		document.getElementById("connectButton").addEventListener("click", connectWallet);
	}
}

customElements.define("loul-page", Loul);