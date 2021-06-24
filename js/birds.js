const p5Polyfill = {
  PI: Math.PI,
  HALF_PI: Math.PI / 2,
  random: (a, b) => {
    if (a !== undefined && b !== undefined) {
    return Math.floor(Math.random() * b) + a;
    } else {
    // Assume a is an array.
    const i = Math.floor(Math.random() * a.length);
    return a[i];
    }
  },
  fill: (c) => context.fillStyle = c,
  stroke: (c) => context.strokeStyle = c,
  noFill: () => context.fillStyle = 'transparent',
  noStroke: () => context.strokeStyle = 'transparent',
  push: () => context.save(),
  pop: () => context.restore(),
  translate: (x,y) => context.translate(x,y),
  scale: (x,y) => context.scale(x,y),
  rect: (x,y,w,h) => {
    context.fillRect(x, y, w, h);
    context.strokeRect(x, y, w, h);
  },
  circle: (x,y,d) => {
    context.beginPath();
    context.arc(x, y, d/2, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();
  },
  arc: (x, y, w, h, start, stop, slice=false) => {
    context.beginPath();
    if (!slice) {
    context.moveTo(x, y);
    }
    
    context.arc(x, y, w/2, start, stop);
    
    context.closePath();
    context.fill();
    context.stroke();
  }
}

function birds(p) {
  const colors = [
    '#84B4F9', '#1231B5', //blues
    '#BFE9DC', '#39948E',  //greens
    '#FAC832', //yellow
    '#FECBCA', '#F83735', //reds
    //'black',  //grey
  ];
  const shapes = [
    'arc-1', 'arc-2', 'arc-3', 'arc-4', 
    'skip','skip',
  ];
  const minCells = Math.floor(p.random(4, 7));

  setup();

  function setup() {
    const rekt = document.getElementById('birbs').getBoundingClientRect();
    const canvas = document.querySelector('#birbs > canvas');

    if (!canvas) {
      return;
    }

    canvas.addEventListener('click', () => draw());
    context = canvas.getContext('2d');

    canvas.style.width = rekt.width + 'px';
    canvas.style.height = rekt.height + 'px';
    if(window.devicePixelRatio == 2) {
      rekt.width *= 2;
      rekt.height *= 2;
      context.scale(2, 2);
    } 
    canvas.width = rekt.width;
    canvas.height = rekt.height;

    p.width = rekt.width;
    p.height = rekt.height;
    
    p.noStroke();
    draw();
  }

  function draw() {
    // Background.
    p.fill('white');
    p.rect(0, 0, p.width, p.height);

    let rows, cols, cellSize;
    if (p.width <= p.height) {
      cols = minCells;
      cellSize = Math.floor(p.width / cols);
      rows = Math.floor(p.height / cellSize);
    } else {
      rows = minCells;
      cellSize = p.height / rows;
      cols = Math.ceil(p.width / cellSize);
    }
    
    for (let j = 0; j < cols; j++) {
      for (let i = 0; i < rows; i++) {
        p.noStroke();
        p.fill(p.random(colors));
        
        const shape = p.random(shapes);
        drawShapeForCell(shape, cellSize, i, j);
      }
    }
    

    // Now force-pick some shapes.

    // Flower:
    // arc-3 arc-4
    // arc-2 arc-1
    const availableRows = Array.from({length: rows-1}, (_, i) => i);
    const availableCols = Array.from({length: cols-1}, (_, i) => i);
    
    let row = p.random(availableRows);
    let col = p.random(availableCols);
    availableRows.splice(availableRows.indexOf(row), 1);
    availableRows.splice(availableRows.indexOf(row + 1), 1);
    availableCols.splice(availableCols.indexOf(col), 1);
    availableCols.splice(availableCols.indexOf(col + 1), 1);
    
    // Reset.
    p.fill('white');
    drawShapeForCell('square', cellSize, row, col);
    drawShapeForCell('square', cellSize, row, col + 1);
    drawShapeForCell('square', cellSize, row + 1, col);
    drawShapeForCell('square', cellSize, row + 1, col + 1);

    p.fill('black');
    drawShapeForCell('arc-3', cellSize, row, col);
    drawShapeForCell('arc-4', cellSize, row, col + 1);
    //p.fill(p.random(colors));
    drawShapeForCell('arc-2', cellSize, row + 1, col);
    drawShapeForCell('arc-1', cellSize, row + 1, col + 1);

    // Birb.
    // arc-3
    // arc-2  arc-1.
    row = p.random(availableRows);
    col = p.random(availableCols);
    if (row === undefined || col === undefined) {
      console.log('out of cells for birb');
      return;
    }
    availableRows.splice(availableRows.indexOf(row), 1);
    availableRows.splice(availableRows.indexOf(row + 1), 1);
    availableCols.splice(availableCols.indexOf(col), 1);
    availableCols.splice(availableCols.indexOf(col + 1), 1);

    p.fill('white');
    drawShapeForCell('square', cellSize, row, col);
    drawShapeForCell('square', cellSize, row + 1, col);
    drawShapeForCell('square', cellSize, row + 1, col + 1);
    p.fill('black');
    drawShapeForCell('arc-3', cellSize, row, col);
    drawShapeForCell('arc-2', cellSize, row + 1, col);
    drawShapeForCell('arc-1', cellSize, row + 1, col + 1);

    // Grass:
    // leaf-1 leaf-2
    //      ||
    row = p.random(availableRows);
    col = p.random(availableCols);
    if (row === undefined || col === undefined) {
      console.log('out of cells for grass');
      return;
    }
    // Reset
    p.fill('white');
    drawShapeForCell('square', cellSize, row, col);
    drawShapeForCell('square', cellSize, row, col + 1);
    drawShapeForCell('square', cellSize, row+1, col);
    drawShapeForCell('square', cellSize, row+1, col + 1);
    
    availableRows.splice(availableRows.indexOf(row), 1);
    availableCols.splice(availableCols.indexOf(col), 1);
    availableRows.splice(availableRows.indexOf(row), 1);
    availableCols.splice(availableCols.indexOf(col+1), 1);

    p.fill('black');
    drawShapeForCell('leaf-1', cellSize, row, col);
    drawShapeForCell('leaf-2', cellSize, row, col+1);
    const y = (row+1) * cellSize;
    const x = col * cellSize;
    p.push();
    p.translate(x, y);
    p.rect(cellSize-2, 0, 4, cellSize);
    p.pop();
  }

  function drawShapeForCell(shape, cellSize, i, j) {
    const y = i * cellSize;
    const x = j * cellSize;

    p.push();
    p.translate(x, y);
    drawShape(shape, cellSize);
    p.pop();
  }

  function drawShape(shape, cellSize, slice=false) {
    const d = cellSize/2;

    switch (shape) {
      case 'circle':
        p.circle(d, d, cellSize);
        break;
      case 'square':
        p.rect(0, 0, cellSize, cellSize);
        break;
      case 'arc-1':
        p.arc(0, 0, cellSize*2, cellSize*2, 0, p.HALF_PI, slice);
        break;
      case 'arc-2':
        p.translate(cellSize, 0);
        p.scale(-1, 1);
        p.arc(0, 0, cellSize*2, cellSize*2, 0, p.HALF_PI, slice);
        break;
      case 'arc-3':
        p.translate(0, cellSize);
        p.scale(1, -1);
        p.arc(0, 0, cellSize*2, cellSize*2, 0, p.HALF_PI, slice);
        break;
      case 'arc-4':
        p.translate(cellSize, cellSize);
        p.scale(-1, -1);
        p.arc(0, 0, cellSize*2, cellSize*2, 0, p.HALF_PI, slice);
        break;
      case 'skip':
        break;
      case 'leaf-1':
        drawShape('arc-2', cellSize, true);
        drawShape('arc-4', cellSize, true);
        break;
      case 'leaf-2':
        drawShape('arc-1', cellSize, true);
        drawShape('arc-4', cellSize, true);
        break;
      default:
        break;
    }
  }
}

// This simulates how p5.js works because that's where I wrote the code
// first and I like p5.js but not on this page.
let context;
window.p = p5Polyfill;
birds(p);