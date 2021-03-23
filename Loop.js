let canvas = document.querySelector("#gameCanvas");
// 캔버스를 가져오기
let ctx = canvas.getContext("2d");

let x =0;
let y = 0;
let speed = 100;
let frame = 60;

let width = 40;
let height = 40;

let ex = 500;
let ey = 60;
let eWidth = 30;
let eHeight = 100;
let eDerection = 1;

let check = false;
let rx =0;
let ry =0;

let ketArry = [];

document.addEventListener("keydown", function(e){
    ketArry[e.keyCode] = true;
})
document.addEventListener("keyup", function(e){
    ketArry[e.keyCode] = false;
})
function update()
{
    rx = x;
    ry = y;
    if (check == false){
        if(ketArry[37] && x>0){
            x -= speed * 1/frame;
        }
        if(ketArry[38]&& y>0){
            y -= speed * 1/frame;
        }
        if(ketArry[39]&& x< 960-width){
            x += speed * 1/frame;
        }
        if(ketArry[40]&& y< 480-height){
            y += speed * 1/frame;
        }
    }
    if(!(x <= ex + eWidth && y <= ey + eHeight && x+width >= ex && y+height >= ey)){
        check = false;
    }else{
        x = rx;
        y = ry;
        
        x = 0;
        y = 0;
        check = true;
    }
    if(ey+eHeight > 480){
        eDerection = -1;
    }else if (ey< 0){
        eDerection = 1;
    }
    ey += eDerection*speed *1/frame;
        
}
function render()
{
    ctx.clearRect(0,0,960,480);
    ctx.fillRect(x,y,width,height);
    ctx.fillRect(ex,ey,eWidth,eHeight);
}

setInterval(function(){
    update();
    render();
}, 1/frame);
//시간간격동안 함수를 실행;