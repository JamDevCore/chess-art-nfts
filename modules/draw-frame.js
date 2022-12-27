const drawFrame = (p) => {
    let currentX = 0;
    let currentY = 0;
    const frameSquare = 250;
    const total = canvasX / frameSquare;
    for(let i = 0; i < total; i ++) {

      p.rect(currentX, currentY, frameSquare, frameSquare);
      p.fill(i % 2 ? 200 : 0);
      currentX += frameSquare;

    }
    currentX = canvasX - frameSquare;
    currentY = 250;
    for(let i = 0; i < total; i ++) {

      p.rect(currentX, currentY, frameSquare, frameSquare);
      p.fill(i % 2 ? 200 : 0);
      currentY += frameSquare;
    }

    currentX = 0;
    currentY = 0;
    for(let i = 0; i < total; i ++) {

      p.rect(currentX, currentY, frameSquare, frameSquare);
      p.fill(i % 2 ? 200 : 0);
      currentY += frameSquare;
    }
    currentX = canvasX - frameSquare;
    currentY = canvasY - frameSquare;
    for(let i = total; i > 0; i -=1) {

      p.rect(currentX, currentY, frameSquare, frameSquare);
      p.fill(i % 2 ? 200 : 0);
      currentX -= frameSquare;
    }
  };

  export default drawFrame;