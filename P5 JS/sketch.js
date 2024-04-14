let tempGraph;
let temps = [];
let count = 0;

for (let i = 20; i < 41; i++) {
    console.log(temps);
    temps.push(i)
}
console.log(temps)

function getTemp() {
    count++;
    console.log(count%20);
    return temps[count%20];
}






function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    tempGraph = new BarGraph();
    


}

function draw(){
    background(220);

    temp = getTemp()
    tempGraph.displayBarBase();
    tempGraph.displaySliderBar(temp);

    circle(mouseX, mouseY, 30);
}

class BarGraph{
    constructor(){}

    tempBarBaseDat = {x:0,y:-75,w:80,h:400};

    displayBarBase(){
        push();

        fill('#808080');
        stroke('#222222');

        translate(width / 2, height / 2);
        rect(this.tempBarBaseDat.x, this.tempBarBaseDat.y, this.tempBarBaseDat.w, this.tempBarBaseDat.h);
        

        pop();
    }

    displaySliderBar(temp){
        push();
        translate(width / 2, height / 2);
        
        
        let slider = this.getSliderDat(temp); // get the info for the slider
        
        strokeWeight(2);
        stroke('#222222');
        fill(slider.color);

        rect(this.tempBarBaseDat.x + ( (this.tempBarBaseDat.w - slider.width) / 2 ),
            this.tempBarBaseDat.y + this.tempBarBaseDat.h - 5,
            slider.width,
            -slider.height);
        
        pop();
    }

    getHeightForTemp(temp) {
        // padding on top and bottom, 5 each
        let range = this.tempBarBaseDat.h - 10;
    
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

    
}

// /**
//  * packages slider info into returned object
//  * NEED TO GENERATE GRADIENT BASED OFF HEAT
//  */
// function getSliderDat(){
//     const width = 60;
//     const color = '#ff6a4a';
//     const height = getHeightForTemp();

//     return {width, height, color};
// }


// /**
//  * Get height gradient
//  * 
//  * the range of temp is apparently 23 to 38 ish... figure out a formula
//  */
// function getHeightForTemp() {
//     // padding on top and bottom, 5 each
//     range = this.tempBarBaseDat.h - 10;

//     let result = getTemp() + 25;
//     if (result < 30){
//         result = 45;
//     } else if (result > 375){
//         result = 375;
//     }
//     return result;
// }

/**
 * generates a random temperature
 */
function generateTemp(){
    return random(23, 38);
}
