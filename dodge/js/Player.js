class Player{
    constructor(x,y,speed,w,h,sprite){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.w = w;//너비
        this.h = h;//높이
        this.sprite = sprite;

        this.input = new InputSystem();
    }

    update(){
        if(this.input.getKeycode(37)&&this.x>0){
            this.x -= this.speed * (1/ 60);
        }
        if(this.input.getKeycode(38)&&this.y>0){
            this.y -= this.speed * (1/ 60);
        }
        if(this.input.getKeycode(39)&&this.x+this.w<600){
            this.x += this.speed * (1/ 60);
        }
        if(this.input.getKeycode(40) && this.y+this.h<400){
            this.y += this.speed * (1/ 60);
        }
    }

    render(ctx){
        ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);
    }

    checkCol(bullet){
        let px = this.x + this.w/ 2;
        let py = this.y + this.h /2;
        let d = Math.sqrt((bullet.x - px)*(bullet.x-px)+(bullet.y-py)*(bullet.y-py));
        return d < bullet.r + this.w /2;
    }
}