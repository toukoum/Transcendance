export function getToastStyle() {
	return (/*css*/`
			<style>

			/* Custom Toast Styles */
			p{
				margin: 0;
			}

			.custom-toast {
					background-color: #1c1c1e;
					color: #f2f2f7;
					border-radius: 12px;
					padding: 16px;
					margin-bottom: 12px;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
					overflow: hidden;
			}

			/* Couleurs selon le type de toast */
			.toast-success {
					border: 1px solid #30D158; /* Vert Apple */
			}

			.toast-danger {
					border: 1px solid #FF453A; /* Rouge Apple */
			}

			.toast-info {
					border: 1px solid #0A84FF; /* Bleu Apple */
			}

			.toast-notification {
					border: 1px solid #FFD60A; /* Jaune Apple */
			}

			.custom-toast .toast-header {
					background-color: transparent;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-bottom: 5px;
					margin-bottom: 5px;
			}

			.custom-toast .toast-header .me-auto {
					font-size: 16px;
					font-weight: 600;
			}

			.custom-toast .toast-header small {
					font-size: 12px;
					color: #999;
			}

			.custom-toast .toast-body {
					font-size: 14px;
					line-height: 1.5;
			}

			.custom-toast .toast-actions {
					display: flex;
					gap: 8px;
			}

			.custom-toast .toast-actions .action {
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

			.custom-toast .toast-actions .action:hover {
					background-color: #3a3a3c;
			}

			.custom-toast .toast-actions .btn-primary {
					background-color: #0a84ff;
			}

			.custom-toast .toast-actions .btn-primary:hover {
					background-color: #006edc;
			}

			.custom-toast .toast-actions .btn-secondary {
					background-color: #2c2c2e;
			}

			.custom-toast .toast-actions .btn-secondary:hover {
					background-color: #3a3a3c;
			}
			</style>
	`);
}