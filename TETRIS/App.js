import { Game } from './Game.js';

class App {
    constructor() {
        this.init();
        this.debug();
        this.game = new Game();
    }

    init() {
        document.querySelector("#btnLogin").onclick = e => {
            let pc = document.querySelector(".page-container");
            pc.style.left = "-2048px";
        }
        document.querySelector("#btnStart").onclick = e => {
            this.game.start();
        }

    }

    debug() {
        document.querySelector("#btnLogin").click();
    }
}

window.onload = e => {
    let app = new App();
};