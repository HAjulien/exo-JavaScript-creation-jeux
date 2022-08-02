//pour avoir les raccourci canvas

/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;

const numberOfEnnemies = 10;
const ennemiesArray = [];

// const ennemyImage = new Image();     on peut le mettre dans le constructor de Ennemy
// ennemyImage.src = 'images/ennemies/ennemy1.png';
let gameFrames = 0;

//methode 1er avec repetition

/*
ennemy1 = {
    x: 0,
    y: 0,
    width: 200,
    height: 200,
}


class Ennemy {
    constructor(){
        this.x = 10;
        this.y = 50;
        this.width = 100;
        this.height = 100;
    }
}

const ennemy1 = new Ennemy();
const ennemy2 = new Ennemy();

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ennemy1.x++;
    ennemy1.y++;
    ennemy2.x+=0.5;
    ennemy2.y+=0.5;
    ctx.fillRect(ennemy1.x, ennemy1.y, ennemy1.width, ennemy1.height);
    ctx.fillRect(ennemy2.x, ennemy2.y, ennemy2.width, ennemy2.height);
    requestAnimationFrame(animate)
}

animate()
*/

//2eme methode sans repetition 

class Ennemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'images/ennemies/ennemy1.png';
        //this.speed = Math.random() * 4 - 2; on va faire voler sur petite zone
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight/ 2.5;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 2;
        //math random renvoie toujours un chiffre avec virgule doncimpossible === 0, il faut arrondir
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }
    update() {
        //this.x+= this.speed;
        this.x+= Math.random() * 5 - 2.5;
        this.y+= Math.random() * 5 - 2.5;
        //this.y+= this.speed;
        //animate sprites il y a 5 images on reduit la vitesse avec modulo 
        if(gameFrames % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }
    draw() {
        //ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

//const ennemy1 = new Ennemy();       pour créer plusieurs ennemies
for(let i =0; i < numberOfEnnemies; i++){
    ennemiesArray.push(new Ennemy())
}

//console.log(ennemiesArray);

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // ennemy1.update();
    // ennemy1.draw();

    ennemiesArray.forEach(ennemy => {
        ennemy.update();
        ennemy.draw();
    });
    gameFrames++; 
    requestAnimationFrame(animate);
}

animate()