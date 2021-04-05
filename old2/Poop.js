class Poop{
    constructor(){
        this.x;
        this.y;
        this.speed;
        this.r;
        this.color = 'rgba(230, 150, 30, 0.5)';
        this.reset();
    }
    reset(){
        this.y = 0;
        this.x = 50 + Math.random()*400;
        this.speed = 50 + Math.random()*100;
        this.r = 5 + Math.random() * 5;
        this.color= 'rgba('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+',0.5)';
    }

    update(){
        this.y += this.speed * 1/60;
        if (this.y - this.r>800){
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