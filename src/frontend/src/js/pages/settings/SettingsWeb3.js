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
						<h3>Web3 Connection</h3>
						<button id="connectButton" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
							Connect Wallet
						</button>
						<button id="savePubKey" variant="muted">Save</button>
					</div>
				</div>
			</settings-layout>
		`);
	}

	script() {
		let accounts;

		if (window.auth.profile.publicKey) {
			document.getElementById("connectButton").disabled = true;
			document.getElementById("connectButton").innerHTML = "Wallet Connected";
			document.getElementById("savePubKey").style.display = "none";
		}

		document.getElementById("savePubKey").addEventListener("click", async () => {
			const user = window.auth;
			console.log("username " + user.username, "public_key " + accounts[0]);
			try {
				const { data, error } = await api.request.patch("me/", {
					"username": user.username,
					"profile": {
						"publicKey": accounts[0],
					}
				});
				if (error) throw error;
				console.log(data);
				Toast.success("Profile updated");
				document.getElementById("savePubKey").disabled = true;
			} catch (error) {
				Toast.error(error.error);
			}
		});

		const connectWallet = async () => {
			try {
				if (typeof window.ethereum === 'undefined') {
					alert("MetaMask n'est pas installé !");
					return;
				}
				console.log("Connexion au portefeuille en cours...");
				document.getElementById("connectButton").innerHTML = "Connexion en cours...";
				document.getElementById("connectButton").disabled = true;
				accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				console.log("Connecté avec le compte:", accounts[0]);
				document.getElementById("connectButton").innerHTML = "Wallet Connected";
				Toast.success("Wallet Connected:\n" + accounts[0]);
				document.getElementById("savePubKey").disabled = false;

			}
			catch (error) {
				Toast.error("MetaMask: " + error.message);
				document.getElementById("connectButton").disabled = false;
				document.getElementById("connectButton").innerHTML = "Connect Wallet";
			}
		};

		document.getElementById("connectButton").addEventListener("click", connectWallet);
	}
}

customElements.define("settings-web3-page", SettingsWeb3);