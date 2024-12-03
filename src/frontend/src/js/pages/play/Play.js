import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";
import { contractAddressTournament, contractAddressFactory, ABITournament, ABIFactory } from "../../../constante/constanteBC.js"

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
		.nullable(),
	map: zod
		.string()
		.optional(),
	difficulty: zod
		.string()
		.optional()
		.transform((value) => {
			if (value === "easy" || value === "medium" || value === "hard") {
				return value;
			}
			return null;
		})
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


const schemaLocal = zod.object({
	durationLocal: zod
		.number()
		.min(30, {
			message: "Duration must be at least 30 seconds"
		})
		.max(3600, {
			message: "Duration must be at most 3600 seconds"
		})
		.nullable(),
	maxScoreLocal: zod
		.number()
		.min(1, {
			message: "Max score must be at least 1"
		})
		.max(100, {
			message: "Max score must be at most 100"
		})
		.nullable(),
	mapLocal: zod
		.string()
		.optional(),
	difficultyLocal: zod
		.string()
		.optional()
		.transform((value) => {
			if (value === "easy" || value === "medium" || value === "hard") {
				return value;
			}
			return null;
		}),
	pseudoPlayer1: zod
		.string()
		.optional(),
	pseudoPlayer2: zod
		.string()
		.optional(),
}).refine((data) => {
	if (data.durationLocal === null && data.maxScoreLocal === null) {
		return false;
	}
	return true;
}, {
	message: "Duration or max score must be set",
	path: ["durationLocal", "maxScoreLocal"]
});


const joinSchema = zod.object({
	gameId: zod
		.number()
});

export class Play extends Component {
	content() {
		this.classList.add("h-100");
		return (/*html*/`
		<main-layout>
			<div class="container container-md bg-background rounded rounded-3 p-4 my-4 d-flex flex-column gap-2">
			<h2>Play</h2>
			<div class="card-grid">
					<div class="game-card" data-bs-toggle="modal" data-bs-target="#createGameModal">
							<i class="bi bi-controller"></i>
							<h5>Create Game</h5>
					</div>
					<div class="game-card" data-bs-toggle="modal" data-bs-target="#joinGameModal">
							<i class="bi bi-people"></i>
							<h5>Join Game</h5>
					</div>
					<div id="createDiv">
							<div id="createBtn" class="disablee game-card" data-bs-toggle="modal" data-bs-target="#createTournamentModal">
									<i class="bi bi-trophy"></i>
									<h5>Create Tournament</h5>
							</div>
					</div>
					<div class="game-card" data-bs-toggle="modal" data-bs-target="#createLocalModal">
							<i class="bi bi-joystick"></i>
							<h5>Play Pong Local</h5>
					</div>
			</div>
		
			<!-- MODALS -->
			<!-- Create Game Modal -->
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
								<small id="duration-empty" class="form-text text-muted-foreground" style="display: none;">
									If no duration is set, the game will be infinite and max score will be required.
								</small>
								<small id="duration-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Max Players -->
							<div class="form-group">
								<label for="max-players">Max Players</label>
								<input type="number" id="max-players" class="form-control" name="maxPlayers" value="2" placeholder="Number of players" readonly>
								<small id="maxPlayers-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Max Score -->
							<div class="form-group">
								<label for="max-score">Max Score</label>
								<input type="number" id="max-score" class="form-control" name="maxScore" value="" placeholder="Max Score">
								<small id="maxScore-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- MAP Select -->
							<div class="form-group">
								<label for="map">Map</label>
								<select id="map" class="form-select" name="map">
									<option value="default">Default</option>
									<option value="synthwave">Synthwave</option>
									<option value="water">Water</option>
								</select>
								<small id="map-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- DIFFICULTY -->
							<div class="form-group">
								<label for="difficulty">Difficulty</label>
								<select id="difficulty" class="form-select" name="difficulty">
									<option value="easy">Easy</option>
									<option value="medium">Medium</option>
									<option value="hard">Hard</option>
								</select>
								<small id="difficulty-error" class="form-text text-danger" style="display: none;"></small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button-component id="createGameButton" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="createGameButtonLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Create
							</button-component>
						</div>
					</form>
				</div>
			</div>
		
			<!-- Join Game Modal -->
			<div class="modal fade" id="joinGameModal" tabindex="-1" aria-labelledby="joinGameModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
					<form id="join-game-form" class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="joinGameModalLabel">Join Game</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							<!-- Game ID -->
							<div class="form-group">
								<label for="gameId">Game ID</label>
								<input type="number" id="gameId" class="form-control" name="gameId" placeholder="Game ID">
								<small id="gameId-error" class="form-text text-danger" style="display: none;"></small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button-component id="joinGameButton" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="joinGameButtonLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Join
							</button-component>
						</div>
					</form>
				</div>
			</div>
		
			<!-- Create Tournament Modal -->
			<div class="modal fade" id="createTournamentModal" tabindex="-1" aria-labelledby="createTournamentModalLabel" aria-hidden="true">
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
								<input type="text" id="tournamentName" class="form-control" name="tournamentName" placeholder="Tournament Name">
								<small id="tournamentName-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Duration -->
							<div class="form-group">
								<label for="durationTournament">Duration of each game</label>
								<input type="number" id="durationTournament" class="form-control" name="durationTournament" value="60" placeholder="Duration in seconds">
								<small id="durationTournament-empty" class="form-text text-muted-foreground" style="display: none;">
									If no duration is set, the game will be infinite and max score will be required.
								</small>
								<small id="durationTournament-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Max Score -->
							<div class="form-group">
								<label for="maxScoreTournament">Max Score</label>
								<input type="number" id="maxScoreTournament" class="form-control" name="maxScoreTournament" value="" placeholder="Max Score">
								<small id="maxScoreTournament-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Pseudo Creator -->
							<div class="form-group">
								<label for="pseudoCreatorTournament">Pseudo</label>
								<input type="text" id="pseudoCreatorTournament" class="form-control" name="pseudoCreatorTournament" placeholder="Enter your pseudo">
								<small id="pseudoCreatorTournament-error" class="form-text text-danger" style="display: none;"></small>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button-component id="createTournamentButton" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="createTournamentButtonLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Create
							</button-component>
						</div>
					</form>
				</div>
			</div>


			<!-- Create Local Modal -->
			<div class="modal fade" id="createLocalModal" tabindex="-1" aria-labelledby="createLocalModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered">
					<form id="create-Local-form" class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title fs-5" id="createLocalModalLabel">Create Local</h1>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body">
							
							<!-- Duration -->
							<div class="form-group">
								<label for="durationLocal">Duration of each game</label>
								<input type="number" id="durationLocal" class="form-control" name="durationLocal" value="60" placeholder="Duration in seconds">
								<small id="durationLocal-empty" class="form-text text-muted-foreground" style="display: none;">
									If no duration is set, the game will be infinite and max score will be required.
								</small>
								<small id="durationLocal-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Max Score -->
							<div class="form-group">
								<label for="maxScoreLocal">Max Score</label>
								<input type="number" id="maxScoreLocal" class="form-control" name="maxScoreLocal" value="" placeholder="Max Score">
								<small id="maxScoreLocal-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- MAP Select -->
							<div class="form-group">
								<label for="mapLocal">Map</label>
								<select id="mapLocal" class="form-select" name="mapLocal">
									<option value="default">Default</option>
									<option value="synthwave">Synthwave</option>
									<option value="water">Water</option>
								</select>
								<small id="mapLocal-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- DIFFICULTY -->
							<div class="form-group">
								<label for="difficultyLocal">Difficulty</label>
								<select id="difficultyLocal" class="form-select" name="difficultyLocal">
									<option value="easy">Easy</option>
									<option value="medium">Medium</option>
									<option value="hard">Hard</option>
								</select>
								<small id="difficultyLocal-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Pseudo Player 1 -->
							<div class="form-group">
								<label for="pseudoPlayer1">Pseudo Player 1</label>
								<input type="text" id="pseudoPlayer1" class="form-control" name="pseudoPlayer1" placeholder="Enter your pseudo">
								<small id="pseudoPlayer1-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							<!-- Pseudo Player 2 -->
							<div class="form-group">
								<label for="pseudoPlayer2">Pseudo Player 2</label>
								<input type="text" id="pseudoPlayer2" class="form-control" name="pseudoPlayer2" placeholder="Enter your pseudo">
								<small id="pseudoPlayer2-error" class="form-text text-danger" style="display: none;"></small>
							</div>
							
						
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button-component id="createLocalButton" type="submit" variant="muted" class="d-flex align-items-center justify-content-center gap-2">
								<span id="createLocalButtonLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>
								Create
							</button-component>
						</div>
					</form>
				</div>
			</div>
		</main-layout>
	`);
	}

	style() {
		return (/*css*/`
			<style>
					h2 {
							font-size: 3rem;
							margin-bottom: 2rem;
							text-align: center;
					}

					.card-grid {
							display: grid;
							grid-template-columns: repeat(2, 1fr);
							gap: 1rem;
							width: 100%;
							margin: 0 auto;
							height: 600px;
					}

					.disablee{
						opacity: 0.5;
						pointer-events: none;
					}


					.game-card {
							background-color: rgba(255, 255, 255, 0.1);
							border: none;
							border-radius: 10px;
							padding: 2rem;
							text-align: center;
							color: #fff;
							transition: transform 0.2s, background-color 0.2s;
							cursor: pointer;
							display: flex;
							justify-content: center;
							align-items: center;
							flex-direction: column;
							height: 100%;
							position: relative;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
							box-sizing: border-box;
					}

					.game-card:hover {
							background-color: rgba(255, 255, 255, 0.15);
							-webkit-box-shadow:inset 0px 0px 0px 1px #0071e3;
							-moz-box-shadow:inset 0px 0px 0px 1px #0071e3;
							box-shadow:inset 0px 0px 0px 1px #0071e3;
					}
							
					.game-card i {
							font-size: 3rem;
							margin-bottom: 1rem;
					}
					.game-card h5 {
							font-size: 1.5rem;
							margin-bottom: 0;
					}
					@media (max-width: 576px) {
							.card-grid {
									grid-template-columns: 1fr;
							}
							h2 {
									font-size: 2.5rem;
							}
					}
    </style>
		`)
	}

	script() {
		/* ------------------------------- CREATE GAME ------------------------------ */
		const form = document.querySelector("#create-game-form");
		const submitButton = document.querySelector("#createGameButton");
		const loadingIcon = document.querySelector("#createGameButtonLoading");

		const durationInput = document.querySelector("#duration");
		const durationEmpty = document.querySelector("#duration-empty");
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
					maxScore,
					map,
					difficulty
				} = Object.fromEntries(formData.entries());

				schemaGame.parse({
					duration: duration === "" ? null : parseInt(duration),
					maxPlayers: parseInt(maxPlayers),
					maxScore: maxScore === "" ? null : parseInt(maxScore),
					map,
					difficulty
				});

				const { data, error } = await api.game.create({
					duration,
					max_players: maxPlayers === "" ? null : parseInt(maxPlayers),
					max_score: maxScore === "" ? null : parseInt(maxScore),
					map: map === "default" ? undefined : map,
					difficulty
				});
				if (error) throw error;
				Toast.success("Game created successfully");
				window.router.push(`/play/${data.id}`);
			} catch (error) {
				// console.error(error);
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
					Toast.error(error.message);
				}
			} finally {
				loadingIcon.style.display = "none";
				submitButton.disabled = false;
			}
		});

		/* -------------------------------------------------------------------------- */

		/* -------------------------------- JOIN GAME ------------------------------- */
		const joinForm = document.querySelector("#join-game-form");
		const joinSubmitButton = document.querySelector("#joinGameButton");
		const joinLoadingIcon = document.querySelector("#joinGameButtonLoading");

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
				// console.error(error);
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
					Toast.error(error.message);
				}
			} finally {
				joinLoadingIcon.style.display = "none";
				joinSubmitButton.disabled = false;
			}
		});
		/* -------------------------------------------------------------------------- */

		/* ------------------------------- CREATE TOURNAMENT ------------------------------ */
		const formTournament = document.querySelector("#create-tournament-form");
		const submitButtonTournament = document.querySelector("#createTournamentButton");
		const loadingIconTournament = document.querySelector("#createTournamentButtonLoading");

		const durationInputTournament = document.querySelector("#durationTournament");
		const durationEmptyTournament = document.querySelector("#durationTournament-empty");

		// Vérifie si la durée est vide
		durationInputTournament.addEventListener("input", () => {
			if (durationInputTournament.value === "") {
				durationEmptyTournament.style.display = "block";
			} else {
				durationEmptyTournament.style.display = "none";
			}
		});

		let provider;
		let signer;
		let contract;
		const connectWallet = async () => {
			try {
				if (typeof window.ethereum === 'undefined') {
					alert("MetaMask n'est pas installé !");
					return;
				}
				console.log("Connexion au portefeuille en cours...");
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				console.log("Connecté avec le compte:", accounts[0]);
				provider = new ethers.providers.Web3Provider(window.ethereum);
				const balance = await provider.getBalance(accounts[0]);
				console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
				signer = provider.getSigner();
				contract = new ethers.Contract(contractAddressFactory, ABIFactory, signer);
			} catch (error) {
				console.error("Erreur lors de la connexion au portefeuille:", error);
			}
		};
		if (window.auth.profile.publicKey !== "") {
			connectWallet();
			document.querySelector("#createBtn").classList.remove('disablee');
		}
		else {
			document.querySelector("#createDiv").addEventListener("click", async () => {
				Toast.error("Connect your wallet in setting");
			});
			document.querySelector("#createBtn").classList.add('disablee');
		}
		

		let addressTournament;

		const createTournament = async () => {
			const contractWithWallet = contract.connect(signer);
			const tx = await contractWithWallet.createTournament();
			await tx.wait();
			console.log(tx);
			const block = await provider.getBlockNumber()
			const transferEvents = await contract.queryFilter('TournamentCreated', block - 1, block)
			if (transferEvents.length == 2)
				addressTournament = transferEvents[1].args.tournamentAddress;
			else
				addressTournament = transferEvents[0].args.tournamentAddress;
			console.log("Tournament created with the address:", addressTournament);
		}

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
				console.log(provider, signer, contract);
				await createTournament();
				const apiData = {
					duration: durationTournament === "" ? null : parseInt(durationTournament),
					max_score: maxScoreTournament === "" ? null : parseInt(maxScoreTournament),
					name: tournamentName,
					pseudo: pseudoCreatorTournament,
					address_tournament: addressTournament
				};
				const { data, error } = await api.tournament.create(apiData);
				if (error) throw error;
				Toast.success("Tournament created successfully with the address: ");
				const modalElement = document.querySelector("#createTournamentModal");
				const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
				modalInstance.hide();
				window.router.push(`/tournaments/lobby/${data.id}`);
			} catch (error) {
				// console.error(error);
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
					Toast.error(error.message);
				}
			} finally {
				loadingIconTournament.style.display = "none";
				submitButtonTournament.disabled = false;
			}
		});

		/* -------------------------------------------------------------------------- */

		/* ------------------------------- CREATE LOCAL ------------------------------ */
		const formLocal = document.querySelector("#create-Local-form");
		const submitButtonLocal = document.querySelector("#createLocalButton");
		const loadingIconLocal = document.querySelector("#createLocalButtonLoading");

		const durationInputLocal = document.querySelector("#durationLocal");
		const durationEmptyLocal = document.querySelector("#durationLocal-empty");

		durationInputLocal.addEventListener("input", () => {
			if (durationInputLocal.value === "") {
				durationEmptyLocal.style.display = "block";
			} else {
				durationEmptyLocal.style.display = "none";
			}
		});

		formLocal.addEventListener("submit", async (e) => {
			e.preventDefault();
			try {
				loadingIconLocal.style.display = "inline-block";
				submitButtonLocal.disabled = true;

				const formData = new FormData(formLocal);
				const {
					durationLocal,
					maxScoreLocal,
					mapLocal,
					difficultyLocal,
					pseudoPlayer1,
					pseudoPlayer2
				} = Object.fromEntries(formData.entries());

				schemaLocal.parse({
					durationLocal: durationLocal === "" ? null : parseInt(durationLocal),
					maxScoreLocal: maxScoreLocal === "" ? null : parseInt(maxScoreLocal),
					mapLocal,
					difficultyLocal,
					pseudoPlayer1,
					pseudoPlayer2
				});

				const params = new URLSearchParams();
				if (durationLocal) params.append("duration", durationLocal);
				if (maxScoreLocal) params.append("maxScore", maxScoreLocal);
				if (mapLocal) params.append("map", mapLocal);
				if (difficultyLocal) params.append("difficulty", difficultyLocal);
				if (pseudoPlayer1) params.append("player1", pseudoPlayer1);
				if (pseudoPlayer2) params.append("player2", pseudoPlayer2);
				// close the modal
				const modalElement = document.querySelector("#createLocalModal");
				const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
				modalInstance.hide();
				// redirect to the game
				window.router.push(`/play-local?${params.toString()}`);
			} catch (error) {
				// console.error(error);
				if (error instanceof zod.ZodError) {
					error.errors.forEach(err => {
						err.path.forEach(path => {
							const input = formLocal.querySelector(`[name="${path}"]`);
							const errorElement = formLocal.querySelector(`#${path}-error`);
							if (input && errorElement) {
								input.classList.add("is-invalid");
								errorElement.innerText = err.message;
								errorElement.style.display = "block";
							}
						});
					});
					for (const input of formLocal.querySelectorAll("input")) {
						if (error.errors.every((err) => !err.path.includes(input.name))) {
							input.classList.remove("is-invalid");
							const errorElement = formLocal.querySelector(`#${input.name}-error`);
							if (errorElement) {
								errorElement.style.display = "none";
							}
						}
					}
				} else {
					Toast.error(error.message);
				}
			} finally {
				loadingIconLocal.style.display = "none";
				submitButtonLocal.disabled = false;
			}
		});

	}
}

customElements.define("play-page", Play);