import { Block } from '/Block.js';
import { Player } from '/Player.js';

export class Game {
    static instance = null;

    constructor() {
        this.canvas = document.querySelector("#gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.frame = null;
        this.player = null;
        this.arr = [];
        this.addKeyEvent();

        this.time = 2000;
        this.currentTime = 0;
        this.difficult = 0;

        this.gameOverPanel = document.querySelector("#gameOverBox");
        this.gameOver = false;
    }

    setGameOver() {
        this.gameOver = true;
        clearInterval(this.frame);

        this.gameOverPanel.classList.add("on");
        this.render();
    }

    addKeyEvent() {
        document.addEventListener("keydown", e => {
            if (this.player == null || this.gameOver)
                return;

            if (e.keyCode == 37) {
                this.player.moveLeft();
            }
            else if (e.keyCode == 39) {
                this.player.moveRight();
            }
            else if (e.keyCode == 40) {
                this.player.moveDown();
            }
            else if (e.keyCode == 38) {
                this.player.rotate();
            }
            else if (e.keyCode == 32) {
                this.player.straightDown();
            }
        });
    }

    update() {
        this.arr.forEach(row => row.forEach(item => item.update(1000 / 30)));

        this.currentTime += 1000 / 30;
        if (this.currentTime >= this.time) {
            this.currentTime = 0;
            this.player.moveDown();
        }
        if (JSON.parse(localStorage.getItem('highScore')) < (this.difficult * 100)) {
            localStorage.setItem('highScore', JSON.stringify((this.difficult * 100)));
        }
    }
    render() {
        const info = document.getElementById("info");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arr.forEach(row => row.forEach(item => item.render(this.ctx)));
        info.innerHTML = `최고점수 : ${localStorage.getItem('highScore')}<br>현재 점수 : ${this.difficult * 100}`

        this.player.render(this.ctx);
    }

    start() {
        if (JSON.parse(localStorage.getItem('highScore')) < (this.difficult * 100)) {
            localStorage.setItem('highScore', JSON.stringify((this.difficult * 100)));
        }
        if (this.frame != null) {
            clearInterval(this.frame);
        }
        this.frame = setInterval(() => {
            this.update();
            this.render();
        }, 1000 / 30);
        this.gameOver = false;
        this.gameOverPanel.classList.remove("on");
        this.arr = [];
        for (let i = 0; i < 20; i++) {
            let row = [];
            for (let j = 0; j < 10; j++) {
                row.push(new Block(j, i));
            }
            this.arr.push(row);
        }

        this.player = new Player();
        this.time = 2000;
        this.difficult = 0;
        //this.debug();
    }
    checkLine() {
        for (let i = this.arr.length - 1; i >= 0; i--) {
            let full = true;
            for (let j = 0; j < this.arr[i].length; j++) {
                if (!this.arr[i][j].fill) {
                    full = false;
                    break;
                }
            }

            if (full) {
                this.lineRemove(i);
                i++;
                this.addScore();
            }
        }
    }
    addScore() {
        this.difficult++;
        if (this.difficult % 5 == 0 && this.time > 500) {
            this.time -= 300;
            if (this.time <= 100)
                this.time = 100;
        }
    }
    lineRemove(from) {
        for (let i = from; i >= 1; i--) {
            for (let j = 0; j < this.arr[i].length; j++) {
                this.arr[i][j].copyBlockData(this.arr[i - 1][j]);
            }
        }
        for (let j = 0; j < this.arr[0].length; j++) {
            this.arr[0][j].setBlockData(false);
        }
    }
    debug() {
        let shape = 0;
        let count = this.player.blockSet[shape].length;
        let x = 5, y = 5;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < 4; j++) {
                this.arr[y + this.player.blockSet[shape][i][j].y][x + this.player.blockSet[shape][i][j].x].setBlockData(true, "#0000e8");
            }
        }
    }
}