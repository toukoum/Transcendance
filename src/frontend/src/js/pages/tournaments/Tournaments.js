import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";

export class Tournaments extends Component {
  content() {
    this.classList.add("h-100");
    return /*html*/ `
      <main-layout>
        <div class="wrapper">
          <div class="tournament-wrapper">
            <div class="tournament-header">
              <h1 class="tournament-name"></h1>
              <div class="tournament-winner"></div>
            </div>
            <div class="tournament-info"></div>
            <div class="matches-container">
              <h2>Matches</h2>
              <div class="matches"></div>
            </div>
          </div>
        </div>
      </main-layout>
    `;
  }

  style() {
    return /*css*/ `
      <style>
        .wrapper {
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .tournament-wrapper {
          width: 100%;
          max-width: 800px;
          background-color: #2C2C2E;
          border-radius: 10px;
          padding: 20px;
        }

        .tournament-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .tournament-name {
          font-size: 2em;
          font-weight: 600;
          margin: 0;
        }

        .tournament-winner {
          font-size: 1.2em;
          font-weight: 500;
          color: #FFD700; /* Couleur or pour le Winner */
        }

        .tournament-info {
          margin-bottom: 20px;
          color: #8E8E93;
        }

        .matches-container {
          margin-top: 20px;
        }

        .matches {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .match {
          background-color: #3A3A3C;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }

        .match-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .match-round {
          font-weight: 500;
          color: #FFFFFF;
        }

        .match-status {
          font-weight: 500;
          color: #8E8E93;
        }

        .players {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .player {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #2C2C2E;
          padding: 10px;
          border-radius: 6px;
        }

        .player.winner {
          background-color: #FFD700; /* Fond or pour le Winner */
          color: #000000; /* Texte noir pour le contraste */
        }

        .player.winner .player-name,
        .player.winner .player-score {
          color: #000000; /* Assure que le texte est lisible */
        }

        .player-name {
          font-weight: 500;
          color: #FFFFFF;
        }

        .player-score {
          font-weight: 500;
          color: #FFFFFF;
        }
      </style>
    `;
  }

  async getDetailTournament(tournamentId) {
    const { data, error } = await api.request.get(`tournaments/${tournamentId}/`);
    if (error) {
      Toast.error(error);
      return null;
    }
    return data;
  }


  renderTournament(data) {
    const tournamentName = document.querySelector('.tournament-name');
    const tournamentInfo = document.querySelector('.tournament-info');
    const tournamentWinner = document.querySelector('.tournament-winner');
    const matchesContainer = document.querySelector('.matches');

    // Nom du tournoi
    tournamentName.textContent = data.name;

    // Informations du tournoi (par exemple, date de création)
    const createdAt = new Date(data.created_at).toLocaleString();
    tournamentInfo.textContent = `Create the : ${createdAt}`;

    // Affichage du Winner du tournoi
    if (data.winner) {
      tournamentWinner.textContent = `Winner : ${data.winner}`;
    } else {
      tournamentWinner.textContent = `Winner : -`;
    }

    // Affichage des matches
    data.matches.forEach(match => {
      const matchElement = document.createElement('div');
      matchElement.classList.add('match');

      // En-tête du match
      const matchHeader = document.createElement('div');
      matchHeader.classList.add('match-header');

      const matchRound = document.createElement('div');
      matchRound.classList.add('match-round');
      matchRound.textContent = `Round ${match.round}`;

      const matchStatus = document.createElement('div');
      matchStatus.classList.add('match-status');
      if (match.winner) {
        matchStatus.textContent = `Winner : ${match.winner_username}`;
      } else if (match.state == 'cancelled'){
        matchStatus.textContent = 'Cancelled'
      } else {
        matchStatus.textContent = 'In progress';
      }

      matchHeader.appendChild(matchRound);
      matchHeader.appendChild(matchStatus);

      // Joueurs
      const playersContainer = document.createElement('div');
      playersContainer.classList.add('players');

      match.match_players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');

        if (match.winner && player.player_id === match.winner) {
          playerElement.classList.add('winner');
        }

        const playerName = document.createElement('div');
        playerName.classList.add('player-name');
        playerName.textContent = player.username;

        const playerScore = document.createElement('div');
        playerScore.classList.add('player-score');
        playerScore.textContent = `Score : ${player.score !== null ? player.score : '-'}`;

        playerElement.appendChild(playerName);
        playerElement.appendChild(playerScore);
        playersContainer.appendChild(playerElement);
      });

      matchElement.appendChild(matchHeader);
      matchElement.appendChild(playersContainer);
      matchesContainer.appendChild(matchElement);
    });
  }
  async script() {
    const tournamentId = parseInt(this.getAttribute("id"));
    const data = await this.getDetailTournament(tournamentId);
    
    if (data) {
      this.renderTournament(data);
    }
  }
}

customElements.define("tournaments-page", Tournaments);