/** @type {HTMLCanvasElement} */

window.addEventListener('load', function(){



    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    class InputHandler {
        constructor (){
            this.keys = [];
            this.toucheY = '';
            this.touchTreshold = 30;
            //ES 6 arrow functions inherit 'this' from their parent, lexical scoping
            window.addEventListener('keydown', e => {
                //console.log(e.key);
                if((    e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight' )
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key);
                    //console.log(e.key, this.keys);
                } else if (e.key === 'Enter' && gameOver) restartGame();
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

            window.addEventListener('touchstart', e => {
                //console.log(e.changedTouches[0].pageY);
                this.toucheY = e.changedTouches[0].pageY;
            });

            window.addEventListener('touchmove', e => {
                //console.log(e.changedTouches[0].pageY);
                const swipeDistance = e.changedTouches[0].pageY - this.toucheY;
                if ( swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1 ) this.keys.push('swipe up');
                else if ( swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1 ) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                }
            });

            window.addEventListener('touchend', e => {
                //console.log(this.keys);
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
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
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.frameY = 0;
            this.speed = 0;
            this.velocityY = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 80;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
            this.velocityY = 0;

        }
        draw(context){
            /*retangle or cicle for collision
            context.strokeStyle = 'white';
            context.lineWidth = 5;
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width*0.5, this.y + this.height*0.5 + 20, this.width*0.33, 0, Math.PI* 2);
            context.stroke(); */
            context.drawImage(this.image, this.frameX * this.width,  this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input, deltaTime, enemies){
            //collision detection with cicle we need do find the hypothynus with Pythagore theoreme and reajust to center of the sprite
            enemies.forEach(enemy =>{
                const dx = (enemy.x + enemy.width*0.5 - 20) - (this.x + this.width*0.5);
                const dy = (enemy.y + enemy.height*0.5) - (this.y + this.height*0.5 + 20);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width*0.33 + this.width*0.33){
                    gameOver = true;
                }
            })
            //sprite animation
            if (this.frameTimer >= this.frameInterval){
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            //controls
            if (input.keys.indexOf('ArrowRight') > -1 ) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;

            } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1 ) && this.onGround()){
                this.velocityY -= 32;
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
                this.maxFrame = 5;
                this.frameY = 1;
            }else {
                this.velocityY = 0;
                this.frameY = 0
                this.maxFrame = 8;
            }
            //player can't never be below the ground
            if(this.y > this.gameHeight - this.height) this.x = this.gameHeight - this.height;


        }
        //facility method return true or false
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = backgroundImage;
            this.x = 0;
            this.y = 0;
            this.speed = 5;
            //image property
            this.width = 2400;
            this.height = 720;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update(){
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
        restart(){
            this.x = 0;
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            //gameArea bondering
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = enemyImage;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 8;
            this.markForDeletion = false;
        }
        draw(context){
            /*retangle or cicle for collision
            context.strokeStyle = 'white';
            context.lineWidth = 5;
            context.strokeRect(this.x, this.y, this.width, this.height); 
            context.beginPath();
            context.arc(this.x + this.width*0.5 - 20, this.y + this.height*0.5, this.width*0.33, 0, Math.PI* 2);
            context.stroke(); */

            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(deltaTime){
            if(this.frameTimer > this.frameInterval){
                if (this.frameX >= this.maxFrame ) this.frameX = 0;
                else this.frameX ++;
                this.frameTimer = 0;
            }else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markForDeletion = true;
                score ++;
            }
        }
    }
    
    function handleEnemies(deltaTime){
        if ( enemyTimer > ennemyInterval + randomEnemyInterval){
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemies.push(new Enemy(canvas.width, canvas.height));
            //console.log(enemies);
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime; 
        }

        enemies.forEach( enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        })
        enemies = enemies.filter(enemy => !enemy.markForDeletion);
    }

    function displayStatusText(context){
        context.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 22, 52);
        if(gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('GameOver, press Enter or swipe down to restart!', canvas.width*0.5, 200);
            context.fillStyle = 'white';
            context.fillText('GameOver, press Enter or swipe down to restart!', canvas.width*0.5 + 2, 202);
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    };

    //JavaScript fullScreen API 
    function toggleFullScreen() {
        console.log(document.fullscreenElement);
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(error => {
                alert (`Error, can't enable full-screen mode: ${error.message} ` )
            })
        } else {
            document.exitFullscreen();
        }
    };
    //toggleFullScreen(); request can onlu be call by the user
    fullScreenButton.addEventListener('click', toggleFullScreen)

    //instancier à partir des class
    const input = new InputHandler(); //utlise comme argument dans animate player.update
    const player = new Player (canvas.width, canvas.height);
    const background = new Background (canvas.width, canvas.height);
    //const enemy1 = new Enemy (canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let ennemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        //background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);
        // enemy1.draw(ctx);
        // enemy1.update();
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver)requestAnimationFrame(animate);
    }

    animate(0);

});