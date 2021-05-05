import { Block } from '/TETRIS/Block.js';
import { Player } from '/TETRIS/Player.js';

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
    }

    addKeyEvent() {
        document.addEventListener("keydown", e => {
            if (this.player == null)
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
        this.time -= this.difficult * 500;
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(this.difficult * 500);
        this.arr.forEach(row => row.forEach(item => item.render(this.ctx)));
    }

    start() {
        if (this.frame != null) {
            clearInterval(this.frame);
        }
        this.frame = setInterval(() => {
            this.update();
            this.render();
        }, 1000 / 30);
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
                this.difficult++;
                this.lineRemove(i);
                i++;
            }
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