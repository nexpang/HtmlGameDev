import { Game } from '/TETRIS/Game.js';
import { NextBlock } from '/TETRIS/NextBlock.js';

export class Player {
    constructor() {
        this.blockSet = [
            [
                [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
                [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }]
            ], // 작대기
            [
                [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
                [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }],
                [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 },],
                [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 },]
            ],
            [
                [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }],
                [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
                [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },],
                [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 },]
            ],
            [
                [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
            ],
            [
                [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
                [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
            ],
            [
                [{ x: 0, y: -1 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }],
                [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }],
                [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 },],
                [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },]
            ],
            [
                [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
                [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }]
            ]
        ]
        this.colorSet = ["#0000e8", "#00e800", "#00e8e8", "#e89b00", "#e8e800", "#9900e7", "#e80000"]

        this.blockSeq = [];
        let temp = [];
        for (let i = 0; i < this.blockSet.length; i++) {
            temp.push(i);
        }
        for (let i = 0; i < this.blockSet.length; i++) {
            let idx = Math.floor(Math.random() * temp.length);
            this.blockSeq.push(temp[idx]);
            temp.splice(idx, 1);
        }

        this.idx = 0;
        this.currentBlock = this.blockSeq[this.idx];
        this.nextBlock = this.blockSeq[this.idx + 1];
        this.currentRot = 0;

        this.x = 0;
        this.y = 0;
        this.initPosition();
        this.setBlockData(true, this.colorSet[this.currentBlock]);

        this.nextBlockCanvas = new NextBlock();
        this.nextBlockCanvas.setNextBlock(this.blockSet[this.nextBlock][0], this.colorSet[this.nextBlock]);
    }

    render(ctx) {
        this.nextBlockCanvas.render();
    }

    initPosition() {
        this.x = 4;
        this.y = 0;
        this.currentRot = 0;
        if (this.currentBlock != 3 && this.currentBlock != 4 && this.currentBlock != 6) {
            this.y = 1;
        }
    }
    getNextBlockSet() {
        this.idx = (this.idx + 1) % this.blockSeq.length;
        let nextIdx = (this.idx + 1) % this.blockSeq.length;
        this.currentBlock = this.blockSeq[this.idx];
        this.nextBlock = this.blockSeq[nextIdx];

        this.nextBlockCanvas.setNextBlock(this.blockSet[this.nextBlock][0], this.colorSet[this.nextBlock]);
        this.initPosition();
        if (!this.checkPossible()) {
            Game.instance.setGameOver();
        }
    }

    moveLeft() {
        this.setBlockData(false)
        this.x--;
        if (!this.checkPossible()) {
            this.x++;
        }
        this.setBlockData(true, this.colorSet[this.currentBlock])
    }

    moveRight() {
        this.setBlockData(false)
        this.x++;
        if (!this.checkPossible()) {
            this.x--;
        }
        this.setBlockData(true, this.colorSet[this.currentBlock])

    }

    rotate() {
        this.setBlockData(false)
        let temp = this.currentRot;
        this.currentRot = (this.currentRot + 1) % this.blockSet[this.currentBlock].length;
        if (!this.checkPossible()) {
            if (this.x == 0) {
                this.x++;
                if (!this.checkPossible()) {
                    this.x--;
                    this.currentRot = temp;
                }
            }
            else if (this.x == 9) {
                this.x--;
                if (!this.checkPossible()) {
                    this.x++;
                    this.currentRot = temp;
                }
            }
            else {
                this.currentRot = temp;
            }
        }
        this.setBlockData(true, this.colorSet[this.currentBlock])
    }

    moveDown() {
        this.setBlockData(false)
        this.y++;
        if (!this.checkPossible()) {
            this.y--;
            this.setBlockData(true, this.colorSet[this.currentBlock])
            this.getNextBlockSet();
            // 줄지우기 알고리즘
            Game.instance.checkLine();
            this.setBlockData(true, this.colorSet[this.currentBlock])

            return false;
        }
        else {
            this.setBlockData(true, this.colorSet[this.currentBlock])
            return true;
        }
    }

    straightDown() {
        while (this.moveDown()) {

        }
    }

    setBlockData(fill, color = "#fff") {
        const arr = Game.instance.arr;

        for (let i = 0; i < this.blockSet[this.currentBlock][this.currentRot].length; i++) {
            let data = this.blockSet[this.currentBlock][this.currentRot][i];

            arr[this.y + data.y][this.x + data.x].setBlockData(fill, color);
        }
    }

    checkPossible() {
        const arr = Game.instance.arr;
        for (let i = 0; i < this.blockSet[this.currentBlock][this.currentRot].length; i++) {
            let data = this.blockSet[this.currentBlock][this.currentRot][i];
            if (this.y + data.y < 0 || this.x + data.x < 0 || this.y + data.y >= arr.length || this.x + data.x >= arr[0].length) {
                return false;
            }

            if (arr[this.y + data.y][this.x + data.x].fill)
                return false;
        }

        return true;
    }
}