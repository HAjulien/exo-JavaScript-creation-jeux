//pour avoir les raccourci canvas

/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;

const numberOfEnnemies = 20;
const ennemiesArray = [];


let gameFrames = 0;



class Ennemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'images/ennemis/ennemy2.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight/ 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        //math random renvoie toujours un chiffre avec virgule doncimpossible === 0, il faut arrondir
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        //mouvement en cloche
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 7

    }
    update() {
        this.x-= this.speed;
        this.y+= this.curve * Math.sin(this.angle);
        this.angle+= this.angleSpeed;
        //mouvement infinie 
        if(this.x + this.width < 0) this.x = canvas.width
        if(gameFrames % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw() {
        //ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for(let i =0; i < numberOfEnnemies; i++){
    ennemiesArray.push(new Ennemy())
}


function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ennemiesArray.forEach(ennemy => {
        ennemy.update();
        ennemy.draw();
    });
    gameFrames++; 
    requestAnimationFrame(animate);
}

animate()