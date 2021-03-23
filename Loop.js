let canvas = document.querySelector("#gameCanvas");
// 캔버스를 가져오기
let ctx = canvas.getContext("2d");

let x = 0;
let y = 0;
let speed = 100;
let frame = 60;

let width = 40;
let height = 40;

let enemyList = [
    {x:500, y:60, w:30, h:100}
]

let eSpeed = [200, 500, 600]
let ex = [500, 100, 300];
let ey = [60, 80, 200];
let eWidth = [30, 50, 43];
let eHeight = [100, 80, 100];
let eDerection = [1 , 1, 1];

let img = new Image();
img.src = "/player.png";

let check = [false];
let rx = 0;
let ry = 0;

let ketArry = [];

document.addEventListener("keydown", function (e) {
    ketArry[e.keyCode] = true;
})
document.addEventListener("keyup", function (e) {
    ketArry[e.keyCode] = false;
})
function update() {
    for (let i = 0; i < ey.length; i++) {
        rx = x;
        ry = y;
        if (check == false) {
            if (ketArry[37] && x > 0) {
                x -= speed * 1 / frame;
            }
            if (ketArry[38] && y > 0) {
                y -= speed * 1 / frame;
            }
            if (ketArry[39] && x < 960 - width) {
                x += speed * 1 / frame;
            }
            if (ketArry[40] && y < 480 - height) {
                y += speed * 1 / frame;
            }
        }
        if (!(x <= ex[i] + eWidth[i] && y <= ey[i] + eHeight[i] && x + width >= ex[i] && y + height >= ey[i])) {
            check = false;
        } else {
            x = rx;
            y = ry;

            x = 0;
            y = 0;
            check = true;
        }
        if (ey[i] + eHeight[i] > 480) {
            eDerection[i] = -1;
        } else if (ey[i] < 0) {
            eDerection[i] = 1;
        }
        ey[i] += eDerection[i] * eSpeed[i] * 1 / frame;
    }

}
function render() {
    ctx.clearRect(0, 0, 960, 480);
    //ctx.fillRect(x, y, width, height);
    ctx.drawImage(img, x, y, width, height);
    for(let i = 0; i< ey.length; i++){
        ctx.fillRect(ex[i], ey[i], eWidth[i], eHeight[i]);
    }
}

setInterval(function () {
    update();
    render();
}, 1 / frame);
//시간간격동안 함수를 실행;