import { Component } from "../../utils/Component.js";
import { socketGameManager } from "./socketGameManager.js";

export class RafPlayPage extends Component {
	constructor() {
		super("main-layout");
	}
	
	content() {
    return (/*html*/`
        <div id="game" class="w-100 border border-primary">
            <canvas id="pongCanvas" width="800" height="300"></canvas>
        </div>
    `);
	}


	script() {
    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");
    const socketGame = socketGameManager.getSocket();

    if (!socketGame) {
        console.error("No game socket available");
        return;
    }

    // Variables pour stocker l'état du jeu
    let gameState = {
        ball: { pos: [0, 0], radius: 1 },
        player1: { pos_y: 50, width: 1, height: 20, score: 0 },
        player2: { pos_y: 50, width: 1, height: 20, score: 0 },
    };

    // Fonction pour dessiner le jeu
    function drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner la balle
        ctx.beginPath();
        ctx.arc(
            gameState.ball.pos[0] * (canvas.width / 100), // Adaptation de la position
            gameState.ball.pos[1] * (canvas.height / 100),
            gameState.ball.radius * (canvas.width / 100),
            0, Math.PI * 2
        );
        ctx.fill();

        // Dessiner les raquettes
        ctx.fillRect(10, gameState.player1.pos_y * (canvas.height / 100), 10, gameState.player1.height * (canvas.height / 100));
        ctx.fillRect(canvas.width - 20, gameState.player2.pos_y * (canvas.height / 100), 10, gameState.player2.height * (canvas.height / 100));

        // Afficher le score
        ctx.font = "16px Arial";
        ctx.fillText(`Player 1: ${gameState.player1.score}`, 10, 20);
        ctx.fillText(`Player 2: ${gameState.player2.score}`, canvas.width - 100, 20);
    }

    // Réception des données du serveur
    socketGame.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        console.log(messageData);
        if (messageData.type === "game_update") {
            gameState = messageData.game_state;
            drawGame();
        }
    };

    // Gestion du mouvement des raquettes
    window.addEventListener("keydown", (e) => {
        let direction = 0;
        if (e.key === "ArrowUp") direction = -1;
        if (e.key === "ArrowDown") direction = 1;
        
        if (direction !== 0) {
						console.log("sending paddle move");
            socketGame.send(JSON.stringify({ type: "paddle_move", direction }));
        }
    });
	}

}

customElements.define("raf-play-page", RafPlayPage);
