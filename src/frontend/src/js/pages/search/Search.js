import { Component } from "../../utils/Component.js";
import { Toast } from "../../provider/toast-provider.js";
import { api } from "../../utils/api/Api.js";

export class Search extends Component {
    constructor() {
        super("main-layout");
    }

    content() {
        this.classList.add("h-100");
        return (`
            <div class="search-container">
                <h1 class="title">Find Friends</h1>
                <form class="search-form" id="searchForm">
                    <input type="text" id="searchInput" placeholder="Search by username..." required />
                    <button type="submit">Search</button>
                </form>
                <div class="separator"></div>
                <h2 class="subtitle">Search Results</h2>
                <div class="search-results" id="searchResults">
                    <!-- User cards will be injected here -->
                </div>
            </div>
        `);
    }

    style() {
        return /*css*/ `
      		<style>

            .search-container {
								padding-top: 20px;
                margin: 0 auto;
								width: 80%;
								border-radius: 10px;
            }

            .title {
                text-align: center;
                font-size: 2.5rem;
                margin-bottom: 20px;
            }

            #searchForm {
                display: flex;
                justify-content: center;
                margin-bottom: 30px;
            }

            #searchForm input {
                width: 60%;
                padding: 12px 20px;
                border: none;
                border-radius: 25px 0 0 25px;
                outline: none;
                font-size: 1rem;
                background-color: #1e1e1e;
                color: #f0f0f0;
            }

            #searchForm button {
                padding: 12px 20px;
                border: none;
                border-radius: 0 25px 25px 0;
                background-color: #007aff;
                color: #fff;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            #searchForm button:hover {
                background-color: #005bb5;
            }

            .separator {
                height: 1px;
                background-color: #333;
                margin: 30px 0;
            }

            .subtitle {
                font-size: 1.8rem;
                margin-bottom: 20px;
                text-align: center;
            }

            .search-results {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: center;
            }

            .card {
                background-color: #1e1e1e;
                border-radius: 15px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                width: 250px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                transition: transform 0.2s;
            }

            .card:hover {
                transform: translateY(-5px);
            }

            .avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
                margin-bottom: 15px;
                border: 2px solid #007aff;
            }

            .username {
                font-size: 1.2rem;
                font-weight: bold;
                margin-bottom: 10px;
                color: #fff;
            }

            .bio {
                font-size: 0.9rem;
                text-align: center;
                margin-bottom: 10px;
                color: #ccc;
            }

            .status {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }

            .status .indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 8px;
                background-color: #4caf50; /* Online */
            }

            .status.offline .indicator {
                background-color: #f44336; /* Offline */
            }

            .friend-status {
                font-size: 0.9rem;
                color: #ccc;
            }

            @media (max-width: 600px) {
                .search-form input {
                    width: 100%;
                }

                .card {
                    width: 100%;
                }
            }

						.badge-friend {
							color: #495057;
						}
					</style>
        `;
				
    }

    getUserCard(user) {
        const card = document.createElement("div");

        // Determine online status class
        const statusClass = user.profile.is_online ? "" : "offline";

        // Determine friendship status display
        let friendStatusText = "";
        switch (user.friend_status) {
            case "accepted":
                friendStatusText = "Friend";
                break;
            case "pending":
                friendStatusText = "Friend Request Sent";
                break;
            case "none":
            default:
                friendStatusText = "Not Friends";
        }

        // Set button based on friendship status

        card.innerHTML = `
					<a href=${`user/${user.username}`} class="card text-decoration-none">
            <img src="${user.profile.avatar}" alt="${user.username}'s avatar" class="avatar" />
            <div class="username">${user.username}</div>
            <div class="bio">${user.profile.bio || "No bio available."}</div>
            <div class="status ${statusClass}">
                <span class="indicator"></span>
                <span>${user.profile.is_online ? "Online" : "Offline"}</span>
            </div>
            <div class="friend-status badge-friend">${friendStatusText}</div>
					</a>
					
        `;


        return card;
    }


    async fillResults(query) {
        const searchResults = document.querySelector("#searchResults");
        searchResults.innerHTML = ""; // Clear previous results
        try {
            const { data, error } = await api.request.get(`search/?q=${encodeURIComponent(query)}`);
            if (error) throw error;
            if (!data.length) {
                searchResults.innerHTML = `<p class="no-results">No results found.</p>`;
                return;
            }
            data.forEach((result) => {
                searchResults.appendChild(this.getUserCard(result));
            });
        } catch (error) {
            Toast.error(error.message);
            console.error(error);
        }
    }

    refreshResults() {
        const query = document.querySelector("#searchInput").value.trim();
        if (query) {
            this.fillResults(query);
        }
    }

    script() {
        const searchForm = document.querySelector("#searchForm");
        const searchInput = document.querySelector("#searchInput");

        // Handle form submission
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                this.fillResults(query);
            }
        });

        const urlQuery = new URLSearchParams(window.location.search).get("q");
        if (urlQuery) {
            searchInput.value = urlQuery;
            this.fillResults(urlQuery);
        }
    }
}

customElements.define("search-page", Search);