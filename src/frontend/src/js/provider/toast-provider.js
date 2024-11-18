import { Component } from "../utils/Component.js";
import { api } from "../utils/api/Api.js";

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

	script() {
		const toastContainer = this.querySelector("#toast-container");

		// Listen for success toasts
		window.addEventListener('toast.success', (event) => {
			this.showToast(toastContainer, event.detail.message, 'success');
		});

		// Listen for error toasts
		window.addEventListener('toast.error', (event) => {
			this.showToast(toastContainer, event.detail.message, 'danger');
		});

		// Listen for info toasts
		window.addEventListener('toast.info', (event) => {
			this.showToast(toastContainer, event.detail.message, 'info', event.detail.title);
		});

		// Listen for notification action toasts
		window.addEventListener('toast.notificationAction', (event) => {
			this.showToastAction(
				toastContainer,
				event.detail.message,
				event.detail.primary,
				event.detail.label_primary,
				event.detail.secondary,
				event.detail.label_secondary,
				event.detail.event_type
			);
		});
	}


	showToastAction(toastContainer, message, primary, label_primary, secondary, label_secondary, event_type) {
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.classList.add('bg-primary-subtle');
		toast.classList.add('text-white');
		toast.setAttribute('role', 'alert');
		toast.setAttribute('aria-live', 'assertive');
		toast.setAttribute('aria-atomic', 'true');

		// Toast content
		toast.innerHTML = `
			<div class="toast-header bg-dark text-white">
				<strong class="me-auto">${event_type}</strong>
				<small>Just now</small>
				<button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				<p>${message}</p>
				<div class="d-flex justify-content-start mt-2 gap-2">
					<button class="action btn btn-primary btn-sm me-2" data-action="${primary}">${label_primary}</button>
					<button class="action btn btn-secondary btn-sm" data-action="${secondary}">${label_secondary}</button>
				</div>
			</div>
		`;

		toastContainer.appendChild(toast);

		const bootstrapToast = new bootstrap.Toast(toast);
		bootstrapToast.show();

		// Add click event to the buttons
		toast.querySelectorAll('.action').forEach((element) => {
			element.addEventListener('click', (e) => this.makeAction(e, bootstrapToast));
		});

		// Clear the toast after X seconds
		setTimeout(() => {
			bootstrapToast.hide();
			toastContainer.removeChild(toast);
		}, AUTO_DISMISS);
	}

	async makeAction(e, bootstrapToast) {
		try {
			const target = e.target;
			const actionUrl = target.getAttribute('data-action');
			console.log('Making action:', actionUrl);

			const response = await api.request.post(actionUrl);
			console.log('Response:', response);
		} catch (error) {
			console.error('Error making action:', error);
		}
		bootstrapToast.hide();
	}

	showToast(toastContainer, message, type, title = null) {
		// Create new toast element
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.classList.add(type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-primary');
		toast.classList.add('text-white');
		toast.setAttribute('role', 'alert');
		toast.setAttribute('aria-live', 'assertive');
		toast.setAttribute('aria-atomic', 'true');

		// Toast content
		toast.innerHTML = `
			<div class="toast-header">
				${title ? `<strong class="me-auto">${title}</strong>` : ''}
				<button type="button" class="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
			</div>
			<div class="toast-body">
				${message}
			</div>
		`;

		toastContainer.appendChild(toast);

		const bootstrapToast = new bootstrap.Toast(toast);
		bootstrapToast.show();

		// Clear the toast after X seconds
		setTimeout(() => {
			bootstrapToast.hide();
			toastContainer.removeChild(toast);
		}, AUTO_DISMISS);
	}

	// Static method to show a success toast
	static success(message) {
		window.dispatchEvent(new CustomEvent('toast.success', {
			detail: { message }
		}));
	}

	// Static method to show an error toast
	static error(message) {
		window.dispatchEvent(new CustomEvent('toast.error', {
			detail: { message }
		}));
	}

	// Static method to show an info toast
	static info(message, title = null) {
		window.dispatchEvent(new CustomEvent('toast.info', {
			detail: { 
				message,
				title
			}
		}));
	}

	static notificationAction(notification) {
		if (!notification?.data?.action?.primary || !notification?.data?.action?.secondary) {
			console.error('Invalid notification structure:', notification);
			return;
		}

		const primary = notification.data.action.primary;
		const secondary = notification.data.action.secondary;

		let event_type = "Notification";

		if (notification.data.event_type === 'friend_request') {
			event_type = 'Friend Request';
		}else if (notification.data.event_type === 'game_request') {
			event_type = 'Game Request';
		}

		window.dispatchEvent(new CustomEvent('toast.notificationAction', {
			detail: {
				message: notification.data.data.message,
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
