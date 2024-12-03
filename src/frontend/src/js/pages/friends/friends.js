import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";
import { Toast } from "../../provider/toast-provider.js";

export class Friends extends Component {
  content() {
    this.classList.add("h-100");
    return /*html*/ `
      <main-layout>
        <div class="friends-page container py-5">
				
          <h1 class="text-center mb-5">Friends</h1>

					<section class="send-request-section mb-5">
            <h2 class="section-title">Send a Friend Request</h2>
            <form id="sent-request-form" class="invite-form mt-4">
              <div class="input-group mb-3">
                <input type="text" id="username" class="form-control" placeholder="Enter username" required />
                <button type="submit" class="btn btn-primary">Send</button>
              </div>
            </form>
          </section>

					<hr class="separator my-2" />

          <!-- Friends Section -->
          <section class="friends-section">
            <h2 class="section-title">Your Friends</h2>
            <div class="friends-list row gy-4"></div>
          </section>

          <hr class="separator my-2" />

          <!-- Friend Requests Section -->
          <section class="friend-requests-section mb-5">
            <h2 class="section-title">Friend Requests</h2>
            <div class="friends-list-receive row gy-4"></div>
          </section>


         
        </div>
      </main-layout>
    `;
  }

  style() {
    return /*css*/ `
      <style>

        .friends-page {
          color: #fff;
          
        }

				section {
				background-color: #1c1c1e;
					border-radius: 12px;
					padding: 1.5rem;
			}

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #fff;
          border-bottom: 2px solid #333;
          padding-bottom: 0.5rem;
        }

        .separator {
          border-color: #333;
        }

        /* Friend Card Styles */
        .friend-card {
          background-color: #1c1c1e;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background-color 0.3s, transform 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

				.friend-card-link {
					cursor: pointer;
				}

				.friend-card-link {
					text-decoration: none;
					color: inherit;
					display: block;
				}

        .friend-card:hover {
          background-color: #2c2c2e;
          transform: translateY(-4px);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
        }

        .friend-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .friend-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #0a84ff;
        }

        .friend-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .friend-username {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .friend-status {
          font-size: 0.9rem;
          font-weight: 500;
          color: #8e8e93;
        }

        .friend-actions button {
          margin-left: 0.5rem;
        }

        /* Input Group Styles */
				
				.input-group .form-control {
          background-color: #1c1c1e;
          color: #fff;
          border: 1px solid #3a3a3c;
          border-radius: 8px;
          padding: 0.75rem 1rem;
			
        }

        .input-group .form-control:focus {
          background-color: #2c2c2e;
          border-color: #0a84ff;
          box-shadow: none;
        }

        .input-group .btn {
          background-color: #0a84ff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
					width: 30%;
        }

        .input-group .btn:hover {
          background-color: #0066cc;
        }

        /* Buttons */
        .btn-primary {
          background-color: #0a84ff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
        }

        .btn-primary:hover {
          background-color: #0066cc;
        }

        .btn-success {
          background-color: #30d158;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
        }

        .btn-success:hover {
          background-color: #248f42;
        }

        .btn-danger {
          background-color: #ff375f;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
        }

        .btn-danger:hover {
          background-color: #d62246;
        }

        /* Muted Text */
        .text-muted {
          color: #8e8e93 !important;
        }

				/* Online Status */
				.online-status-active {
					background-color: #30d158;
				}

				.online-status-inactive {
					background-color: #8e8e93;
				}

      </style>
    `;
  }

  // ======= Utils =========
  getFriendName(friend) {
    const username = window.auth.username;
    return friend.user1 === username ? friend.user2 : friend.user1;
  }

  getFriendAvatar(friend) {
    const username = window.auth.username;
    return friend.user1 === username ? friend.user2_avatar : friend.user1_avatar;
  }

	getOnlineFriend(friend) {
		const username = window.auth.username;
		return friend.user1 === username ? friend.is_online_user2 : friend.is_online_user1;
	}
		

  // ======= Friends =========
  getFriendsComponent(friend) {
    const friendComponent = document.createElement("div");
    friendComponent.classList.add("col-12", "col-md-6");
    friendComponent.innerHTML = `
			<div class="friend-card">
				<link-component href="/user/${this.getFriendName(friend)}" class="friend-card-link">
					<div class="friend-info">
						<div class="friend-avatar">
							<img src="${this.getFriendAvatar(friend)}" alt="Avatar">
						</div>
						<div>
							<div class="d-flex align-items-center gap-2">
								<div class="friend-username">${this.getFriendName(friend)}</div>
                ${this.getOnlineFriend(friend) ? `<div class="online-status-active badge badge-pill badge-success">Online</div>` : `<div class="online-status-inactive badge badge-pill badge-secondary">Offline</div>`}
              </div>
							<div class="friend-status">${friend.status}</div>
						</div>
					</div>
				</link-component>

        <div class="friend-actions">
          <button data-id="${friend.id}" class="btn btn-danger remove-friend-btn">Remove</button>
        </div>
      </div>
    `;

    const removeBtn = friendComponent.querySelector(".remove-friend-btn");
    removeBtn.addEventListener("click", async (e) => {
			e.stopPropagation();
      e.preventDefault();
      const friendId = e.target.getAttribute("data-id");
      try {
        const { data, error } = await api.request.delete(`friends/${friendId}/delete/`);
        if (error) throw error;
        Toast.success("Friend removed");
        await this.fillFriends();
      } catch (error) {
        Toast.error(error.message);
      }
    });

    return friendComponent;
  }

  async fillFriends() {
    const friendsList = document.querySelector(".friends-list");
    friendsList.innerHTML = "";
    try {
      const { data, error } = await api.request.get("friends/");
      if (error) throw error;
      if (data.length === 0) {
        friendsList.innerHTML = `<p class="text-muted">You don't have any friends yet.</p>`;
      } else {
        data.forEach((friend) => {
          friendsList.appendChild(this.getFriendsComponent(friend));
        });
      }
    } catch (error) {
      Toast.error(error.message);
    }
  }

  // ======= Friend Requests Received =========
  getFriendsReceivedComponent(friend) {
    const friendComponent = document.createElement("div");
    friendComponent.classList.add("col-12", "col-md-6");

    friendComponent.innerHTML = `
      <div class="friend-card">
				<link-component href="/user/${this.getFriendName(friend)}" class="friend-card-link">
        <div class="friend-info">
          <div class="friend-avatar">
            <img src="${this.getFriendAvatar(friend)}" alt="Avatar">
          </div>
					<div class="d-flex justify-content-center gap-2 flex-column">
						<div class="friend-username">${this.getFriendName(friend)}</div>
						${this.getOnlineFriend(friend) ? `<div class="online-status-active badge badge-pill badge-success">Online</div>` : `<div class="online-status-inactive badge badge-pill badge-secondary">Offline</div>`}
					</div>
        </div>
				</link-component>
        <div class="friend-actions d-flex gap-2 align-items-center">
          <button accept-friends="${friend.id}" class="btn btn-success accept-friend-btn">Accept</button>
          <button decline-friends="${friend.id}" class="btn btn-danger decline-friend-btn">Decline</button>
        </div>
      </div>
    `;

    const acceptBtn = friendComponent.querySelector(".accept-friend-btn");
    acceptBtn.addEventListener("click", async (e) => {
			e.stopPropagation();
			e.preventDefault();
      const friendId = e.target.getAttribute("accept-friends");
      try {
        const { data, error } = await api.request.post(`friends/${friendId}/accept/`);
        if (error) throw error;
        await this.fillFriendsReceive();
        await this.fillFriends();
      } catch (error) {
        Toast.error(error.message);
      }
    });

    const declineBtn = friendComponent.querySelector(".decline-friend-btn");
    declineBtn.addEventListener("click", async (e) => {
			e.stopPropagation();
			e.preventDefault();
      const friendId = e.target.getAttribute("decline-friends");
      try {
        const { data, error } = await api.request.post(`friends/${friendId}/reject/`);
        if (error) throw error;
        await this.fillFriendsReceive();
      } catch (error) {
        Toast.error(error.message);
      }
    });

    return friendComponent;
  }

  async fillFriendsReceive() {
    const friendsList = document.querySelector(".friends-list-receive");
    friendsList.innerHTML = "";
    try {
      const { data, error } = await api.request.get("friends/received/");
      if (error) throw error;
      if (data.length === 0) {
        friendsList.innerHTML = `<p class="text-muted">You have no friend requests.</p>`;
      } else {
        data.forEach((friend) => {
          friendsList.appendChild(this.getFriendsReceivedComponent(friend));
        });
      }
    } catch (error) {
      Toast.error(error.message);
    }
  }

  script() {
    this.fillFriends();
    this.fillFriendsReceive();

    window.router.addListener(document, "notification", () => {
      this.fillFriends();
      this.fillFriendsReceive();
    });

    const sentRequestForm = document.querySelector("#sent-request-form");
    sentRequestForm.addEventListener("submit", async (e) => {
      e.preventDefault();
			e.stopPropagation();
      const username = document.querySelector("#username").value;
      try {
        const { data, error } = await api.request.post("friends/", { user2: username });
        if (error) throw error;
        Toast.success("Friend request sent");
        this.fillFriends();
        document.querySelector("#username").value = "";
      } catch (error) {
        Toast.error(error.message);
      }
    });
  }
}

customElements.define("friends-page", Friends);