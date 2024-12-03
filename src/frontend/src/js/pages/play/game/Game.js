import { Client } from './components/Client.js';
import { UI } from './components/UI/UI.js';
import { PingManager } from './components/PingManager.js';
import { Scene } from './components/Scene/Scene.js';
import { Controller } from './components/Controller.js';
import { ServerData } from './components/Scene/ServerData.js';

export default class Game {
    constructor(settings) {
        this.settings = settings;
        this.container = document.getElementById(settings.container);

        this.serverData = null;
        this.client = null;
        this.pingManager = null;
        this.ui = null;
        this.controller = null;
        this.scene = null;

        this.init();
    }

    init() {
        this.serverData = new ServerData(this);
        this.client = new Client(this, this.settings.gameId);
        this.pingManager = new PingManager(this.client);
        this.ui = new UI(this);
        this.controller = new Controller(this);
        this.scene = new Scene(this);
    }
    
    start() {
        this.client.connect();
        this.scene.start();
    }

    stop() {
        if (this.client) this.client.disconnect();
        if (this.pingManager) this.pingManager.stop();
        if (this.scene) this.scene.stop();
    }
}