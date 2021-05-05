import { Game } from './Game.js';

class App {
    constructor() {
        this.init();
        this.debug();
        this.game = new Game();
        Game.instance = this.game;
    }

    init() {
        document.querySelector("#btnLogin").onclick = e => {
            let pc = document.querySelector(".page-container");
            pc.style.left = "-2048px";
        }
        document.querySelector("#btnStart").onclick = e => {
            this.game.start();
        }
        document.querySelector("#btnStart").addEventListener("keydown", e => {
            e.preventDefault();
            return false;
        })
    }

    debug() {
        document.querySelector("#btnLogin").click();
    }
}

window.onload = e => {
    let app = new App();
};