import { BaseScreen } from "./BaseScreen.js";

export class CanceledScreen extends BaseScreen {
    enter() {
        // add modals 
		this.element = document.createElement("div");
		this.element.id = "canceled-screen";
		this.game.container.appendChild(this.element);

		this.element.innerHTML = (/*html*/`
			<div class="canceled-screen position-absolute top-50 start-50 translate-middle p-2 border rounded bg-background w-50">
				<div class="canceled-screen__content d-flex flex-column gap-2 align-items-center">
					<h3 style="font-size: 2rem;">Match Canceled</h3>
					<link-component href="/play" type="button" class="btn btn-primary">Play Again</link-component>
				</div>
			</div>
		`);
    }
}