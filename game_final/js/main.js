import Player from './player.js';
import {InputHandler} from './input.js';
import {Background} from './background.js';
import {FlyingEnemy, GroundEnemy, ClimbingEnemy} from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', function(){

    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.speed = 0;
            this.maxSpeed = 4;
            this.groundMargin = 80;
            //create automatically a instance of player and InputHandler (import) when i create an instance of game + i need game as argument for new Player so i pass with keyword THIS (refer to game object)
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.maxParticles = 100;
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.time = 25000;
            //this.time = 0;
            //this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 7;
            this.fontColor = 'black';
            this.fontColor5SecLast = 'red';
            this.fontColorWinningScore = 'green';
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
    
        }
        update(deltaTime) {
            //this.time += deltaTime;
            //if(this.time > this.maxTime) this.gameOver = true;
            this.time -= deltaTime;
            if(this.time <= 0) {
                this.time = 0;
                this.gameOver = true;
            } 
                
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            //handleEnemy
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy),1);
            });
            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            //handleParticles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles){
                //this.particles = this.particles.slice(0, this.maxParticles);
                this.particles.length = this.maxParticles;
            }
            //console.log(this.particles);
            //handle Collision sprite
            this.collisions.forEach( (collision, index) => {
                collision.update(deltaTime);
            })
            this.enemies = this.enemies.filter( enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter( particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter( collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter( message => !message.markedForDeletion);

        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context );
            });
            this.particles.forEach( particle => {
                particle.draw(context);
            });
            this.collisions.forEach( collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if ( this.speed > 0)  this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
            //console.log(this.enemies);
        }
    }

    const game = new Game(canvas.width, canvas.height)
    //console.log(game);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        //console.log(deltaTime);
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver)requestAnimationFrame(animate);
        if(game.gameOver) stopMusic();

    }
    animate(0);

    //restart
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') location.reload();
    })

    //music
    const audio = new Audio('assets/audio/level_music.mp3');

    function music(){
        audio.play();
    }

    function stopMusic(){
        audio.pause()
    }
    
    music();

});