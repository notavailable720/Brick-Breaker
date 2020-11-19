//import Paddle from 'Paddle.js'
//import InputHandler from "/src/input";
class Paddle {
    constructor(game) {
        this.gameWidth = game.gameWidth;

        this.width = 150;
        this.height = 20

        this.maxSpeed = 10;
        this.speed = 0;

        this.position = {
            x: game.gameWidth / 2 - this.width / 2,
            y: game.gameHeight - this.height - 10
        }
    }

    moveLeft() {
        this.speed = -this.maxSpeed;
    }

    moveRight() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#0ff'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime) {
        this.position.x += this.speed;

        if(this.position.x < 0) this.position.x = 0;

        if(this.position.x + this.width > this.gameWidth) this.position.x = this.gameWidth - this.width;
    }
}

class InputHandler {

    constructor(paddle) {
        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 37:
                    paddle.moveLeft();
                    break;

                case 39:
                    paddle.moveRight();
                    break;
            }
        })

        document.addEventListener('keyup', (event) => {
            switch (event.keyCode) {
                case 37:
                    if(paddle.speed < 0) paddle.stop();
                    break;

                case 39:
                    if(paddle.speed > 0) paddle.stop();
                    break;
            }
        })
    }
}

class Ball {
    constructor(game) {
        this.image = document.getElementById("img_ball");

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.position = {x: 10, y: 10};
        this.speed = {x: 4, y: 2};
        this.size = 16;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size,
            this.size
            );
    }

    update(deltaTime) {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        
        //wall on left or right
        if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }

        //wall on top or bottom
        if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        //check collision with paddle
        let bottomOfBall = this.position.y + this.size;
        let topOfPaddle = this.game.paddle.position.y;
        let leftSideOfPaddle = this.game.paddle.position.x;
        let rightSideOfPaddle = this.game.paddle.position.x + this.game.paddle.width;

        if (
            bottomOfBall >= topOfPaddle
            && this.position.x >= leftSideOfPaddle
            && this.position.x + this.size <= rightSideOfPaddle
            ) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }
    }
}

class Game {

constructor(gameWidth, gameHeight) {
this.gameWidth = gameWidth;
this.gameHeight = gameHeight;
}

start() {
this.paddle = new Paddle(this);
this.ball = new Ball(this);

let bricks = []
for(let i = 0; i<10; i++) {
    bricks.push(new Brick(this, {x: i * 52, y:30}));
}

this.gameObjects = [this.ball, this.paddle, ...bricks];

new InputHandler(this.paddle);
}

update(deltaTime) {
    this.gameObjects.forEach((object) => object.update(deltaTime));
}

draw(ctx) {
    this.gameObjects.forEach((objects) => objects.draw(ctx));
}

}

class Brick {
    constructor(game, position) {
        this.image = document.getElementById("img_brick");

        this.game = game;

        this.position = position;
        this.width = 52;
        this.height = 24;
    }

    update() {

    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            );
    }

}


let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const  GAME_HEIGHT = 600;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();


let lastTime = 0;

//images
let imgBall = document.getElementById('img_ball')

function gameLoop (timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    //ctx.clearRect(0, 0, 800, 600);

    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);