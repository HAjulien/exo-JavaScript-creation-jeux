import {StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight} from './state.js';


export default class Player {
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.states = [new StandingLeft(this), new StandingRight(this), new SittingLeft(this), new SittingRight(this), new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this), new FallingLeft(this), new FallingRight(this)];
        this.currentState = this.states[1];
        this.image = dogImage;
        this.width = 200;
        this.height = 181.83;
        this.x = this.gameWidth * 0.5 - this.width * 0.5;
        this.y = this.gameHeight - this.height;
        this.velocityY = 0;
        this.weight = 1;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 6;
        this.speed = 0;
        this.maxSpeed = 12;
        this.fps = 10;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
    }
    draw(context, deltaTime) {
        if (this.frameTimer > this.frameInterval){
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0; 
        } else {
            this.frameTimer += deltaTime;
        }

        context.drawImage(this.image, this.width * this.frameX , this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    update(input) {
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if (this.x <= 0) this.x = 0;
        else if (this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width;
        
        //vertical movement
        this.y += this.velocityY;
        //if (this.y < this.gameHeight - this.height){ ligne below is easier to read (player not on the ground)
        if (!this.onGround()){
            this.velocityY += this.weight;
        } else {
            this.velocityY = 0;
        }

        //assurance player can't be below the ground
        if (this.y > this.gameHeight - this.height ) this.y = this.gameHeight - this.height;
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    //utlity method check if it's on the ground return true or false
    onGround(){
        return this.y >= this.gameHeight - this.height;
    }
}