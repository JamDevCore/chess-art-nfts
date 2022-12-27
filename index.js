const p5 = require('node-p5');
const pgn = require('./pgns/test-pgn');
const { Chess } =require('chess.js');

const canvasX = 8000,
  canvasY = canvasX,
  square = canvasX / 8,
  centre = square / 2,
  numberOfSquares = canvasX / square,
  letters = ['a','b', 'c','d', 'e', 'f', 'g', 'h'],
  points = {
    p: 1,
    r: 5,
    b: 3,
    n: 3,
    k: 12,
    q: 8,
  };

function sketch(p) {
  try {
    const coordinates = {};
    for(let i = 1; i <= numberOfSquares; i +=1) {
      letters.forEach((l, index) => {
        coordinates[`${l}${i}`] = {
          x: ((index + 1) * square - centre),
          y: (i * square) - centre,
        };
      });
    }
    let canvas;
    const chess = new Chess();
    chess.loadPgn(pgn);

    const getCoord = (notation) => {
      return coordinates[notation];
    };
    p.setup = () => {
      canvas = p.createCanvas(canvasX, canvasY);
      canvas.background(0);

    };
    p.draw = () => {

      chess.history({ verbose: true }).map((move, index) => {
        console.log(move);
        const coordFrom = getCoord(move.from);
        const coordTo = getCoord(move.to);
        p.beginShape(p.LINES);
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
        p.stroke(255);
        p.strokeWeight(points[move.piece] * 2);
        p.vertex(coordFrom.x, coordFrom.y);
        p.vertex(coordTo.x, coordTo.y);
        p.endShape();
      });  
    
      p.noLoop();
      setTimeout(() => {
        p.saveCanvas(canvas, 'myCanvas', 'png').then(filename => {
          console.log(`saved the canvas as ${filename}`);
        });
      }, 100);
    };
  } catch(err) {
    console.log(err);
  }
  //   p.save = () => {
  //     console.log('here');

//   }
}


let p5Instance = p5.createSketch(sketch);
