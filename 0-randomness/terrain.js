let land;
let theta = 0.0;

function setup() {
  createCanvas(1000, 1000, WEBGL);

  land = new Terrain(20, 800, 400);
}

function draw() {
  land.calculate();
  background(255);
  push();
  translate(0, 20, -200);
  rotateX(PI/3);
  rotateZ(theta);
  land.render();
  pop();

  theta += 0.0025;
}

function make2DArray(cols, rows){
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr;
}

class Terrain {
    constructor(size, w, h) {
        this.size = size;
        this.w = w;
        this.h = h;
        this.cols = floor(w/size);
        this.rows = floor(h/size);
        this.z = make2DArray(this.cols, this.rows);
        // perlin noie
        this.zoff = 0;
    }

    // calculate height values
    calculate() {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++){
        let yoff = 0;
        for (let y = 0; y < this.rows; y++){
          this.z[x][y] = map(noise(xoff, yoff, this.zoff), 0, 1, -120, 120);
          yoff += 0.08;
        }
        xoff += 0.08;
      }
      //this.zoff += 0.001;
    }

    render() {
      for (let x = 0; x < this.z.length-1; x++){
        beginShape(QUAD_STRIP);
        for (let y = 0; y < this.z[x].length; y++){
          stroke(0);
          let currentElevent = this.z[x][y];
          let currentShade = map(currentElevent, -120, 120, 0, 255); // each quad's colour is determined by the height at each vertex
          fill(currentShade, 255);
          let xCoord = x*this.size-this.w/2;
          let yCoord = y*this.size-this.h/2;
          vertex(xCoord, yCoord, this.z[x][y]);
          vertex(xCoord + this.size, yCoord, this.z[x+1][y]);
        }
        endShape();
      }
    }
}