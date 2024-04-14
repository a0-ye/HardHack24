let tempGraph;
let temps = [];
let count = 0;

for (let i = 20; i < 41; i++) {
    // console.log(temps);
    temps.push(i)
}
// console.log(temps)

function getTemp() {
    count++;
    // console.log(count%20);
    return temps[count%20];
}


function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    tempGraph = new BarGraph();
    tempGraph.generateTarget();

}

function draw(){
    background(220);

    temp = getTemp();
    tempGraph.displayBarBase();
    tempGraph.displaySliderBar(temp);
    tempGraph.displayTargetZone();

    circle(mouseX, mouseY, 30);
}

class BarGraph{
    constructor(){}

    tempBarBaseDat = {x:0,y:-75,width:80,height:400};
    targetRangeDat = {upper:0,lower:0,width:0,height:0};
    
    // finished is a flag for whether or not we are done with our game!
    finished = 0;


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
        fill(253, 169, 43,50);
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

    
    /**
     * generates a target range between 25 and 38
     * (lower bound is -2 for 3 total degrees range)
     */
    generateTarget(){
        this.targetRangeDat.upper = random(25, 38);
        this.targetRangeDat.lower = this.targetRangeDat.upper - 2;
        this.targetRangeDat.width = this.tempBarBaseDat.width;
        this.targetRangeDat.height = 30;

        console.log("Upper: ",this.targetRangeDat.upper);
        console.log("height proportional: ",this.getHeightForTemp(this.targetRangeDat.upper) / this.tempBarBaseDat.height);
    }
    
}

