import { Component } from "../utils/Component.js";

export class MainLayout extends Component {
	
	constructor (){
		super();
		this.showSidebar = false;
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


	script (){
		document.addEventListener('toggleSidebar', () => {
			this.showSidebar = !this.showSidebar;
			console.log("toggleSidebar", this.showSidebar);
			this.disconnectedCallback();
			this.render();
		});
	
	}
}

customElements.define("main-layout", MainLayout);