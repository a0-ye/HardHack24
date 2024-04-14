let maze;

function setup(){
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    angleMode(DEGREES);

    maze = new Maze(10, 10);

}

function draw(){
    background(220);

    circle(mouseX, mouseY, 30);
    maze.display();
}

class Maze{
    constructor(cols, rows){
        // How many columns and rows?
        this.cols = cols;
        this.rows = rows;

        this.mazeMap = [];
        this.generateMapArray();
        console.log(this.mazeMap);
    }
    
    generateMapArray() {
        for (let i = 0; i < this.rows; i++) {
            this.mazeMap.push([])
            for (let j = 0; j < this.cols; j++) {
                // randomize wall or not
                if (Math.random() > 0.4) {
                    this.mazeMap[i].push(0) // not wall
                } else {
                    this.mazeMap[i].push(1) // wall
                }
                
            }

        }
    }

    display() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                square()
            }
        }
    }

}