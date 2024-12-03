export class Component extends HTMLElement {
	#rendered;
	#layout;
	constructor(layout = null) {
		super();
		this.#rendered = false;
		this.#layout = layout;
	}

	connectedCallback() {
		if (!this.#rendered) {
			this.render();
			this.#rendered = true;
			this.script();
			// this.replaceWith(...this.childNodes);
		}
	}

	disconnectedCallback() {
		this.innerHTML = "";
		this.#rendered = false;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.render();
	}

	adopterCallback() {
		this.render();
	}

	/**
	 * @brief Content for the component
	 */
	content() {
		return "";
	}

	/**
	 * @brief Style for the component
	 */
	style() {
		return "";
	}

	/**
	 * @brief Render the component
	 */
	render() {
		if (this.#layout) {
			return this.innerHTML = `
				<${this.#layout}>
					${this.content()}
					${this.style()}
				</${this.#layout}>
			`;
		}
		return this.innerHTML = this.style() + this.content();
	}

	/**
	 * @brief Post render script
	 */
	script() {
	}

	/**
	 * @brief Get the children of the component
	 */
	childrens() {
		return this.innerHTML;
	}
}