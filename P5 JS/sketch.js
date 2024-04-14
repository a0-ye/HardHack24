let TempBar;
// let temps = [];
let temp = 25

// let count = 0;
// for (let i = 20; i < 41; i++) {
//     // console.log(temps);
//     temps.push(i)
// }
// console.log(temps)

// function getTemp() {
//     count++;
//     // console.log(count%20);
//     return temps[count%20];
// }


function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    TempBar = new BarGraph();
    TempBar.generateTarget();

}

function draw(){
    background(220);

    // temp = getTemp();
    if(TempBar.finished == false){
        TempBar.displayBarBase();
        TempBar.displaySliderBar(temp);
        TempBar.displayTargetZone();
        TempBar.zoneCheck();
    } else{
        alert("VICTORY: YOU DID IT!!!");
    }

    circle(mouseX, mouseY, 30);
}

class BarGraph{
    constructor(){}


    tempBarBaseDat = {x:0,y:-75,width:80,height:400};
    targetRangeDat = {upper:0,lower:0,width:0,height:0};
    // time in millis, time in millis, 1 == was in zone prev, 0 == not in zone prev
    zoneCheckDat = {startTime:0,timeFrac:0}
    
    // finished is a flag for whether or not we are done with our game!
    finished = false;


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
    
        let result = (temp - 20) / 20 * range;
        return result;
    }

    getSliderDat(temp){
        const width = 60;
        const color = this.getColorForTemperature(temp);;
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
        this.targetRangeDat.upper = random(25, 38);
        this.targetRangeDat.lower = this.targetRangeDat.upper - 2;
        this.targetRangeDat.width = this.tempBarBaseDat.width;
        this.targetRangeDat.height = this.getHeightForTemp(this.targetRangeDat.upper) - this.getHeightForTemp(this.targetRangeDat.lower);

        console.log("Upper: ",this.targetRangeDat.upper);
        console.log("height proportional: ",this.getHeightForTemp(this.targetRangeDat.upper) / this.tempBarBaseDat.height);
    }
    

    /**
     * if not in zone, update start time.
     * when we're in the loop, we start comparing curr time to the start time because we stop updating it
     */
    zoneCheck(){
        if(temp <= this.targetRangeDat.upper && temp >= this.targetRangeDat.lower){
            if( millis() - this.zoneCheckDat.startTime >= 5000){    // 5 seconds
                this.finished = true;
            }
        } else {
            this.zoneCheckDat.startTime = millis();
        }
        this.zoneCheckDat.timeFrac = (5000 - (millis() - this.zoneCheckDat.startTime)) / 5000
        console.log("timefrac: ",this.zoneCheckDat.timeFrac);
    }
}

