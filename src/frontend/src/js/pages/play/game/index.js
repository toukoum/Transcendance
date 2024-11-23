import { Client } from './components/Client.js';
import { StateManager } from './components/StateManager/StateManager.js';
import { UI } from './components/UI/UI.js';
import { PingManager } from './components/PingManager.js';
import { Scene } from './components/Scene/Scene.js';
import { Controller } from './components/Controller.js';
import { ServerData } from './components/Scene/ServerData.js';

export default class Game {
    constructor(settings) {
        this.settings = settings;
        this.container = document.getElementById(settings.container);

        this.serverData = new ServerData();
        this.client = new Client(this, settings.gameId);
        this.pingManager = new PingManager(this.client);
        this.ui = new UI(this);
        this.stateManager = new StateManager(this);
        this.controller = new Controller(this);
        this.scene = new Scene(this);
    }
    
    start() {
        this.client.connect();
        this.pingManager.start();
        this.scene.start();
    }
}