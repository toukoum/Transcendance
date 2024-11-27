import { Component } from "../../../utils/Component.js";
import { Toast } from "../../../provider/toast-provider.js";
import { api } from "../../../utils/api/Api.js";

export class Dashboard extends Component {
  content() {
    return /*html*/ `
      <div class="home-wrapper">
        <div class="user-info-section">
          <h2>Welcome, <span class="user-name"></span></h2>
          <div class="user-details">
            <img src="" alt="Avatar" class="user-avatar" />
            <div class="user-bio-location">
              <p class="user-bio"></p>
              <p class="user-location"></p>
            </div>
          </div>
        </div>

        <div class="recent-games-section">
          <h2>Last Games</h2>
          <div class="games-list"></div>
        </div>
      </div>
    `;
  }

  style() {
    return /*css*/ `
      <style>

        .home-wrapper {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
					width: 100%;
        }

        .user-info-section, .recent-games-section {
          background-color: #1C1C1E;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .user-info-section h2, .recent-games-section h2 {
          font-size: 1.8em;
          margin-bottom: 20px;
          border-bottom: 1px solid #3A3A3C;
          padding-bottom: 10px;
        }

        .user-info-section .user-details {
          display: flex;
          align-items: center;
        }

        .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 20px;
          border: 2px solid #0A84FF;
        }

        .user-bio-location {
          flex: 1;
        }

        .user-bio, .user-location {
          font-size: 1em;
          color: #8E8E93;
          margin: 5px 0;
        }

        .user-name {
          color: #0A84FF;
        }

        .games-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .game-item {
          background-color: #3A3A3C;
          padding: 15px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .game-info {
          display: flex;
          flex-direction: column;
        }

        .game-title {
          font-size: 1.2em;
          font-weight: 500;
          color: #FFFFFF;
        }

        .game-date {
          font-size: 0.9em;
          color: #8E8E93;
        }

        .game-status {
          font-size: 1em;
          font-weight: 500;
          color: #30D158;
        }

        .game-status.loss {
          color: #FF453A;
        }

        .game-status.in-progress {
          color: #FFD60A;
        }

        @media (max-width: 600px) {
          .user-details {
            flex-direction: column;
            align-items: center;
          }

          .user-avatar {
            margin-bottom: 20px;
          }

          .game-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .game-status {
            margin-top: 10px;
          }
        }
      </style>
    `;
  }

  async getInfo(endpoint) {
    try {
      const { data, error } = await api.request.get(endpoint);
      if (error) throw error;
      return data;
    } catch (error) {
      Toast.error(error.message);
    }
  }

  renderUserInfo(userInfo) {
    const userNameElement = document.querySelector('.user-name');
    const userAvatarElement = document.querySelector('.user-avatar');
    const userBioElement = document.querySelector('.user-bio');
    const userLocationElement = document.querySelector('.user-location');
    userNameElement.textContent = userInfo.username;
    userAvatarElement.src = userInfo.profile.avatar;
		userBioElement.textContent = userInfo.profile.bio || 'No bio available.';
		userLocationElement.textContent = userInfo.profile.location || 'Location not specified.';
  }

  renderGameInfo(gameInfo) {
    const gamesListElement = document.querySelector('.games-list');

    if (!gameInfo || gameInfo.length === 0) {
      gamesListElement.innerHTML = '<p>No games found.</p>';
      return;
    }

    gameInfo.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.classList.add('game-item');

      const gameInfoDiv = document.createElement('div');
      gameInfoDiv.classList.add('game-info');

      console.log(`game`, game);
      const opponent = game.match_players.find(player => player.username !== window.auth.username);
      const opponentName = opponent ? opponent.username : 'Unknown';

      const gameTitle = document.createElement('div');
      gameTitle.classList.add('game-title');
      gameTitle.textContent = `Against ${opponentName}`;

      const gameDate = document.createElement('div');
      gameDate.classList.add('game-date');
      const date = new Date(game.created_at);
      gameDate.textContent = `The ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

      gameInfoDiv.appendChild(gameTitle);
      gameInfoDiv.appendChild(gameDate);

      const gameStatus = document.createElement('div');
      gameStatus.classList.add('game-status');

      // Récupérer l'ID de l'utilisateur courant
      const currentUserId = window.auth.id;

      // Récupérer le joueur courant dans le match
      const currentUserInMatch = game.match_players.find(player => player.player_id === currentUserId);

      // Déterminer le statut du jeu
      if (game.state === 'finished') {
        if (game.winner === currentUserId) {
          gameStatus.textContent = 'Victory';
        } else {
          gameStatus.textContent = 'Loss';
          gameStatus.classList.add('loss');
        }
      } else if (game.state === 'in_progress') {
        gameStatus.textContent = 'In progress';
        gameStatus.classList.add('in-progress');
      } else {
        gameStatus.textContent = 'Waiting';
        gameStatus.classList.add('in-progress');
      }

      gameItem.appendChild(gameInfoDiv);
      gameItem.appendChild(gameStatus);
      gamesListElement.appendChild(gameItem);
    });
  }

  async script() {
    const userInfo = await this.getInfo("me/");
    const gameInfo = await this.getInfo("games/");
    
    if (userInfo) {
      this.renderUserInfo(userInfo);
    }
    
    if (gameInfo) {
      this.renderGameInfo(gameInfo);
    }
  }
}

customElements.define("dashboard-component", Dashboard);