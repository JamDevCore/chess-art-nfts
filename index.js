const p5 = require("node-p5");
const pgn = require("./lib/pgns");
const { Chess } = require("chess.js");
const pinFile = require("./modules/pin-file");

const canvasX = 8000,
  canvasY = canvasX,
  square = canvasX / 8,
  centre = square / 2,
  numberOfSquares = canvasX / square,
  letters = ["a", "b", "c", "d", "e", "f", "g", "h"],
  points = {
    p: 1,
    r: 5,
    b: 3,
    n: 3,
    k: 12,
    q: 8,
  };

async function sketch(p, match, indexOfMatch) {
  try {
    // console.log(p)

    const coordinates = {};
    for (let i = 1; i <= numberOfSquares; i += 1) {
      letters.forEach((l, index) => {
        coordinates[`${l}${i}`] = {
          x: (index + 1) * square - centre,
          y: i * square - centre,
        };
      });
    }

    let canvas;
    let graphic;
    const chess = new Chess();

    chess.loadPgn(match);

    const getCoord = (notation) => {
      return coordinates[notation];
    };
    p.setup = () => {
      canvas = p.createCanvas(9600, 9600);
      canvas.background(0);
      graphic = p.createGraphics(canvasX, canvasY);
      graphic.background(0);
    };
    p.draw = () => {
      console.log(chess.ascii());
      chess.history({ verbose: true }).map((move) => {
        const coordFrom = getCoord(move.from);
        const coordTo = getCoord(move.to);
        graphic.beginShape(p.LINES);
        graphic.strokeCap(p.SQUARE);
        graphic.strokeJoin(p.ROUND);
        graphic.stroke(255);
        graphic.strokeWeight(points[move.piece] * 2);
        graphic.vertex(coordFrom.x, coordFrom.y);
        graphic.vertex(coordTo.x, coordTo.y);
        graphic.endShape();
      });
      p.image(graphic, 800, 800);
      p.noLoop();
      setTimeout(() => {
        p.saveCanvas(canvas, `./images/${indexOfMatch + 1}`, "png").then(
          async () => {
            p.remove();
            graphic.remove();
            setTimeout(async () => {
              pinFile(indexOfMatch + 1, chess);
            }, (indexOfMatch + 1) * 1000);
          }
        );
      }, 100);
    };
  } catch (err) {
    console.log(err);
  }
}

const createNFTs = async () => {
  const reg = /\r?\n\n/g;
  const matches = pgn.split(reg);
  let formattedMatches = [];

  matches.forEach((match, i) => {
    if (i % 2 === 0 && i !== 0) {
      formattedMatches.push(`${match + "\n\n" + matches[i - 1] + "\n\n"}`);
    }
  });

  formattedMatches = formattedMatches.slice(0, 140);
  await Promise.all(
    await formattedMatches.map(async (match, index) => {
      setTimeout(async () => {
        return await p5.createSketch((p) => sketch(p, match, index));
      }, (index + 1) * 1000);
    })
  );
};

createNFTs();
