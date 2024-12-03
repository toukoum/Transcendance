import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";

export class User extends Component {
  constructor() {
    super("main-layout");
  }

  content() {
    this.classList.add("h-100");
    return /*html*/ `
      <div class="user-page container py-5">
        <!-- User Information Section -->
        <div class="user-info-section mb-5" id="my-user-info-section">
        </div>
        
        <!-- Recent Matches Section -->
        <div class="recent-games-section">
          <h2 class="section-title">Recent Matches</h2>
          <div class="matches-list row gy-4" id="matchesList">
        </div>
      </div>
    `;
  }

  style() {
    return /*css*/ `
      <style>
        :root {
          --color-card: #1c1c1e;
          --color-card-hover: #2c2c2e;
          --color-text: #fff;
          --color-primary: #0a84ff;
          --color-primary-hover: #0066cc;
          --color-success: #30d158;
          --color-success-hover: #248f42;
          --color-danger: #ff375f;
          --color-danger-hover: #d62246;
          --color-muted: #8e8e93;
          --color-border: #333;
          --color-secondary: #5a5a5a;
        }

				.recent-games-section{
					background-color: #2C2C2E;
					border-radius: 10px;
					padding: 20px;

				}

        .user-info-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .user-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--color-primary);
          margin-bottom: 1.5rem;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-username {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .user-fullname {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--color-muted);
          margin-bottom: 1rem;
        }

        .user-bio {
          font-size: 1rem;
          font-weight: 400;
          margin-bottom: 1rem;
        }

        .user-location {
          font-size: 1rem;
          font-weight: 400;
          color: var(--color-muted);
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--color-text);
          border-bottom: 2px solid var(--color-border);
          padding-bottom: 0.5rem;
        }

        .separator {
          border-color: var(--color-border);
        }

        /* Recent Matches Styles */
        .match-card {
          background-color: var(--color-card);
          border-radius: 12px;
          padding: 1rem;
          transition: background-color 0.3s, transform 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .match-card:hover {
          background-color: var(--color-card-hover);
          transform: translateY(-4px);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
        }

        .match-info {
          margin-bottom: 1rem;
        }

        .match-date {
          font-size: 0.9rem;
          color: var(--color-muted);
        }

        .match-details {
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-text);
        }

        .match-state {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .badge-state.finished {
          background-color: var(--color-success);
        }

        .badge-state.in_progress {
          background-color: var(--color-primary);
        }

        .badge-state.pending {
          background-color: var(--color-secondary);
        }

        .text-muted {
          color: var(--color-muted) !important;
        }

				.badge-success{
					background-color: var(--color-success);
				}

				.badge-secondary{
					background-color: var(--color-secondary);
				}
      </style>
    `;
  }

  // ======= Utility Functions =========
  getFriendName(matchPlayers) {
    const username = window.auth.username;
    const opponent = matchPlayers.find(player => player.username !== username);
    return opponent ? opponent.username : "Unknown";
  }

  getMatchWinner(match) {
    if (match.state !== "finished") return "In Progress";
    return match.winner_username;
  }

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // ======= Populate User Information =========
  async fillUserInfos() {
    const username = this.getAttribute("username");
    try {
      const { data, error } = await api.request.get(`users/${username}/`);
      if (error) throw error;

      const userInfoSection = document.getElementById("my-user-info-section");
      userInfoSection.innerHTML = `
        <div class="user-avatar">
          <img src="${data.profile.avatar}" alt="${data.username}'s Avatar">
        </div>
				${data.profile.is_online ? '<span class="badge badge-success">Online</span>' : '<span class="badge badge-secondary">Offline</span>'}
        <div class="user-username">${data.username}</div>
        <div class="user-fullname">${this.capitalize(data.first_name)} ${this.capitalize(data.last_name)}</div>
        <div class="user-bio">${data.profile.bio || ''}</div>
        <div class="user-location"><i class="bi bi-geo-alt-fill"></i> ${data.profile.location || 'Not specified'}</div>
      `;

      // Populate recent matches
      const matchesList = document.getElementById("matchesList");
      matchesList.innerHTML = ""; // Clear existing matches

      if (data.matches && data.matches.length > 0) {
        // Sort matches by finished_at descending
        const sortedMatches = data.matches.sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at));

        sortedMatches.forEach((match) => {
          const matchCard = document.createElement("div");
          matchCard.classList.add("col-12", "col-md-6");

          const opponentName = this.getFriendName(match.match_players);
          const matchDate = this.formatDate(match.finished_at || match.started_at);
          const matchState = match.state.replace('_', ' '); // e.g., 'in_progress' to 'in progress'
          const matchWinner = this.getMatchWinner(match);
          const player = match.match_players.find(p => p.username === data.username);
          const opponent = match.match_players.find(p => p.username !== data.username);

          matchCard.innerHTML = `
            <div class="card match-card h-100">
              <div class="card-body d-flex flex-column">
                <div class="match-info">
                  <h5 class="card-title">${opponentName}</h5>
                  <p class="card-text"><strong>Date:</strong> ${matchDate}</p>
                  <p class="card-text"><strong>State:</strong> <span class="badge badge-state ${match.state}">${this.capitalize(matchState)}</span></p>
                </div>
                <div class="mt-auto">
                  <p class="card-text"><strong>Score:</strong> ${player ? player.username : ''} ${player ? player.score : '0'} - ${opponent ? opponent.score : '0'} ${opponentName}</p>
                  <p class="card-text"><strong>Winner:</strong> ${matchWinner}</p>
                </div>
              </div>
            </div>
          `;

          matchesList.appendChild(matchCard);
        });
      } else {
        matchesList.innerHTML = `<p class="text-muted">No recent matches.</p>`;
      }
    } catch (error) {
      Toast.error(error.message);
      window.router.push("/");
    }
  }

  // ======= Helper Function to Capitalize Words =========
  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  script() {
    this.fillUserInfos();
  }
}

customElements.define("user-page", User);