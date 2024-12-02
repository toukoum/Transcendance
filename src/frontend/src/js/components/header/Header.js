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
							<lint-component href="/" class="navbar-brand d-flex align-items-center">
								<img src="../../../../public/logo42.png" alt="Logo" width="30" height="30" class="d-inline-block align-top me-2">
								PongGame
							</lint-component>
					</div>


					<ul class="nav col-12 col-md-auto mb-2 justify-content-center align-items-center mb-md-0 gap-4" style="pointer-events: auto;">
							<li><link-component href="/" class="nav-link px-2">Home</link-component></li>
							<li><link-component href="/play" class="nav-link btn-play d-flex align-items-center gap-2">
									Play
									<i data-lucide="play" class="icon-play" style="width: 16px; height: 16px;"></i>
							</link-component></li>
							<li><link-component href="/friends" class="nav-link px-2">Friends</link-component></li>

					</ul>
					
					<div class="col-md-3 justify-content-end d-flex gap-2">
							${user ? `
							<form class="form-inline my-2 my-lg-0 search-form d-flex gap-2">
								<input class="form-control mr-sm-2" type="search" placeholder="Username" aria-label="Search">
								<button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
							</form>
							` : ""
							}

							${user ? (/*html*/`<usernav-component></usernav-component>`) : (/*html*/`
									<link-component type="button" class="btn btn-outline-primary me-2" href="/auth/login">Login</link-component>
									<link-component type="button" class="btn btn-primary" href="/auth/signup">Sign-up</link-component>
							`)}
					</div>
				
			</header>
			`);
		}

		style	() {
			return (/*css*/`

				
				<style>

					.navbar-brand img {
							filter: brightness(0) invert(1); /* Ensures the logo is visible on dark background */
					}
					.header-header {
						border-bottom: 1px solid #1c1c1e;
					}

					.btn-play{
						color: #fff;
						background: linear-gradient(to right, #2196f3, #9c27b0);
						border-radius: 10px;
						padding: .5rem 1rem;
						margin: 10px 0;
					}

					.btn-play:hover icon-play {
						color: #ffc400;
					}
					
					.btn-play:hover {
						opacity: 0.9;
					}

					.nav-link{
						cursor:pointer;
					}

				
			</style>
			`);
		}
		
		toggleSidebar() {
				document.dispatchEvent(new Event('toggleSidebar'));
		}
	
	
		script() {
			lucide.createIcons();
			const toggleButton = document.querySelector('.navbar-toggler');
			toggleButton?.addEventListener('click', this.toggleSidebar.bind(this));

			const searchForm = document.querySelector('.search-form');
			searchForm?.addEventListener('submit', (e) => {
					e.preventDefault();
					const searchValue = searchForm.querySelector('input[type="search"]').value;
					window.router.push(`/search?q=${searchValue}`);
			});

	}
}

customElements.define("header-component", Header);
