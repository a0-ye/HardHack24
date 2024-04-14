let port, reader, writer;
let previousCommand;
let pedal;
let joy1;
let joy2;
let knob1
let knob2;
let knob3;
let knob4;
let temp;

// let reactionGame;
// let tempGame;
let game;

const inputsEnum = {
    JOY1: 0,
    JOY2: 1,
    KNOB1: 0,
    KNOB2: 3,
    KNOB3: 4,
    KNOB4: 5,
    TEMP: 1,
    PEDAL: 2,
    SPACE: 3,
    INPUT_SIZE: 4
};
const {JOY1, JOY2, KNOB1, KNOB2, KNOB3, KNOB4, TEMP, PEDAL, SPACE, INPUT_SIZE} = inputsEnum;

const gameEnums = {
    REACT_GAME: 0,
    TEMP_GAME: 1,
    KNOB_GAME: 2
}
const {REACT_GAME, TEMP_GAME, KNOB_GAME} = gameEnums;

async function connectSerial(){
    noLoop();
    ({ port, reader, writer } = await getPort(115200));
    loop();
}

async function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    await connectSerial();

    textSize(25);

    joy1 = new Joystick();
    joy2 = new Joystick();

    knob1 = new Knob();
    knob2 = new Knob();
    knob3 = new Knob();
    knob4 = new Knob();

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
        text(tokens, 500, height - 50);
        readAll(tokens);

        handleGame();

        circle(mouseX, mouseY, 30);
    }
}

function handleGame(){
    if(game === undefined || game.done)
        game = getGame(floor(random(0, Object.keys(gameEnums).length)));

    else
        game.display();
}

function getGame(gameCode){
    switch (gameCode){
        case REACT_GAME:
            return new ReactionGame();

        case TEMP_GAME:
            return new TempGame();

        case KNOB_GAME:
            return new KnobGame();
    }
}

function readAll(tokens){
    joy1.x = tokens[0];
    joy1.y = tokens[1];
    joy2.x = tokens[2];
    joy2.y = tokens[3];
    knob1.read(tokens[4]);
    knob2.read(tokens[5]);
    knob3.read(tokens[6]);
    knob4.read(tokens[7]);
    temp = tokens[8];
    pedal = tokens[9];
}

class ReactionGame{
    constructor() {
        this.start = millis();
        this.previousTime = millis();
        this.currentTime = millis();
        this.score = 0;
        this.count = 0;
        this.delta = random(3500, 7000);
        this.done = false;
    }

    display(){
        push();
        this.currentTime = millis();

        if(this.currentTime - this.start > 3000) {
            if (this.count < 10) {
                text("score " + this.score.toFixed(0), 50, 50);

                if (this.currentTime - this.previousTime > this.delta) {
                    fill(150, 0, 0);
                    circle(width / 2, height / 2, 100);

                    if (pedal < 400) {

                        this.score += 30000 / (this.currentTime - this.previousTime - this.delta);
                        this.previousTime = millis();
                        this.delta = random(500, 4000 - this.count * 400);
                        this.count++;
                    }
                } else if (this.currentTime - this.previousTime >= 350 && pedal < 400) {
                    this.score -= 2;
                }
            } else {
                textAlign(CENTER);
                textSize(70);
                text("score " + this.score.toFixed(0), width / 2, height / 2);
                if(millis() - this.previousTime >= 3000) {
                    this.done = true;
                }

            }
        }else{
            textAlign(CENTER);
            textSize(150);
            text(floor(4 - (this.currentTime - this.start) / 1000), width / 2, height / 2)
        }
        pop();
    }
}

class TempGame{
    constructor(){
        this.tempBarBaseDat = {x:0,y:-75,width:80,height:400};
        this.targetRangeDat = {upper:0,lower:0,width:0,height:0};
        // time in millis, time in millis, 1 == was in zone prev, 0 == not in zone prev
        this.zoneCheckDat = {startTime:0,timeFrac:0}

        // finished is a flag for whether we are done with our game!
        this.done = false;
        this.generateTarget();
    }

    display(){
        this.displayBarBase();
        this.displaySliderBar(temp);
        this.displayTargetZone();
        this.zoneCheck();
    }

    displayBarBase(){
        push();

        fill('#808080');
        stroke('#222222');

        translate(width / 2, height / 2);
        rect(this.tempBarBaseDat.x, this.tempBarBaseDat.y, this.tempBarBaseDat.width, this.tempBarBaseDat.height);


        pop();
    }

    displaySliderBar(temp){
        push();
        translate(width / 2, height / 2);


        let slider = this.getSliderDat(temp); // get the info for the slider

        strokeWeight(2);
        stroke('#222222');
        fill(slider.color);

        rect(this.tempBarBaseDat.x + ( (this.tempBarBaseDat.width - slider.width) / 2 ),
            this.tempBarBaseDat.y + this.tempBarBaseDat.height - 5,
            slider.width,
            -slider.height);

        pop();
    }

    displayTargetZone(){
        push();

        translate(width / 2, height / 2);

        strokeWeight(2);
        stroke('#222222');
        fill(253, 169, 43,(100 * this.zoneCheckDat.timeFrac ));
        rect(this.tempBarBaseDat.x,
            (this.tempBarBaseDat.y + this.tempBarBaseDat.height - 5) - this.getHeightForTemp(this.targetRangeDat.upper),
            this.targetRangeDat.width,
            this.targetRangeDat.height,
        );
        pop();
    }

    getHeightForTemp(temp) {
        // padding on top and bottom, 5 each
        let range = this.tempBarBaseDat.height - 10;

        return (temp - 20) / 20 * range;
    }

    getSliderDat(temp){
        const width = 60;
        const color = this.getColorForTemperature(temp);
        const height = this.getHeightForTemp(temp);

        return {width, height, color};
    }

    getColorForTemperature(temp) {
        let hue = map(temp, 20, 40, 0, 240);
        let saturation = 100;
        let brightness = 100;
        return color(hue, saturation, brightness);
    }
    getColorForTime(diff) {
        let hue = map(temp, 20, 40, 0, 240);
        let saturation = 100;
        let brightness = 100;
        return color(hue, saturation, brightness);
    }

    /**
     * generates a target range between 25 and 38
     * (lower bound is -2 for 3 total degrees range)
     */
    generateTarget(){
        do {
            this.targetRangeDat.upper = random(25, 35);
        } while (temp <= this.targetRangeDat.upper && temp >= this.targetRangeDat.upper - 2)
        this.targetRangeDat.lower = this.targetRangeDat.upper - 2;
        this.targetRangeDat.width = this.tempBarBaseDat.width;
        this.targetRangeDat.height = this.getHeightForTemp(this.targetRangeDat.upper) - this.getHeightForTemp(this.targetRangeDat.lower);

        // console.log("Upper: ",this.targetRangeDat.upper);
        // console.log("height proportional: ",this.getHeightForTemp(this.targetRangeDat.upper) / this.tempBarBaseDat.height);
    }


    /**
     * if not in zone, update start time.
     * when we're in the loop, we start comparing curr time to the start time because we stop updating it
     */
    zoneCheck(){
        if(temp <= this.targetRangeDat.upper && temp >= this.targetRangeDat.lower){
            if( millis() - this.zoneCheckDat.startTime >= 5000){    // 5 seconds
                this.done = true;
            }
        } else {
            this.zoneCheckDat.startTime = millis();
        }
        this.zoneCheckDat.timeFrac = (5000 - (millis() - this.zoneCheckDat.startTime)) / 5000
        console.log("timefrac: ",this.zoneCheckDat.timeFrac);
    }
}

class KnobGame{
    constructor() {
        this.theta = 0;
        this.w = random(-1, 1);
        this.w = this.w > 0 ? 0.5 : -0.5;
        this.done = false;
    }

    display(){
        push();
        fill(0);
        translate(width / 2, height / 2, 100);
        rotate(this.theta);

        circle(0, 0, 100)
        stroke(255);
        strokeWeight(2);
        line(0, 20, 0, 50);

        this.theta += this.w;

        if((knob1.deltaTheta > 0 && this.w > 0) || (knob1.deltaTheta < 0 && this.w < 0))
            this.done = true;

        pop();
    }
}
class Knob{
    constructor() {
        this.theta = 0;
        this.prevTheta = 0;
        this.deltaTheta = 0;
    }

    read(theta){
        this.theta = theta;
        this.deltaTheta = this.theta - this.prevTheta;
        this.prevTheta = theta;
    }

}

class Joystick{
    constructor(){
        this.x = 0;
        this.y = 0;
    }
}