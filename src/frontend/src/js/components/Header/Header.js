import { Component } from "../../utils/Component.js";

export class Header extends Component {
	content() {
			const user = window.auth;
			return (/*html*/`
			<header class="sticky-top d-flex flex-wrap align-items-center justify-content-center justify-content-md-between px-3 py-2 bg-background header-header">
					
					<div class="d-flex gap-2 col-md-3 mb-2 mb-md-0">
							<button class="navbar-toggler" type="button">
								<i color="#595959" data-lucide="menu"></i>
							</button>
							
							<a href="/" class="navbar-brand d-flex align-items-center">
								<img src="../../../../public/logo42.png" alt="Logo" width="30" height="30" class="d-inline-block align-top me-2">
								PongGame
							</a>
					</div>


					<ul class="nav col-12 col-md-auto mb-2 justify-content-center align-items-center mb-md-0 gap-4" style="pointer-events: auto;">
							<li><link-component href="/" class="nav-link px-2">Home</link-component></li>
							<li><link-component href="/play" class="nav-link btn-play d-flex align-items-center gap-2">
									PLAY
									<i data-lucide="play" class="icon-play" style="width: 16px; height: 16px;"></i>
							</link-component></li>
							<li><link-component href="/friends" class="nav-link px-2">Friends</link-component></li>

					</ul>
					<test-notif></test-notif>
					<div class="col-md-3 justify-content-end d-flex gap-2">
							${user ? (/*html*/`<usernav-component></usernav-component>`) : (/*html*/`
									<link-component type="button" class="login-btn me-2" href="/auth/login">Login</link-component>
									<link-component type="button" class="signup-btn" href="/auth/signup">Sign-up</link-component>
							`)}
					</div>
				
			</header>
			`);
		}

		style	() {
			return (/*css*/`

				
				<style>

					.login-btn a{
						color: #fff;
						border-radius: 20px;
						text-decoration: none;
						padding: 1rem 1.5rem;
					}

					.signup-btn a{
						color: #fff;
						background-color: #0A84FF;
						border-radius: 20px;
						text-decoration: none;
						padding: 1rem 1.5rem;
					}


					.navbar-brand img {
							filter: brightness(0) invert(1); /* Ensures the logo is visible on dark background */
					}
					.header-header {
						border-bottom: 1px solid #1c1c1e;
					}

					.btn-play a{
						color: #fff;
						border: 1px solid #0A84FF;
						border-radius: 20px;
						padding: 1rem 3rem;
					}

					.btn-play:hover icon-play {
						color: #ffc400;
					}
					
					.btn-play:hover {
						opacity: 0.9;
					}

				
			</style>
			`);
		}
		
		toggleSidebar() {
				console.log("DIspatch")
				document.dispatchEvent(new Event('toggleSidebar'));
		}
	
	
		script() {
			lucide.createIcons();
			const toggleButton = this.querySelector('.navbar-toggler');
			if (toggleButton) {
					toggleButton.addEventListener('click', this.toggleSidebar.bind(this));
			} else {
					console.error("Le bouton de toggle n'a pas été trouvé dans le DOM.");
			}

	}
}

customElements.define("header-component", Header);
