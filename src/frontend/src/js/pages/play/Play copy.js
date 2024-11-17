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
	numbersPlayer: zod
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

export class Play extends Component {
	content() {
		return (/*html*/`
		<main-layout>
			<div class="container container-md bg-background rounded rounded-3 p-4 my-4 d-flex flex-column gap-2">
				<div>
					<h2 class="text-center">Play</h2>
					<!-- <p class="text-center text-muted-foreground">Create a new game</p> -->
				</div>	
				<separator-component></separator-component>
				<!-- Start form -->
				<form id="create-game-form" class="d-flex flex-column gap-1">
					<!-- Duration -->
					<div class="form-group">
						<label for="duration">Duration</label>
						<input type="number" id="duration" class="form-control" name="duration" value="60" placeholder="Duration in seconds">
						<small id="duration-empty" class="form-text text-muted-foreground" style="display: none;">If no duration is set, the game will be infinite and max score will be required</small>
						<small id="duration-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<!-- Numbers player -->
					<div class="form-group">
						<label for="numbers-player">Numbers of players</label>
						<input type="number" id="numbers-player" class="form-control" name="numbersPlayer" value="2" placeholder="Nombre de joueurs" readonly>
						<small id="numbersPlayer-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<!-- Max Score -->
					 <!-- Score is falcultatif and NULL by default, ive score is set, the partie can end before duration if score is reached -->
					<div class="form-group">
						<label for="max-score">Max Score</label>
						<input type="number" id="max-score" class="form-control" name="maxScore" value="" placeholder="Max Score" readonly>
						<small id="maxScore-error" class="form-text text-danger" style="display: none;"></small>
					</div>
					<button-component id="submit-button" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">	
						<span id="loading-icon"  class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
						Save
					</button-component>
				</form>
			</div>
		</main-layout>
		`);
	}

	script() {
		const form = this.querySelector("#create-game-form");
		const submitButton = this.querySelector("#submit-button");
		const loadingIcon = this.querySelector("#loading-icon");

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
					numbersPlayer,
					maxScore
				} = Object.fromEntries(formData.entries());
				console.log(duration, numbersPlayer, maxScore);

				schemaGame.parse({
					duration: duration === "" ? null : parseInt(duration),
					numbersPlayer: parseInt(numbersPlayer),
					maxScore: maxScore === "" ? null : parseInt(maxScore)
				});

				const { data, error } = await api.game.create({
					duration,
					numbersPlayer,
					maxScore
				});
				if (error) throw error;
				console.log('data', data);
				Toast.success("Game created successfully");
				window.router.push(`/play/${data.id}`);
			} catch (error) {
				console.error(error);
				if (error instanceof ApiRequestError) {
					// TODO: change in django response to match object { data, error }
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

						// const input = form.querySelector(`[name="${err.path[0]}"]`);
						// const errorElement = form.querySelector(`#${err.path[0]}-error`);
						// input.classList.add("is-invalid");
						// errorElement.innerText = err.message;
						// errorElement.style.display = "block";
					});
				} else {
					Toast.error("An error occurred while creating the game");
				}
			} finally {
				loadingIcon.style.display = "none";
				submitButton.disabled = false;
			}
		});


	}
}

customElements.define("play-page", Play);