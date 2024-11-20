import { Component } from "../utils/Component.js";
import { api } from "../utils/api/Api.js";
import { getToastStyle } from "./toast-style.js";

const AUTO_DISMISS = 60000;

export class Toast extends Component {
    content() {
        const position = this.getAttribute('position') || 'bottom-end';

        let positionClass = '';
        switch (position) {
            case 'top-start':
                positionClass = 'top-0 start-0';
                break;
            case 'top-end':
                positionClass = 'top-0 end-0';
                break;
            case 'bottom-start':
                positionClass = 'bottom-0 start-0';
                break;
            case 'bottom-end':
                positionClass = 'bottom-0 end-0';
                break;
            default:
                positionClass = 'bottom-0 end-0';
        }

        return (/*html*/`
            <div class="toast-container position-fixed ${positionClass} p-3" id="toast-container">
            </div>
        `);
    }

    style() {
        return getToastStyle();
    }

    script() {
        const toastContainer = this.querySelector("#toast-container");

        window.addEventListener('toast.success', (event) => {
            this.showToast(toastContainer, {
                message: event.detail.message,
                type: 'success',
            });
        });

        window.addEventListener('toast.error', (event) => {
            this.showToast(toastContainer, {
                message: event.detail.message,
                type: 'danger',
            });
        });

        window.addEventListener('toast.info', (event) => {
            this.showToast(toastContainer, {
                message: event.detail.message,
                type: 'info',
                title: event.detail.title,
            });
        });

        window.addEventListener('toast.notificationAction', (event) => {
            this.showToast(toastContainer, {
                message: event.detail.message,
                type: 'notification',
                title: event.detail.event_type,
                primaryAction: {
                    url: event.detail.primary,
                    label: event.detail.label_primary,
                },
                secondaryAction: {
                    url: event.detail.secondary,
                    label: event.detail.label_secondary,
                },
            });
        });
    }

    showToast(toastContainer, options) {
        const {
            message,
            type = 'info',
            title = null,
            primaryAction = null,
            secondaryAction = null,
        } = options;

        const toast = document.createElement('div');
        toast.classList.add('toast', 'custom-toast', `toast-${type}`);
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        // Contenu du toast
        let toastHeader = '';
        if (title) {
            toastHeader = `
                <div class="toast-header">
                    <strong class="me-auto">${title}</strong>
                    <small>Just now</small>
                    <button type="button" class="btn-close"" aria-label="Close"></button>
                </div>
            `;
        }

        let actions = '';
        if (primaryAction || secondaryAction) {
            actions = `
                <div class="toast-actions mt-2">
                    ${primaryAction ? `<button class="action btn-primary" data-action="${primaryAction.url}">${primaryAction.label}</button>` : ''}
                    ${secondaryAction ? `<button class="action btn-secondary" data-action="${secondaryAction.url}">${secondaryAction.label}</button>` : ''}
                </div>
            `;
        }

        toast.innerHTML = `
            ${toastHeader}
            <div class="toast-body">
                <p>${message}</p>
                ${actions}
            </div>
        `;

        toastContainer.appendChild(toast);

        const bootstrapToast = new bootstrap.Toast(toast);
        bootstrapToast.show();

        // Fonctionnalité du bouton de fermeture
        const btnClose = toast.querySelector('.btn-close');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                bootstrapToast.hide();
                toastContainer.removeChild(toast);
            });
        }

        // Événements des boutons d'action
        toast.querySelectorAll('.action').forEach((element) => {
            element.addEventListener('click', (e) => this.makeAction(e, bootstrapToast, toast));
        });

        // Disparaît automatiquement après X secondes
        setTimeout(() => {
            bootstrapToast.hide();
            toastContainer.removeChild(toast);
        }, AUTO_DISMISS);

        lucide.createIcons();
    }

    async makeAction(e, bootstrapToast, toast) {
        try {
            const target = e.target;
            const actionUrl = target.getAttribute('data-action');
            console.log('Making action:', actionUrl);

            const response = await api.request.post(actionUrl);
            console.log('Response:', response);
        } catch (error) {
            console.error('Error making action:', error);
        }
        // Optionnellement cacher le toast après l'action
        // bootstrapToast.hide();
        // toast.parentNode.removeChild(toast);
    }

    // Méthodes statiques pour déclencher les toasts
    static success(message) {
        window.dispatchEvent(new CustomEvent('toast.success', {
            detail: { message }
        }));
    }

    static error(message) {
        window.dispatchEvent(new CustomEvent('toast.error', {
            detail: { message }
        }));
    }

    static info(message, title = null) {
        window.dispatchEvent(new CustomEvent('toast.info', {
            detail: { 
                message,
                title
            }
        }));
    }

    static notificationAction(notification) {
        if (!notification?.action?.primary || !notification?.action?.secondary) {
            console.error('Invalid notification structure:', notification);
            return;
        }

        const primary = notification.action.primary;
        const secondary = notification.action.secondary;

        let event_type = "Notification";

        if (notification.event_type === 'friend_request') {
            event_type = 'Friend Request';
        } else if (notification.event_type === 'game_request') {
            event_type = 'Game Request';
        }

        window.dispatchEvent(new CustomEvent('toast.notificationAction', {
            detail: {
                message: notification.data.message,
                primary: primary.url,
                label_primary: primary.label,
                secondary: secondary.url,
                label_secondary: secondary.label,
                event_type: event_type,
            }
        }));
    }
}

customElements.define("toast-provider", Toast);