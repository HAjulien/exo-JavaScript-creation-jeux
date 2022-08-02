//pour avoir les raccourci canvas

/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;

const numberOfEnnemies = 50;
const ennemiesArray = [];


let gameFrames = 0;



class Ennemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'images/ennemies/ennemy3.png';
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight/ 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        //math random renvoie toujours un chiffre avec virgule doncimpossible === 0, il faut arrondir
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        //mouvement en cloche
        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 0.5 + 0.5;
        //this.curve = Math.random() * 200 + 50;
    }
    update() {
        this.x = canvas.width/2 * Math.sin(this.angle * Math.PI/90) + (canvas.width/2 - this.width/2) ;
        this.y =  canvas.height/2 * Math.cos(this.angle * Math.PI/270) + (canvas.height/2 - this.height/2) ;
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