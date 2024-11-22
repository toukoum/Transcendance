import { Client } from './components/Client.js';
import { StateManager } from './components/StateManager/StateManager.js';
import { UI } from './components/UI/UI.js';
import { PingManager } from './components/PingManager.js';
import { Scene } from './components/Scene/Scene.js';
import { Controller } from './components/Controller.js';

export default class Game {
    constructor(settings) {
        this.settings = settings;
        this.container = document.getElementById(settings.container);

        this.client = new Client(this, settings.gameId);
        this.pingManager = new PingManager(this.client);
        this.pingManager.start();
        this.ui = new UI(this);
        this.stateManager = new StateManager(this);
        this.controller = new Controller(this);

        this.scene = new Scene(this);
    }

    start() {
        this.scene.start();
    }
}