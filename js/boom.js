/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];

//pour cibler dans le canvas lors d'un click
let canvasPosition = canvas.getBoundingClientRect();
//console.log(canvasPosition);

// ctx.fillStyle = 'white';          verification 
// ctx.fillRect(50, 50, 100, 150);

class Explosion {
    constructor(x,y){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth * 0.7;
        this.height = this.spriteHeight * 0.7;
        // this.x = x - this.width * 0.5;
        // this.y = y - this.height * 0.5;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'images/boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2;
    }
    update(){
        this.timer++;
        if(this.timer % 10 === 0){
            this.frame++;
        }
    }
    draw(){
        ctx.save();  //pour la rotation de l'image affecte une seule image
        ctx.translate(this.x, this.y); //on transfere x et y au top de l'image
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width * 0.5 , 0 - this.height * 0.5, this.width, this.height);
        ctx.restore(); // on restaure depuis le save annule translate rotate
    }
}

window.addEventListener('click', function(e) {
    createAnimation(e);
});
/* window.addEventListener('mousemove', function(e) {
    createAnimation(e);
});
*/
function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
    console.log(explosions);

    /*ctx.fillStyle = 'white';
    ctx.fillRect(e.x - canvasPosition.left - 25 , e.y - canvasPosition.top - 25, 50, 50); */

}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        if(explosions[i].frame > 5){
            explosions.splice(i, 1);
            i--;   //ajuster index apres avoir enlever un element
        }
    }
    requestAnimationFrame(animate);
}
animate();