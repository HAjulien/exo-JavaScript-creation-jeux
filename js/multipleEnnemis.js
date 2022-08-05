window.addEventListener('load', ()=>{

    /** @type {HTMLCanvasElement} */

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;

    class Game{
        constructor(ctx, width, height){
            // convert global variables into class properties
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 800;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
            //console.log(this.enemies);
        }
        update(deltaTime){   //get deltaTime to update in function animate l:162
            this.enemies = this.enemies.filter( object => !object.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy();
                this.enemyTimer = 0;
                //console.log(this.enemies);
            } else{
                this.enemyTimer+= deltaTime
            }
            this.enemies.forEach(object => object.update(deltaTime))  //to give acces to deltaTime to class Enemy (methode update) uniforme velocityX for all computer
        }
        draw(){
            this.enemies.forEach(object => object.draw(this.ctx))

        }
        //private class #
        #addNewEnemy(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if (randomEnemy == 'worm') this.enemies.push(new Worm(this)); //this refer to class Game and i pass to Enemy class
            else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this)); 
            else if (randomEnemy == 'spider') this.enemies.push(new Spider(this)); 
            //effect 2.5d 3d
            /*this.enemies.sort(function(a, b){
                return a.y - b.y;
            }) */
        }
    }

    class Enemy{
        constructor(game){
            this.game = game;  
            //nom i have access to game object from inside class Enemy ,  convert class properties
            //console.log(this.game);
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltaTime){ // get deltaTime from l:22
            this.x-= this.velocityX * deltaTime;
            //remove enemies
            if (this.x < 0 - this.width) this.markedForDeletion = true;
            if (this.frameTimer > this.frameInterval){
                if (this.frameX < this.maxFrame) this.frameX ++
                else this.frameX = 0;
                this.frameTimer = 0
            }else {
                this.frameTimer += deltaTime;
            };
        }
        draw(ctx){  //draw using ctx from l:34 avoid global variable
            //ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy {  
        // extends if JS don't find method or property inside class Worm, JS look into class Enemy
        constructor(game){
            super(game);  //get all propreties from Enemy SUPER must be call before you can use THIS keyword
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.x = this.game.width;
            this.y =this.game.height - this.height;
            this.velocityX = Math.random() * 0.1 + 0.1;
            this.image = worm; // no need document.getElementById (id are autmatically added to the JS)
            //console.log(this.image);
        }
    }

    class Ghost extends Enemy {  
        constructor(game){
            super(game);
            this.spriteWidth = 264;
            this.spriteHeight = 209;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.frame = 0;
            this.x = this.game.width;
            this.y = Math.random() * (this.game.height * 0.5);
            this.velocityX = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.curve = Math.random() * 3;
            this.image = ghost;
        }
        update(deltaTime){  //get deltatime from extends Enemy
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle+= 0.04;

        }
        draw(ctx){ //get ctx from extends Enemy (come from class Game)
            ctx.save();
            ctx.globalAlpha = 0.5;
            super.draw(ctx);
            ctx.restore(); 
        }
    }

    class Spider extends Enemy {  
        constructor(game){
            super(game); 
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.frame = 0;
            this.x = Math.random() * (this.game.width - this.width);
            this.y = 0 - this.spriteHeight;
            this.velocityX = 0;
            this.velocityY = Math.random() * 0.1 + 0.1;
            this.maxLenght = Math.random() * this.game.height;
            this.image = spider;
        }
        update(deltaTime){
            super.update(deltaTime);
            if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
            this.y += this.velocityY * deltaTime;
            if (this.y > this.maxLenght) this.velocityY *= -1;
        }
        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.5, 0);
            ctx.lineTo(this.x + this.width * 0.5, this.y + 10);
            ctx.stroke();
            super.draw(ctx);

        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 1;
    
    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);  //pass deltaTime to update l:22
        game.draw();
        //console.log(deltaTime);
        requestAnimationFrame(animate);
    };

    animate(0);


});