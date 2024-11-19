import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";

export class Sidebar extends Component {
    content() {
        return (/*html*/`
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>Notifications</h2>
            </div>
            <div id="wrapper-notif"></div>
        </div>
        `);
    }

    get_notif_component(notif) {
        const friendlyDate = this.get_simple_date(notif.created_at);
        const id = notif.id;
        const title = notif.event_type;
        const message = notif.data.message;
        const primary_action = notif.action?.primary;
        const secondary_action = notif.action?.secondary;
        const isRead = notif.isRead;

        return (/*html*/`
        <div class="notification ${isRead ? 'read' : 'unread'}" data-id="${id}">
				<div class="notification-header">
                <strong class="notification-title">${title}</strong>
                ${!isRead ? '<span class="badge-unread"></span>' : ''}
								${isRead ? '<i  class="delete-notif check-check" data-lucide="check-check"></i>' : ''}
                <small class="notification-time">${friendlyDate}</small>
								<i data-lucide="x" class="delete-notif" data-id="${id}" style="cursor: pointer; z-index:34;"></i>
            </div>
            <div class="notification-body">
                <p>${message}</p>
            </div>
            ${primary_action || secondary_action ? `
            <div class="notification-actions">
                ${primary_action ? `<button class="action btn-primary" data-action="${primary_action.url}">${primary_action.label}</button>` : ''}
                ${secondary_action ? `<button class="action btn-secondary" data-action="${secondary_action.url}">${secondary_action.label}</button>` : ''}
            </div>
            ` : ''}
            ${!isRead ? `
            <div class="notification-mark-read">
                <button class="mark-as-read" data-id="${id}">Mark as Read</button>
            </div>
            ` : ''}
        </div>
        `);
    }

    style() {
        return (/*css*/`
        <style>
            /* Sidebar Styles */
						.sidebar {
								width: min(600px, 100vw);
								height: 100vh;
								background-color: #000;
								color: #f2f2f7;
								padding: 24px;
								box-sizing: border-box;
								overflow: hidden; /* Assure que le contenu déborde à l'intérieur */
								display: flex;
								flex-direction: column;
						}

						.sidebar-header {
								margin-bottom: 24px;
						}

						.sidebar-header h2 {
								margin: 0;
								font-size: 24px;
								font-weight: 700;
						}

						/* Notification Wrapper */
						#wrapper-notif {
								flex: 1; /* Prend tout l'espace disponible */
								overflow-y: scroll; /* Active le défilement vertical */
								-ms-overflow-style: none;  /* IE and Edge */
								scrollbar-width: none;  /* Firefox */
						}

						#wrapper-notif::-webkit-scrollbar {
								display: none; /* Chrome, Safari, Opera */
						}


            /* Notification Styles */
            .notification {
                position: relative;
                background-color: #1c1c1e;
                color: #f2f2f7;
                padding: 16px;
                margin-bottom: 12px;
                border-radius: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }

            .notification-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }

            .notification-title {
                font-size: 16px;
                font-weight: 600;
            }
						
						.check-check{
							height: 20px;
							margin-left: 2px;
						}

            .notification-time {
                font-size: 12px;
                color: #999;
                margin-left: 8px;
								margin-left: auto;
            }

            .badge-unread {
                width: 8px;
                height: 8px;
                background-color: #ff9500;
                border-radius: 50%;
                margin-left: 8px;
								z-index: 10;
            }

            .delete-notif {
                position: relative;
                color: #f2f2f7;
                opacity: 0.7;
                transition: opacity 0.2s;
            }

            .delete-notif:hover {
                opacity: 1;
            }

            .notification-body {
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 12px;
            }

            .notification-actions {
                display: flex;
                gap: 8px;
            }

            .notification-actions .action {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 8px;
                background-color: #2c2c2e;
                color: #f2f2f7;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .notification-actions .action:hover {
                background-color: #3a3a3c;
            }

            .notification-actions .btn-primary {
                background-color: #0a84ff;
            }

            .notification-actions .btn-primary:hover {
                background-color: #0a84ff;
                opacity: 0.9;
            }

            .notification-mark-read .mark-as-read {
                padding: 8px 0px;
                border: none;
                border-radius: 8px;
                background-color: transparent;
                color: #0a84ff;
                font-size: 14px;
                cursor: pointer;
                transition: color 0.2s;
            }

            .notification-mark-read .mark-as-read:hover {
                color: #66aaff;
            }
        </style>
        `);
    }

    async fill_notif() {
        const response = await api.request.get('notifications/');
        const wrapperNotif = document.getElementById("wrapper-notif");
        const notifications = Object.values(response.data);

        notifications.forEach((notif) => {
            const notifElement = document.createElement('div');
            notifElement.innerHTML = this.get_notif_component(notif);
            wrapperNotif.appendChild(notifElement);
        });
    }

    async delete_notif(id) {
        try {
            const response = await api.request.delete(`notifications/${id}/`);
            console.log(`Notification ${id} deleted`, response);

            // Remove the notification from the DOM
            const notifElement = document.querySelector(`[data-id="${id}"]`);
            if (notifElement) {
                notifElement.remove();
            }
        } catch (error) {
            console.error(`Failed to delete notification ${id}:`, error);
        }
    }

    async mark_as_read(id) {
        try {
            const response = await api.request.post(`notifications/${id}/mark-as-read/`);
            console.log(`Notification ${id} marked as read`, response);

            // Update the notification in the DOM
            const notifElement = document.querySelector(`[data-id="${id}"]`);
            if (notifElement) {
                notifElement.classList.remove('unread');

                // Remove the unread badge
                const badge = notifElement.querySelector('.badge-unread');
                if (badge) {
                    badge.remove();
                }

                // Remove the mark-as-read button
                const button = notifElement.querySelector('.mark-as-read');
                if (button) {
                    button.remove();
                }
            }
        } catch (error) {
            console.error(`Failed to mark notification ${id} as read:`, error);
        }
    }

    bind_action_buttons() {
        document.querySelectorAll('.action').forEach((element) => {
            element.addEventListener('click', async (e) => {
                const target = e.target;
                const actionUrl = target.getAttribute('data-action');
                try {
                    console.log('Performing action:', actionUrl);
                    const response = await api.request.post(actionUrl);
                    console.log('Action response:', response);
                } catch (error) {
                    console.error('Error performing action:', error);
                }
            });
        });
    }

    get_simple_date(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    script() {
        this.fill_notif().then(() => {
            // Event listener for delete buttons
            document.getElementById("wrapper-notif").addEventListener("click", (e) => {
                if (e.target.classList.contains("delete-notif")) {
                    const id = e.target.getAttribute("data-id");
                    this.delete_notif(id);
                }

                if (e.target.classList.contains("mark-as-read")) {
                    const id = e.target.getAttribute("data-id");
                    this.mark_as_read(id);
                }
            });

            this.bind_action_buttons();
            lucide.createIcons();
        });
    }
}

customElements.define("sidebar-component", Sidebar);