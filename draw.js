let btn = document.querySelector("#startBtn");
btn.addEventListener("click", function () {
    //alert("버튼 클릭");
    smyile();
});

let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

let cp = document.querySelector("#colorPicker");
let ls = document.querySelector("#lineSeter");

let isDown = false;
let x = 0;
let y = 0;
canvas.addEventListener("mousedown", function (e) {
    isDown = true;
    x = e.offsetX;
    y = e.offsetY;
});
canvas.addEventListener("mouseup", function (e) {
    isDown = false;
});
//ctx.clearRect(x,y,5,5);
canvas.addEventListener("mousemove", function (e) {
    if (!isDown)
        return;
    if (document.getElementById('drawRadio').checked) {
        ctx.strokeStyle = cp.value;
        ctx.lineCap = "round";
        ctx.lineWidth = ls.value;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (document.getElementById('removeRadio').checked) {
        if (ls.value == 0) {
            ls.value = 1;
        }
        ctx.clearRect(x, y, ls.value * 3, ls.value * 3);
    }

    x = e.offsetX;
    y = e.offsetY;
});


function smyile() {
    ctx.strokeStyle = "rgba(255,0,0,0.5)";
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";

    ctx.beginPath();
    ctx.moveTo(120, 200);
    ctx.lineTo(180, 130);
    ctx.lineTo(240, 200);
    ctx.moveTo(320, 200);
    ctx.lineTo(380, 130);
    ctx.lineTo(440, 200);

    ctx.moveTo(200, 250);
    ctx.lineTo(290, 320);
    ctx.lineTo(380, 250);

    ctx.closePath();        //끝 점을 시작 점으로 이어줌
    ctx.stroke();
    //ctx.fill();
}