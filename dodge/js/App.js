class App{
    constructor(selector){
        this.objectList = [];
        this.backgroundImg = new Image();
        let playerImg = new Image();
        this.backgroundImg.src = "/dodge/images/bgmain.png";
        playerImg.src = "/dodge/images/mario.png";
        let p = new Player(300-10, 200-15, 200, 20, 30, playerImg);
        this.objectList.push(p);
        this.gameOver = false;
        this.time = 0;

        this.canvas = document.querySelector(selector);
        this.ctx = this.canvas.getContext("2d");
        
    }
    mainMenu(){
        let list = localStorage.getItem("list");

        if(list == null)
            list = [];
        else
            list = JSON.parse(list);

        clearInterval(this.interver);
        this.ctx.clearRect(0, 0, 600, 400);
        this.ctx.drawImage(this.backgroundImg, 0, 0, 600, 400);

        this.ctx.fillStyle = "#000";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`점수판`, 400, 35);
        this.ctx.font = "10px Arial";
        if (list.length>10){
            for(let i = 0; i< 10; i++){
                this.ctx.fillText(`이름 : ${list[i].name}  점수 : ${list[i].score}s  남길말 : ${list[i].msg}`, 400, 50+(i*15));
            }
        }else{
            for(let i = 0; i< list.length; i++){
                this.ctx.fillText(`이름 : ${list[i].name}  점수 : ${list[i].score}s  남길말 : ${list[i].msg}`, 400, 50+(i*15));
            }
        }
    }
    gameStart(){
        this.interver = setInterval(()=>{
            if(this.gameOver){

                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(0,0,600,400);
                this.ctx.fillStyle = 'rgba(255,255,255,1)';
                this.ctx.font = "80px Arial";

                this.ctx.fillText("Game Over",80,200);
                
                clearInterval(this.interver);
                document.querySelector("#popup").classList.add("on");
                document.getElementById("score").innerHTML = "점수 : "+Math.round(this.time*100)/100.0+"s";
                return;
            }
            this.update();
            this.render(this.ctx);
        }, 1000/60);
    }

    update(d){
        let p = this.objectList[0];

        if( Math.round(this.time*100)/100.0 % 5 == 0){
            for(let i = 0; i<5; i++){
                this.objectList.push(new Bullet(p));
            }
        }
        this.objectList.forEach( object => object.update());

        for(let i = 1; i< this.objectList.length; i++){
            if( p.checkCol(this.objectList[i]) ){
                this.gameOver = true;
            }
        }
        this.time += 1/60;
    }

    render(ctx){
        ctx.clearRect(0, 0, 600, 400);
        ctx.drawImage(this.backgroundImg, 0, 0, 600, 400);
        
        this.objectList.forEach( object => object.render(ctx));
        ctx.fillStyle = "#000";
        ctx.font = "25px Arial";
        ctx.fillText(Math.round(this.time*100)/100.0, 500, 50);
    }
}