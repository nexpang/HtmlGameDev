class Bullet {
    constructor(player){
        this.rand;
        this.x;
        this.y;
        this.speed;
        this.r;
        this.color = 'rgba(230, 150, 30, 1)';
        this.drection = new Vector2(0,0);
        this.target = player;

        this.reset();
    }
    reset(){
        this.rand =Math.round(1+ Math.random()*3);
        this.speed = 100;
        this.r = 5;
        switch (this.rand){
            case 1://왼쪽
                this.x = 0;
                this.y = 50+Math.random()*300;
                break;
            case 2:// 위
                this.y = 0;
                this.x = 50+Math.random()*500;
                break;
            case 3://오른쪽
                this.x = 600
                this.y = 50+Math.random()*300;
                break;
            case 4://아래
                this.y = 400;
                this.x = 50 + Math.random()*500;
                break;
            default:
                this.x=0;
                this.y=0;
                break;
        }
        console.log(this.target);
        this.drection = new Vector2(this.target.x - this.x, this.target.y - this.y).normalized();
    }
    update(){
        this.x += this.drection.x *this.speed * 1/60;
        this.y += this.drection.y *this.speed * 1/60;
        if (this.x> 600||this.y>400||this.x+this.r<0||this.y+this.r<0)
        {
            this.reset();
        }
    }
    render(ctx){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}