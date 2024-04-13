let port, reader, writer;
let knob;

const sensorCodesEnum = {
    JOY1: 0,
    JOY2: 1,
};
const {JOY1, JOY2} = sensorCodesEnum;


let commandHandler = {
  "maze": mazeHandler,
  "knob": knobHandler
};

async function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    noLoop();
    ({ port, reader, writer } = await getPort(115200));
    loop();

    knob = new Knob();

}

async function draw() {
    while(true) {
        const {value, done} = await reader.read();

        if (done) {
            reader.releaseLock();
            break;
        }

        background(220);

        let tokens = value.split(',');
        commandHandler[tokens[0]]();

        circle(mouseX, mouseY, 30);

    }
}

function knobHandler(){
    knob.display(frameCount);
}

function mazeHandler(){
    circle(100, 100, 50);
}

class Knob{
    constructor() {
        this.theta = 0;
    }

    display(theta){
        push();
        translate(width / 2, height / 2);
        rotate(theta)
        fill(0)
        stroke(0)
        circle(0, 0, 100);
        stroke(255)
        line(0, 0, 0, 50);
        pop();
    }

}