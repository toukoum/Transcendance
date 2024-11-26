import { Scene } from "../game/components/Scene/Scene.js";
import { ServerData } from "../game/components/Scene/ServerData.js";
import { UI } from "../game/components/UI/UI.js";
import { LocalRunner } from "./LocalRunner.js";

export default class GameLocal {
	constructor(settings) {
		this.settings = settings;
		this.container = document.getElementById(settings.container);

		this.serverData = new ServerData();
		this.localRunner = new LocalRunner(this);
		this.ui = new UI(this);
		this.scene = new Scene(this);
	}

	start() {
		this.scene.start();
	}
}