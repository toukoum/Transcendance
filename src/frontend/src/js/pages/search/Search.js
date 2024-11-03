import { Component } from "../../utils/Component.js";

export class Search extends Component {
	constructor() {
		super("main-layout");
	}
	content() {
		return (`
			<h1>Search</h1>
			<p>This is the Search page</p>
		`);
	}
}

customElements.define("search-page", Search);