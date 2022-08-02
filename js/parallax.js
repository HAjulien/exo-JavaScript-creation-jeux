const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let gameSpeed = 10;

// pareil que .appendChild()document.createElement('img);
const backgroundLayer1 = new Image();
backgroundLayer1.src ='images/backgroundLayers/layer-1.png';

const backgroundLayer2 = new Image();
backgroundLayer2.src ='images/backgroundLayers/layer-2.png';

const backgroundLayer3 = new Image();
backgroundLayer3.src ='images/backgroundLayers/layer-3.png';

const backgroundLayer4 = new Image();
backgroundLayer4.src ='images/backgroundLayers/layer-4.png';

const backgroundLayer5 = new Image();
backgroundLayer5.src ='images/backgroundLayers/layer-5.png';


//1er façon faire

// let x = 0;
// let x2 = 2400;

// function animate(){
//     //loop  spagetti code
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
//     ctx.drawImage(backgroundLayer4, x, 0);
//     ctx.drawImage(backgroundLayer4, x2, 0);
//     if (x < - 2400) x = 2400 + x2 - gameSpeed;
//     else x-= gameSpeed;
//     if (x2 < - 2400) x2 = 2400 + x - gameSpeed;
//     else x2-= gameSpeed;
//     requestAnimationFrame(animate);

// };





// 2eme façon de faire avec class

//pour etre sur que tout soit chargé
window.addEventListener('load', function(){

    const slider = document.getElementById('slider');
    slider.value = gameSpeed;
    const showGameSpeed = document.getElementById('showGameSpeed');
    showGameSpeed.innerHTML = gameSpeed;
    slider.addEventListener('change', function(e){
        gameSpeed = e.target.value;
        showGameSpeed.innerHTML = e.target.value;
    })

    class Layer{
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            //this.x2 = this.width;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }

        update(){
            this.speed = gameSpeed * this.speedModifier;
            if (this.x <= -this.width){
                //this.x = this.width - this.speed;
                this.x = 0
            }
            /*
            if (this.x2 <= -this.width){
                this.x2 = this.width + this.x - this.speed;
            }
            */
            this.x = Math.floor(this.x - this.speed);
            //this.x2 = Math.floor(this.x2 - this.speed);
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }

    //instance ou custom class
    const layer1 = new Layer(backgroundLayer1, 0.1);
    const layer2 = new Layer(backgroundLayer2, 0.4);
    const layer3 = new Layer(backgroundLayer3, 0.5);
    const layer4 = new Layer(backgroundLayer4, 0.7);
    const layer5 = new Layer(backgroundLayer5, 0.5);

    //pour eviter la repetition
    const gameObjects = [layer1, layer2, layer3, layer4, layer5]

    function animate(){

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // layer4.update();
        // layer4.draw();
        // layer5.update();
        // layer5.draw();

        gameObjects.forEach(object =>{
            object.update();
            object.draw();
        });

        requestAnimationFrame(animate);

    };

    animate()
    
});

