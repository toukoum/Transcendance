import { Component } from "../utils/Component.js";

const AUTO_DISMISS = 6000;

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
    }

    showToast(toastContainer, message, type) {
        // Create new toast element
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
        toast.classList.add('text-white');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        // Toast content
        toast.innerHTML = `
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
}

customElements.define("toast-provider", Toast);
