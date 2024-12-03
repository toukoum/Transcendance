import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";

export class SettingsWeb3 extends Component {
  content() {
    this.classList.add("h-100");
    return /*html*/ `
      <settings-layout>
        <div class="d-flex flex-column gap-3">
          <div class="d-flex flex-column gap-3">
            <h3>Web3 Connection</h3>
            <button
              id="connectButton"
              class="connect-button d-flex align-items-center justify-content-center gap-2"
            >
              Connect Wallet
            </button>
            <button id="savePubKey" class="save-button">Save</button>
          </div>
        </div>
      </settings-layout>
    `;
  }

  style() {
    return /*css*/ `
      <style>
        .connect-button {
					border: none;
          background-color: #007aff;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .connect-button.connected {
          background-color: #007aff !important;
          border: none;
        }
        .connect-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .save-button {
          background-color: #34c759;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
    `;
  }

  script() {
    const connectButton = document.getElementById("connectButton");
    const savePubKeyButton = document.getElementById("savePubKey");
    const user = window.auth;
    let accounts = [];

    // Initial state setup
    const init = () => {
      savePubKeyButton.disabled = true;

      if (user.profile.publicKey) {
        connectButton.disabled = true;
        connectButton.textContent = "Wallet Connected";
        connectButton.classList.add("connected");
        savePubKeyButton.style.display = "none";
      }
    };

    // Save public key to user profile
    const savePublicKey = async () => {
      try {
        const { data, error } = await api.request.patch("me/", {
          username: user.username,
          profile: {
            publicKey: accounts[0],
          },
        });
        if (error) throw error;
        Toast.success("Profile updated");
        savePubKeyButton.style.display = "none";
      } catch (error) {
        Toast.error(error.message || "An error occurred while updating the profile");
      }
    };

    // Connect to the user's wallet
    const connectWallet = async () => {
      if (typeof window.ethereum === "undefined") {
        Toast.error("MetaMask is not installed!");
        return;
      }
      try {
        connectButton.textContent = "Connecting...";
        connectButton.disabled = true;

        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];

        connectButton.textContent = "Wallet Connected";
        connectButton.classList.add("connected");
        Toast.success(`Wallet Connected: ${account}`);
        savePubKeyButton.disabled = false;
      } catch (error) {
        Toast.error(error.message || "An error occurred while connecting the wallet");
        connectButton.disabled = false;
        connectButton.textContent = "Connect Wallet";
      }
    };

    // Event listeners
    connectButton.addEventListener("click", connectWallet);
    savePubKeyButton.addEventListener("click", savePublicKey);

    // Initialize component state
    init();
  }
}

customElements.define("settings-web3-page", SettingsWeb3);