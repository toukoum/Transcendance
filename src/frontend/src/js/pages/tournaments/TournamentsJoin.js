import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";

export class TournamentsJoin extends Component {
  content() {
    this.classList.add("h-100");
    return /*html*/ `
      <main-layout>
        <div class="wrapper">
          <div class="join-container">
            <h1 class="title">Join Tournament</h1>
            <form id="join-form" class="join-form">
              <div class="form-group">
                <label for="pseudo" class="form-label">Enter your Pseudo</label>
                <input type="text" id="pseudo" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary">Join</button>
            </form>
          </div>
        </div>
      </main-layout>
    `;
  }

  style() {
    return /*css*/ `
      <style>
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .join-container {
          background-color: #2C2C2E;
          border-radius: 10px;
          padding: 40px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .title {
          font-size: 1.8em;
          margin-bottom: 30px;
          color: #FFFFFF;
        }

        .join-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .form-label {
          margin-bottom: 5px;
          color: #8E8E93;
        }

        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #3A3A3C;
          border-radius: 8px;
          background-color: #1C1C1E;
          color: #FFFFFF;
        }

        .form-control::placeholder {
          color: #8E8E93;
        }

        .btn-primary {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background-color: #0A84FF;
          color: #FFFFFF;
          font-size: 1em;
          cursor: pointer;
        }

        .btn-primary:hover {
          background-color: #0A84FF;
          opacity: 0.8;
        }
      </style>
    `;
  }

  async script() {
    const canJoin = !!window.auth.profile.publicKey;
	if (!canJoin) {
		const feur = document.querySelector(".wrapper");
		feur.innerHTML = "";
		Toast.error("Connect your Wallet in setting first");
		const settings = document.createElement("button");
		feur.classList.add("d-flex", "justify-content-center", "align-items-center", "h-100");
		settings.textContent = "Add your account in settings tab";
		settings.classList.add("btn", "btn-primary");
		feur.appendChild(settings);
		settings.addEventListener("click", () => {
			window.router.push("/settings/web3");
		});
		return;
	}
    const tournamentId = parseInt(this.getAttribute("id"));
    const joinForm = document.getElementById("join-form");
    
    joinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const pseudo = document.getElementById("pseudo").value;

      try {
        const { data, error } = await api.request.post(
          `tournaments/${tournamentId}/add-player/`,
          { pseudo }
        );
        if (error) throw error;

        Toast.success("You have successfully joined the tournament.");
				window.router.push(`/tournaments/lobby/${tournamentId}`);
        
      } catch (error) {
        Toast.error(error.message || "An error occurred while joining the tournament.");
      }
    });
  }
}

customElements.define("tournaments-join-page", TournamentsJoin);