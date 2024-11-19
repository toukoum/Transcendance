import { Component } from "../utils/Component.js";

export class MainLayout extends Component {
	
	constructor (){
		super();
		this.showSidebar = true;  // État pour afficher ou cacher la sidebar
	}

	content() {
		return (/*html*/`
		<div class="d-flex h-100 bg-background-main">
			${this.showSidebar ? '<sidebar-component></sidebar-component>' : ''}
			<div class="d-flex flex-column h-100 w-100 bg-background-main">
				<header-component></header-component>
				${this.childrens()}
			</div>
		</div>
		<toast-provider/>
		`);
	}

	update() {
    this.render();  // Assure-toi que cette méthode actualise le DOM
	}

	script (){
		document.addEventListener('toggleSidebar', () => {
			console.log("Event reached document");
		});
	
		this.addEventListener('toggleSidebar', () => {
			console.log("SHOW");
			this.showSidebar = !this.showSidebar;
			this.update();
		});
	}
}

customElements.define("main-layout", MainLayout);