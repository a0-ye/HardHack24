let fishing;



let knob1;
let knob2;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    knob1 = new knob();
    knob2 = new knob();
    fishing = new FishingGame();

    fishing.generateTarget();

}

function draw(){
    background(220);

    // temp = getTemp();
    if(fishing.finished == false){
        // this.scaleSlider();
        fishing.display();
    } else{
        alert("VICTORY: YOU DID IT!!!");
    }

    circle(mouseX, mouseY, 30);
}

class FishingGame{
    constructor(){
        knob1.offset = knob1.theta;
        knob2.offset = knob2.theta;

        // knob1.vtheta;
         
        this.targetVal = this.generateTarget();
        this.baseDat = {x:0,y:0,basewidth:450 ,baseheight:450};
        
        
        this.bobberDat = {x:0,y:0,r:50};
        
        this.targetStart = millis();
        
        this.ratioVal = 0;


        this.finished = false;

    }

    generateTarget(){
        let upper = 400
        let lower = 0
        return this.distanceInR2(random(lower,upper),random(lower,upper))
    }
    
    distanceInR2(a,b){
        return sqrt(pow(a,2) + pow(b,2))
    }

    ratio(current,target){
        return 1 - (abs(target - current) / 400)
    }

    updateBobber(){
        // move the bobber based off the knob positions
        this.bobberDat.x = knob1.vtheta * (this.baseDat.basewidth / 20);
        if(this.bobberDat.x > this.baseDat.basewidth){
            this.bobberDat.x = this.baseDat.basewidth;
        }

        this.bobberDat.y = knob2.vtheta * (this.baseDat.basewidth / 20);
        if(this.bobberDat.y > this.baseDat.basewidth){
            this.bobberDat.y = this.baseDat.basewidth;
        }
        
    }

    display(){
        this.ratioVal = this.ratio(this.distanceInR2(knob1.vtheta,knob2.vtheta), this.targetVal)
        this.displayPoolBase();
        this.updateBobber();
        this.displayBobber();
        this.checkTarget();

    }

    displayPoolBase(){
        push();
        translate((width / 2) - this.baseDat.basewidth / 2, (height / 2) - this.baseDat.baseheight / 2);

        strokeWeight(4);
        fill(43, 186, 253);
        stroke('#222222');

        square(this.baseDat.x, this.baseDat.y, this.baseDat.basewidth);

        pop();
    }

    displayBobber(){
        push();
        translate((width / 2) - this.baseDat.basewidth / 2, (height / 2) - this.baseDat.baseheight / 2);

        fill(57, 253, 43);
        stroke('#222222');

        circle(this.bobberDat.x, this.bobberDat.y, this.bobberDat.r);

        pop();
    }

    checkTarget(){
        let threshold = 0.08;
        //95% threshhold for 5 seconds
        console.log("ratioval",this.ratioVal);
        if(this.ratioVal <= threshold ){
            if( millis() - this.targetStart >= 5000){    // 5 seconds
                this.done = true;
            }
        } else {
            this.targetStart = millis();
        }
        //get timer ratio for color fill
        this.timeFrac = (5000 - (millis() - this.targetStart)) / 5000
    }

    


}


class knob{
    constructor(){
        this.theta = 0;
        this.offset = 0;
        this.vtheta = 0;
    }
}