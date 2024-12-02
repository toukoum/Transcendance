import { Toast } from "../../provider/toast-provider.js";
import { Component } from "../../utils/Component.js";
import { api } from "../../utils/api/Api.js";

export class Sidebar extends Component {
    content() {
        return (/*html*/`
				
        <div class="sidebar" style="display:none;">
            <div class="sidebar-header">
                <h2>Notifications</h2>
								<button class="close-btn" aria-label="Fermer la barre latérale">
									<i data-lucide="x"></i>
								</button>
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

				const is_link_primary = notif.action?.primary?.is_link || false;
				const is_link_secondary = notif.action?.secondary?.is_link || false;

				return (/*html*/`
				<div class="notification ${isRead ? 'read' : 'unread'}" data-id="${id}">
					<div class="notification-header">
						<strong class="notification-title">${title}</strong>
						${!isRead ? '<span class="badge-unread"></span>' : '<i class="check-check bi bi-check"></i>'}
						<small class="notification-time">${friendlyDate}</small>
						<i class="bi bi-x cross-delete-notif" data-id="${id}" style="cursor: pointer; z-index:34;"></i>
					</div>
					<div class="notification-body">
							<p>${message}</p>
								</div>
								${primary_action || secondary_action ? `
								<div class="notification-actions">
                                    ${primary_action ? 
                                        (is_link_primary ? 
                                                `<a class="action btn-primary text-decoration-none text-center" href="${primary_action.url}">${primary_action.label}</a>` : 
                                                `<button class="make-action-notif action btn-primary" salam="${primary_action.url}">${primary_action.label}</button>`
                                        ) : ''
                                    }

                                    ${secondary_action ? 
                                        (is_link_secondary ? 
                                                `<a class="action btn-secondary text-decoration-none text-center" href="${secondary_action.url}">${secondary_action.label}</a>` : 
                                                `<button class="make-action-notif action btn-secondary" salam="${secondary_action.url}">${secondary_action.label}</button>`
                                        ) : ''
                                    }
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
            .sidebar {
                    width: min(600px, 100vw);
                    height: 100vh;
                    background-color: #000;
                    color: #f2f2f7;
                    padding: 24px;
                    box-sizing: border-box;
                    overflow: hidden;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
            }
						
            @media (max-width: 600px) {
                .sidebar {
                    position:absolute;
                    z-index: 20000;
                    top: 0;
                    left:0;
                }
            }
                            
            .close-btn {
                background: none;
                border: none;
                color: #f2f2f7;
                cursor: pointer;
                font-size: 24px;
                padding: 0;
                display: flex;
                align-items: center;
            }

            .close-btn i {
                width: 24px;
                height: 24px;
            }
            
            .cross-delete-notif{
                height: 20px;
            }



            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }

            .sidebar-header h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
            }

            /* Notification Wrapper */
            #wrapper-notif {
                    flex: 1;
                    overflow-y: scroll;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
            }

            .sidebar::-webkit-scrollbar {
                    display: none;
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

    

    async delete_notif(id) {
        try {
            const { data, error } = await api.request.delete(`notifications/${id}/`);
						if (error) throw error;
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
						const { data, error } = await api.request.post(`notifications/${id}/mark-as-read/`);
						if (error) throw error;

            const notifElement = document.querySelector(`[data-id="${id}"]`);
            if (notifElement) {
                notifElement.classList.remove('unread');

                const badge = notifElement.querySelector('.badge-unread');
                if (badge) {
                    badge.remove();
                }

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
        document.querySelectorAll('.make-action-notif').forEach((element) => {
            element.addEventListener('click', async (e) => {
                const target = e.target;
                const actionUrl = target.getAttribute('salam');
                try {
                    const response = await api.request.post(actionUrl);
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

		async fill_notif() {

			try{
				const { data, error } = await api.request.get('notifications/');
				if (error) throw error;
				const wrapperNotif = document.getElementById("wrapper-notif");
				wrapperNotif.innerHTML = "";
				const notifications = Object.values(data);
	
				notifications.forEach((notif) => {
						const notifElement = document.createElement('div');
						notifElement.innerHTML = this.get_notif_component(notif);
						wrapperNotif.appendChild(notifElement);
				});
	
				this.bind_action_buttons();
				lucide.createIcons();

				await new Promise((resolve) => setTimeout(resolve, 10000));

			} catch (error) {
				console.error('Failed to fetch notifications:', error);
				Toast.error('Failed to fetch notifications');
			}

		}

    script() {
				const sidebar = document.querySelector('.sidebar');
				lucide.createIcons();
                window.router.addListener(document,'toggleSidebar', () => {
                    if (sidebar.style.display === 'none') {
                        sidebar.style.display = 'block';
                    } else {
                        sidebar.style.display = 'none';
                    }
                }, true);

				const closeBtn = document.querySelector('.close-btn');

				closeBtn.addEventListener('click', () => {
					sidebar.style.display = 'none';
				});

				const wrapperNotif = document.getElementById("wrapper-notif");
				wrapperNotif.addEventListener('click', (e) => {
						if (e.target.matches('.cross-delete-notif')) {
								const id = e.target.getAttribute("data-id");
								this.delete_notif(id);
						}
		
						if (e.target.matches('.mark-as-read')) {
								const id = e.target.getAttribute("data-id");
								this.mark_as_read(id);
						}
				});


				this.fill_notif();

                window.router.addListener(document,'notification', () => {
                    this.fill_notif();
                }, true);
							
		}
}

customElements.define("sidebar-component", Sidebar);