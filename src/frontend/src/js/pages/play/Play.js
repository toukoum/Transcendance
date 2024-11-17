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
	}
}

customElements.define("play-page", Play);