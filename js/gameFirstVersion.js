window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;

    class InputHandler {
        constructor (){
            this.keys = [];
            //ES 6 arrow functions inherit 'this' from their parent, lexical scoping
            window.addEventListener('keydown', e => {
                //console.log(e.key);
                if((    e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight' )
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                }
                //console.log(e.key, this.keys);
            });
            //when we release the key ArrowDown
            window.addEventListener('keyup', e => {
                if(     e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight' ){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                //console.log(e.key, this.keys);
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = playerImage;
            this.frameX = 0;
            this.frameY = 0;
            this.speed = 0;
            this.velocityY = 0;
            this.weight = 1;
        }
        draw(context){
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width,  this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input){

            if (input.keys.indexOf('ArrowRight') > -1 ) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;

            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
                this.velocityY -= 32
            } else {
                this.speed = 0;
            }

            //horizontal movement
            this.x += this.speed;
            if(this.x < 0 ) this.x =0;
            else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            //vertical movement
            this.y += this.velocityY;
            if(!this.onGround()){
                this.velocityY += this.weight;
                this.frameY = 1
            }else {
                this.velocityY = 0;
                this.frameY = 0
            }
            //player can't never be below the ground
            if(this.y > this.gameHeight - this.height) this.x = this.gameHeight - this.height;


        }
        //facility method return true or false
        onGround(){
            return this.y >= this.gameHeight - this.height
        }
    }

    class Background {

    }

    class Enemy {

    }

    function handleEnemies(){

    }

    function displayStatusText(){

    }

    const input = new InputHandler(); //utlise comme argument dans animate player.update
    const player = new Player (canvas.width, canvas.height);
    
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input);
        requestAnimationFrame(animate);
    }

    animate();

});