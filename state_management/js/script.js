
// './' means it's in the same folder as script.js  
import Player from './player.js';
import InputHandler from './input.js';
import {drawStatusText} from './utils.js';

window.addEventListener('load', function() {

    loading.style.display = 'none';
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = new Player(canvas.width, canvas.height);
    //console.log(player);
    const input = new InputHandler();

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //console.log(input.lastKey);
        player.update(input.lastKey);
        player.draw(ctx, deltaTime);
        drawStatusText(ctx, input, player);
        requestAnimationFrame(animate)
    }

    animate(0);
})