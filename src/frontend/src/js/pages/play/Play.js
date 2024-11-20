import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";

import zod from 'https://cdn.jsdelivr.net/npm/zod@3.23.8/+esm'
import { ApiRequestError } from "../../utils/api/parser/ApiRequestError.js";

const schemaGame = zod.object({
	duration: zod
		.number()
		.min(30, {
			message: "Duration must be at least 30 seconds"
		})
		.max(3600, {
			message: "Duration must be at most 3600 seconds"
		})
		.nullable(),
	maxPlayers: zod
		.literal(2),
	maxScore: zod
		.number()
		.min(1, {
			message: "Max score must be at least 1"
		})
		.max(100, {
			message: "Max score must be at most 100"
		})
		.nullable()
}).refine((data) => {
	if (data.duration === null && data.maxScore === null) {
		return false;
	}
	return true;
}, {
	message: "Duration or max score must be set",
	path: ["duration", "maxScore"]
});



const schemaTournament = zod
  .object({
    durationTournament: zod
      .number()
      .min(30, {
        message: "Duration must be at least 30 seconds",
      })
      .max(3600, {
        message: "Duration must be at most 3600 seconds",
      })
      .nullable(),
    maxScoreTournament: zod
      .number()
      .min(1, {
        message: "Max score must be at least 1",
      })
      .max(100, {
        message: "Max score must be at most 100",
      })
      .nullable(),
    tournamentName: zod
      .string()
      .min(3, {
        message: "Tournament name must be at least 3 characters",
      })
      .max(15, {
        message: "Tournament name must be at most 15 characters",
      }),
    pseudoCreatorTournament: zod
      .string()
      .min(3, {
        message: "Pseudo must be at least 3 characters",
      })
      .max(15, {
        message: "Pseudo must be at most 15 characters",
      }),
  })
  .refine(
    (data) => {
      return data.durationTournament !== null || data.maxScoreTournament !== null;
    },
    {
      message: "Duration or max score must be set",
      path: ["durationTournament", "maxScoreTournament"],
    }
);

const joinSchema = zod.object({
	gameId: zod
		.number()
});

export class Play extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div class="container container-md bg-background rounded rounded-3 p-4 my-4 d-flex flex-column gap-2">
				<div>
					<h2 class="text-center">Play</h2>
				</div>	
				<separator-component></separator-component>
				<div class="d-flex flex-column gap-2">
					<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createGameModal">
						Create Game
					</button>
					<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#joinGameModal">
						Join Game
					</button>
					<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createTournamentModal">
						Create Tournament
					</button>

				</div>
			</div>
			<!-- MODALS -->
			<div class="modal fade" id="createGameModal" tabindex="-1" aria-labelledby="createGameModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
					<form id="create-game-form" class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="createGameModalLabel">Create Game</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<!-- Duration -->
							<div class="form-group">
								<label for="duration">Duration</label>
								<input type="number" id="duration" class="form-control" name="duration" value="60" placeholder="Duration in seconds">
								<small id="duration-empty" class="form-text text-muted-foreground" style="display: none;">If no duration is set, the game will be infinite and max score will be required</small>
								<small id="duration-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Max players -->
							<div class="form-group">
								<label for="max-players">Max Players</label>
								<input type="number" id="max-players" class="form-control" name="maxPlayers" value="2" placeholder="Nombre de joueurs" readonly>
								<small id="maxPlayers-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Max Score -->
							<!-- Score is falcultatif and NULL by default, ive score is set, the partie can end before duration if score is reached -->
							<div class="form-group">
								<label for="max-score">Max Score</label>
								<input type="number" id="max-score" class="form-control" name="maxScore" value="" placeholder="Max Score" readonly>
								<small id="maxScore-error" class="form-text text-danger" style="display: none;"></small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button-component id="createGameButton" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="createGameButtonLoading"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Create
							</button-component>
						</div>
					</form>
				</div>
			</div>

			<div class="modal fade" id="joinGameModal" tabindex="-1" aria-labelledby="joinGameModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
					<form id="join-game-form" class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="joinGameModalLabel">Join Game</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<!-- GAME ID -->
							<div class="form-group">
								<label for="gameId">Game ID</label>
								<input type="number" id="gameId" class="form-control" name="gameId" placeholder="Game ID">
								<small id="gameId-error" class="form-text text-danger" style="display: none;"></small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button-component id="joinGameButton" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="joinGameButtonLoading"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Join
							</button-component>
						</div>
					</form>
				</div>
			</div>


			<!-- TOURNAMENT -->
			<div
				class="modal fade"
				id="createTournamentModal"
				tabindex="-1"
				aria-labelledby="createTournamentModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-dialog-centered">
					<form id="create-tournament-form" class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="createTournamentModalLabel">Create Tournament</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<!-- Tournament Name -->
							<div class="form-group">
								<label for="tournamentName">Tournament Name</label>
								<input
									type="text"
									id="tournamentName"
									class="form-control"
									name="tournamentName"
									placeholder="Tournament Name"
								/>
								<small
									id="tournamentName-error"
									class="form-text text-danger"
									style="display: none;"
								></small>
							</div>

							<!-- Duration -->
							<div class="form-group">
								<label for="durationTournament">Duration of each game</label>
								<input
									type="number"
									id="durationTournament"
									class="form-control"
									name="durationTournament"
									value="60"
									placeholder="Duration in seconds"
								/>
								<small
									id="durationTournament-empty"
									class="form-text text-muted-foreground"
									style="display: none;"
									>If no duration is set, the game will be infinite and max score will be
									required</small
								>
								<small
									id="durationTournament-error"
									class="form-text text-danger"
									style="display: none;"
								></small>
							</div>

							<!-- Max Score -->
							<div class="form-group">
								<label for="maxScoreTournament">Max Score</label>
								<input
									type="number"
									id="maxScoreTournament"
									class="form-control"
									name="maxScoreTournament"
									value=""
									placeholder="Max Score"
									readonly
								/>
								<small
									id="maxScoreTournament-error"
									class="form-text text-danger"
									style="display: none;"
								></small>
							</div>

							<!-- Pseudo Creator -->
							<div class="form-group">
								<label for="pseudoCreatorTournament">Pseudo</label>
								<input
									type="text"
									id="pseudoCreatorTournament"
									class="form-control"
									name="pseudoCreatorTournament"
									placeholder="Enter your pseudo"
								/>
								<small
									id="pseudoCreatorTournament-error"
									class="form-text text-danger"
									style="display: none;"
								></small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
								Close
							</button>
							<button-component
								id="createTournamentButton"
								type="submit"
								variant="muted"
								class="d-flex align-items-center justify-content-center gap-2"
							>
								<span
									id="createTournamentButtonLoading"
									class="spinner-border spinner-border-sm"
									role="status"
									aria-hidden="true"
									style="display: none;"
								></span>
								Create
							</button-component>
						</div>
					</form>
				</div>
			</div>


		</main-layout>
		`);
	}

	script() {
		/* ------------------------------- CREATE GAME ------------------------------ */
		const form = this.querySelector("#create-game-form");
		const submitButton = this.querySelector("#createGameButton");
		const loadingIcon = this.querySelector("#createGameButtonLoading");

		const durationInput = this.querySelector("#duration");
		const durationEmpty = this.querySelector("#duration-empty");
		// Check if duration is empty
		durationInput.addEventListener("input", () => {
			if (durationInput.value === "") {
				durationEmpty.style.display = "block";
			} else {
				durationEmpty.style.display = "none";
			}
		});

		// Submit form
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingIcon.style.display = "inline-block";
				submitButton.disabled = true;

				const formData = new FormData(form);
				const {
					duration,
					maxPlayers,
					maxScore
				} = Object.fromEntries(formData.entries());
				console.log(duration, maxPlayers, maxScore);

				schemaGame.parse({
					duration: duration === "" ? null : parseInt(duration),
					maxPlayers: parseInt(maxPlayers),
					maxScore: maxScore === "" ? null : parseInt(maxScore)
				});

				const { data, error } = await api.game.create({
					duration,
					maxPlayers,
					maxScore
				});
				if (error) throw error;
				Toast.success("Game created successfully");
				window.router.push(`/play/${data.id}`);
			} catch (error) {
				console.error(error);
				if (error instanceof ApiRequestError) {
					Toast.error(error.message);
				} else if (error instanceof zod.ZodError) {
					error.errors.forEach(err => {
						err.path.forEach(path => {
							const input = form.querySelector(`[name="${path}"]`);
							const errorElement = form.querySelector(`#${path}-error`);
							if (input && errorElement) {
								input.classList.add("is-invalid");
								errorElement.innerText = err.message;
								errorElement.style.display = "block";
							}
						});
					});
				} else {
					Toast.error("An error occurred while creating the game");
				}
			} finally {
				loadingIcon.style.display = "none";
				submitButton.disabled = false;
			}
		});

		/* -------------------------------------------------------------------------- */

		/* -------------------------------- JOIN GAME ------------------------------- */
		const joinForm = this.querySelector("#join-game-form");
		const joinSubmitButton = this.querySelector("#joinGameButton");
		const joinLoadingIcon = this.querySelector("#joinGameButtonLoading");

		// Submit form
		joinForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				joinLoadingIcon.style.display = "inline-block";
				joinSubmitButton.disabled = true;

				const formData = new FormData(joinForm);
				const {
					gameId
				} = Object.fromEntries(formData.entries());

				joinSchema.parse({
					gameId: parseInt(gameId)
				});

				const { data, error } = await api.game.join(gameId);
				if (error) throw error;
				Toast.success("Game joined successfully");
				window.router.push(`/play/${data.id}`);
			} catch (error) {
				console.error(error);
				if (error instanceof ApiRequestError) {
					Toast.error(error.message);
				} else if (error instanceof zod.ZodError) {
					error.errors.forEach(err => {
						err.path.forEach(path => {
							const input = form.querySelector(`[name="${path}"]`);
							const errorElement = form.querySelector(`#${path}-error`);
							if (input && errorElement) {
								input.classList.add("is-invalid");
								errorElement.innerText = err.message;
								errorElement.style.display = "block";
							}
						});
					});
				} else {
					Toast.error("An error occurred while joining the game");
				}
			} finally {
				joinLoadingIcon.style.display = "none";
				joinSubmitButton.disabled = false;
			}
		});
		/* -------------------------------------------------------------------------- */

		/* ------------------------------- CREATE TOURNAMENT ------------------------------ */
		const formTournament = this.querySelector("#create-tournament-form");
		const submitButtonTournament = this.querySelector("#createTournamentButton");
		const loadingIconTournament = this.querySelector("#createTournamentButtonLoading");

		const durationInputTournament = this.querySelector("#durationTournament");
		const durationEmptyTournament = this.querySelector("#durationTournament-empty");

		// Vérifie si la durée est vide
		durationInputTournament.addEventListener("input", () => {
			if (durationInputTournament.value === "") {
				durationEmptyTournament.style.display = "block";
			} else {
				durationEmptyTournament.style.display = "none";
			}
		});

		// Soumission du formulaire
		formTournament.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingIconTournament.style.display = "inline-block";
				submitButtonTournament.disabled = true;

				const formData = new FormData(formTournament);
				const {
					durationTournament,
					maxScoreTournament,
					tournamentName,
					pseudoCreatorTournament,
				} = Object.fromEntries(formData.entries());
			

				schemaTournament.parse({
					durationTournament: durationTournament === "" ? null : parseInt(durationTournament),
					maxScoreTournament: maxScoreTournament === "" ? null : parseInt(maxScoreTournament),
					tournamentName,
					pseudoCreatorTournament,
				});

				// Prépare les données pour l'API
				const apiData = {
					duration: durationTournament === "" ? null : parseInt(durationTournament),
					maxScore: maxScoreTournament === "" ? null : parseInt(maxScoreTournament),
					name: tournamentName,
					pseudo: pseudoCreatorTournament,
				};

				const { data, error } = await api.tournament.create(apiData);
				if (error) throw error;
				Toast.success("Tournament created successfully");

			} catch (error) {
				console.error(error);
				if (error instanceof ApiRequestError) {
					Toast.error(error.message);
				} else if (error instanceof zod.ZodError) {
					error.errors.forEach((err) => {
						err.path.forEach((path) => {
							console.log("path", path);
							const input = formTournament.querySelector(`[name="${path}"]`);
							const errorElement = formTournament.querySelector(`#${path}-error`);
							if (input && errorElement) {
								input.classList.add("is-invalid");
								errorElement.innerText = err.message;
								errorElement.style.display = "block";
							}
						});
					});
					// reset the input if no error
					for (const input of formTournament.querySelectorAll("input")) {
						if (error.errors.every((err) => !err.path.includes(input.name))) {
							input.classList.remove("is-invalid");
							const errorElement = formTournament.querySelector(`#${input.name}-error`);
							if (errorElement) {
								errorElement.style.display = "none";
							}
						}
					}
				} else {
					Toast.error("An error occurred while creating the tournament");
				}
			} finally {
				loadingIconTournament.style.display = "none";
				submitButtonTournament.disabled = false;
			}
		});

		/* -------------------------------------------------------------------------- */


	}
}

customElements.define("play-page", Play);