let port, reader, writer;
let reactionGame;
let previousCommand;

const sensorCodesEnum = {
    JOY1: 0,
    JOY2: 1,
};
const {JOY1, JOY2} = sensorCodesEnum;


let commandHandler = {
  "MAZE": handleMaze,
  "KNOB": handleKnob,
  "REAC": handleReaction
};

async function connectSerial(){
    noLoop();
    ({ port, reader, writer } = await getPort(115200));
    loop();
}

async function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    //await connectSerial();

    reactionGame = new ReactionGame();
    textSize(25);

}



// async function draw() {
//     while(true) {
//         const {value, done} = await reader.read();
//
//         if (done) {
//             reader.releaseLock();
//             break;
//         }
//
//         background(220);
//
//         let tokens = value.split(',');
//         commandHandler[tokens[0]]();
//
//         circle(mouseX, mouseY, 30);
//
//     }
// }

function draw(){
    background(220);

    handleReaction();
}

function handleKnob(){
}

function handleMaze(){
    circle(100, 100, 50);
}

function handleReaction(){
    reactionGame.display();
}

class ReactionGame{
    constructor() {
        this.start = millis();
        this.previosTime = millis();
        this.currentTime = millis();
        this.score = 0;
        this.count = 0;
        this.delta = random(500, 4000);
    }

    display(){
        this.currentTime = millis();
        if(this.currentTime - this.start > 3000) {
            if (this.count < 10) {
                text("score " + this.score.toFixed(0), 50, 50);

                if (this.currentTime - this.previosTime > this.delta) {
                    push();
                    translate(width / 2, height / 2);
                    fill(125, 0, 0)
                    square(-50, -50, 100);
                    pop();

                    if (keyIsPressed && keyCode === 32) {
                        this.score += 30000 / (this.currentTime - this.previosTime - this.delta);
                        this.previosTime = millis();
                        this.delta = random(500, 4000 - this.count * 400);
                        this.count++;
                    }
                } else if (this.currentTime - this.previosTime >= 350 && keyIsPressed && keyCode === 32) {
                    this.score -= 50;
                }

            } else {
                push();
                textAlign(CENTER);
                textSize(70);
                text("score " + this.score.toFixed(0), width / 2, height / 2);
                pop();
            }
        }else{
            push();
            text()
            pop();
        }
    }
}