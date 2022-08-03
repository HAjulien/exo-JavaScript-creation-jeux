/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0

let ravens = [];
class Raven{
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'images/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 70 + 70;
    }
    update(deltaTime){
        if (this.y < 0 || this.y > canvas.height - this.height){
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y -= this.directionY;
        if(this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime;

        if (this.timeSinceFlap > this.flapInterval){
            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
        //console.log(deltaTime);
    }
    draw(){
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

function drawScore(){
    ctx.fillStyle = 'white'
}



//const raven = new Raven(); verification avec 1 seul element

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let deltaTime =timestamp - lastTime;
    lastTime = timestamp;
    //console.log(timestamp);
    timeToNextRaven += deltaTime;
    //console.log(deltaTime); periodique event
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        //console.log(ravens);
    }
    //console.log(timestamp); probleme la premiere valeur est undefined
    // raven.update();
    // raven.draw();

    //array literal []  ... spread operator  particul class expense
    [...ravens].forEach(object => object.update(deltaTime));
    [...ravens].forEach(object => object.draw());

    //on crée un nouveau tableau filtré sur markedForDeletion = false
    ravens = ravens.filter(object => !object.markedForDeletion);
    //console.log(ravens);
    
    requestAnimationFrame(animate)
}

//pour regler lepb timestamp undefined, on defini une valeur de départ de 0
animate(0)