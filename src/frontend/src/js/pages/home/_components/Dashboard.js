import { Component } from "../../../utils/Component.js";
import { Toast } from "../../../provider/toast-provider.js";
import { api } from "../../../utils/api/Api.js";

export class Dashboard extends Component {
  content() {
    return /*html*/ `
      <div class="home-wrapper">
        <div class="user-info-section">
          <div class="user-header">
            <img src="" alt="Avatar" class="user-avatar" />
            <div class="user-basic-info">
              <h2><span class="user-first-name"></span> <span class="user-last-name"></span></h2>
              <p class="user-username">@<span class="user-name"></span></p>
              <p class="user-email"></p>
              <div class="user-status">
                <span class="status-indicator"></span>
                <span class="status-text"></span>
              </div>
            </div>
          </div>
          <div class="user-bio-location">
            <p class="user-bio"></p>
            <p class="user-location"></p>
          </div>
        </div>
				
				<div class="tournaments-section">
					<h2><i class="bi bi-trophy"></i> Tournaments</h2>
					<div class="tournaments-list"></div>
				</div>
        <div class="recent-games-section">
          <h2><i class="bi bi-controller"></i> Last Games</h2>
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
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .user-info-section,
        .recent-games-section,
        .tournaments-section {
          background-color: #141414;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #0A84FF;
        }

        .user-basic-info h2 {
          margin: 0;
          font-size: 2em;
        }

        .user-username {
          color: #A0A0A0;
          margin: 5px 0;
        }

        .user-email {
          color: #A0A0A0;
          margin-bottom: 10px;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #30D158;
        }

        .status-text {
          color: #A0A0A0;
        }

        .user-bio-location {
          margin-top: 20px;
        }

        .user-bio,
        .user-location {
          font-size: 1em;
          color: #A0A0A0;
          margin: 5px 0;
        }

        .recent-games-section h2,
        .tournaments-section h2 {
          font-size: 1.8em;
          margin-bottom: 20px;
          border-bottom: 1px solid #3A3A3C;
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .games-list,
        .tournaments-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .game-item,
        .tournament-item {
          background-color: #2C2C2E;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.3s ease;
        }

				.game-item {
					border: 1px solid #2C2C2E;
					background-color: #141414;
				}
				
        .tournament-item:hover {
					cursor: pointer;
					-webkit-box-shadow:inset 0px 0px 0px 1px #0071e3;
					-moz-box-shadow:inset 0px 0px 0px 1px #0071e3;
					box-shadow:inset 0px 0px 0px 1px #0071e3;
        }

        .game-info,
        .tournament-info {
          display: flex;
          flex-direction: column;
        }

        .game-title,
        .tournament-title {
          font-size: 1.2em;
          font-weight: 500;
          color: #FFFFFF;
        }

        .game-date,
        .tournament-date {
          font-size: 0.9em;
          color: #A0A0A0;
        }

        .game-status,
        .tournament-status {
          font-size: 1em;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 5px;
          color: #FFFFFF;
        }

        .game-status.victory {
          color: #34C759;
        }

        .game-status.loss {
          color: #FF3B30;
        }

        .game-status.in-progress,
        .tournament-status.in-progress {
          color: #000000;
        }

        .game-status.waiting {
          background-color: #0A84FF;
        }

        .game-status.cancelled {
          background-color: #8E8E93;
        }

        .game-status.ready {
          background-color: #30D158;
        }

        .tournament-status.join-lobby {
          background-color: #0a84ff;
        }

        .tournament-status.view {
          background-color: #5E5CE6;
        }

        @media (max-width: 768px) {
          .user-header {
            flex-direction: column;
            align-items: center;
          }

          .user-basic-info {
            text-align: center;
          }

          .game-item,
          .tournament-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .game-status,
          .tournament-status {
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
      Toast.error(error.message || "Failed to fetch data.");
    }
  }

  renderUserInfo(userInfo) {
    const userNameElement = document.querySelector('.user-name');
    const userFirstNameElement = document.querySelector('.user-first-name');
    const userLastNameElement = document.querySelector('.user-last-name');
    const userAvatarElement = document.querySelector('.user-avatar');
    const userBioElement = document.querySelector('.user-bio');
    const userLocationElement = document.querySelector('.user-location');
    const userEmailElement = document.querySelector('.user-email');
    const statusIndicatorElement = document.querySelector('.status-indicator');
    const statusTextElement = document.querySelector('.status-text');

    userNameElement.textContent = userInfo.username;
    userFirstNameElement.textContent = userInfo.first_name || '';
    userLastNameElement.textContent = userInfo.last_name || '';
    userAvatarElement.src = userInfo.profile.avatar || 'default-avatar.png';
    userBioElement.textContent = userInfo.profile.bio || 'No bio available.';
    userLocationElement.textContent = userInfo.profile.location || 'Location not specified.';
    userEmailElement.textContent = userInfo.email || '';

		statusTextElement.textContent = 'Online';
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

      const opponent = game.match_players.find(player => player.username !== window.auth.username);
      const opponentName = opponent ? opponent.username : 'Unknown';

      const gameTitle = document.createElement('div');
      gameTitle.classList.add('game-title');
      gameTitle.textContent = `Against ${opponentName}`;

      const gameDate = document.createElement('div');
      gameDate.classList.add('game-date');
      const date = new Date(game.created_at);
      gameDate.textContent = `On ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

      gameInfoDiv.appendChild(gameTitle);
      gameInfoDiv.appendChild(gameDate);

      const gameStatus = document.createElement('div');
      gameStatus.classList.add('game-status');

      const currentUserId = window.auth.id;

      if (game.state === 'finished') {
        if (game.winner === currentUserId) {
          gameStatus.textContent = 'Victory';
          gameStatus.classList.add('victory');
        } else {
          gameStatus.textContent = 'Loss';
          gameStatus.classList.add('loss');
        }
      } else if (game.state === 'in_progress') {
        gameStatus.textContent = 'In Progress';
        gameStatus.classList.add('in-progress');
      } else if (game.state === 'cancelled') {
        gameStatus.textContent = 'Cancelled';
        gameStatus.classList.add('cancelled');
      } else if (game.state === 'ready') {
        gameStatus.textContent = 'Ready';
        gameStatus.classList.add('ready');
      } else if (game.state === 'waiting') {
        gameStatus.textContent = 'Waiting';
        gameStatus.classList.add('waiting');
      }

      gameItem.appendChild(gameInfoDiv);
      gameItem.appendChild(gameStatus);
      gamesListElement.appendChild(gameItem);
    });
  }

  async getUrlTournament(tournamentID) {
    let isInTournament = false;
    try {
      const { data } = await api.request.get(`/tournaments/${tournamentID}/`);
      const participants = data.participants;
      participants.forEach(participant => {
        if (participant.player === window.auth.id) {
          isInTournament = true;
        }
      });
    } catch (error) {
      // Handle error if necessary
    }

    return isInTournament
      ? `/tournaments/lobby/${tournamentID}`
      : `/tournaments/join/${tournamentID}`;
  }

  async renderTournamentInfo(tournamentInfo) {
    const tournamentListElement = document.querySelector('.tournaments-list');

    if (!tournamentInfo || tournamentInfo.length === 0) {
      tournamentListElement.innerHTML = '<p>No tournaments found.</p>';
      return;
    }

    for (const tournament of tournamentInfo) {
      const tournamentItem = document.createElement('div');
      tournamentItem.classList.add('tournament-item');

      const tournamentInfoDiv = document.createElement('div');
      tournamentInfoDiv.classList.add('tournament-info');

      const tournamentTitle = document.createElement('div');
      tournamentTitle.classList.add('tournament-title');
      tournamentTitle.textContent = tournament.name;

      const tournamentDate = document.createElement('div');
      tournamentDate.classList.add('tournament-date');
      const date = new Date(tournament.created_at);
      tournamentDate.textContent = `On ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

      tournamentInfoDiv.appendChild(tournamentTitle);
      tournamentInfoDiv.appendChild(tournamentDate);

      const tournamentStatus = document.createElement('div');
      tournamentStatus.classList.add('tournament-status');

      if (tournament.winner === null) {
        tournamentStatus.textContent = 'In Progress';
        tournamentStatus.classList.add('in-progress');
      } else {
        tournamentStatus.textContent = `Winner: ${tournament.winner}`;
        tournamentStatus.classList.add('victory');
      }

      const actionButton = document.createElement('div');
      actionButton.classList.add('tournament-status');

      if (tournament.state === 'waiting') {
        actionButton.textContent = 'Join Lobby';
        actionButton.classList.add('join-lobby');
        const url = await this.getUrlTournament(tournament.id);
        tournamentItem.setAttribute('data-url', url);
      } else {
        actionButton.textContent = 'View';
        actionButton.classList.add('view');
        tournamentItem.setAttribute('data-url', `/tournaments/${tournament.id}/`);
      }

      const tournamentEnd = document.createElement('div');
      tournamentEnd.classList.add('tournament-end', 'd-flex', 'gap-2');
      tournamentEnd.appendChild(tournamentStatus);
      tournamentEnd.appendChild(actionButton);

      tournamentItem.appendChild(tournamentInfoDiv);
      tournamentItem.appendChild(tournamentEnd);
      tournamentListElement.appendChild(tournamentItem);
    }
  }

  async script() {
    const userInfo = await this.getInfo('me/');
    const gameInfo = await this.getInfo('games/');
    const tournamentInfo = await this.getInfo('tournaments/');

    if (userInfo) {
      this.renderUserInfo(userInfo);
    }

    if (gameInfo) {
      this.renderGameInfo(gameInfo);
    }

    if (tournamentInfo) {
      await this.renderTournamentInfo(tournamentInfo);
      document.querySelectorAll('.tournament-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.getAttribute('data-url');
          window.router.push(url);
        });
      });
    }
  }
}

customElements.define('dashboard-component', Dashboard);