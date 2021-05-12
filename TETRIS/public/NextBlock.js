import { Block } from "./Block.js";

export class NextBlock {
    constructor() {
        this.arr = [];
        for (let i = 0; i < 4; i++) {
            this.arr[i] = [];
            for (let j = 0; j < 4; j++) {
                this.arr[i][j] = new Block(j, i, 24);
            }
        }

        this.nextCanvas = document.querySelector("#nextCanvas");
        this.nextCtx = this.nextCanvas.getContext("2d");
    }

    render() {
        this.nextCtx.clearRect(0, 0, 100, 100);
        this.arr.forEach(row => row.forEach(col => col.render(this.nextCtx)));
    }

    setNextBlock(data, color) {
        //data = [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
        let x = 1;
        let y = 1;

        if (Math.min(...data.map(x => x.x)) + x < 0)
            x++;
        if (Math.min(...data.map(x => x.y)) + y < 0)
            y++;
        if (Math.max(...data.map(x => x.x)) + x > 3)
            x--;
        if (Math.max(...data.map(x => x.y)) + y > 3)
            y--;

        this.arr.forEach(row => row.forEach(col => col.setBlockData(false, "#fff")));
        for (let i = 0; i < data.length; i++) {
            let point = data[i];
            this.arr[y + point.y][x + point.x].setBlockData(true, color);
        }
    }
}