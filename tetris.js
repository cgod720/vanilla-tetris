const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20)



const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const collide = (arena, player) => {
  const [m, o] = [player.matrix, player.pos];
  for(y = 0; y < m.length; ++y){
    for(x = 0; x < m[y].length; ++x){
      if(m[y][x] !== 0 &&
        (arena[y + o.y] &&
         arena[y + o.y][x + o.x]) !== 0){
        return true;
      }
    }
  }
  return false;
}

const createMatrix = (w, h) => {
  const matrix = [];
  while(h--){
    matrix.push(new Array(w).fill(0))
  }
  return matrix;
}

const draw = () => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}

const drawMatrix = (matrix, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0){
        context.fillStyle = 'red';
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
};


const merge = (arena, player) => {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};

const playerDrop = () => {
  player.pos.y++;
  if(collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    player.pos.y = 0;
  }
  dropCounter = 0;
}

const playerMove = (dir) => {
  player.pos.x += dir;
  if(collide(arena, player)){
    player.pos.x -= dir;
  }
}

const playerRotate = (dir) => {
  rotate(player.matrix, dir);
}

const rotate = (matrix, dir) => {
  for(y = 0; y < matrix.length; ++y){
    for(x = 0; x < y; ++x){
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }
  if(dir > 0){
    matrix.forEach(row => row.reverse())
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if(dropCounter > dropInterval){
    playerDrop();
  }

  draw()
  requestAnimationFrame(update)
}

const arena = createMatrix(12, 20);
console.log(arena);

const player = {
  pos: {x: 5, y: 5},
  matrix: matrix,
}

document.addEventListener('keydown', (event) => {
  if(event.key === 'ArrowLeft'){
    playerMove(-1)
  } else if(event.key === 'ArrowRight'){
      playerMove(1)
  } else if (event.key === 'ArrowDown') {
      playerDrop();
  } else if (event.key === 'ArrowUp') {
      playerRotate(1)
  } else if(event.key === "Q" || event.key === "q"){
    playerRotate(-1);
  }
});

document.getElementById('moveLeft').addEventListener('click', (event) => {
  playerMove(-1);
});
document.getElementById('moveRight').addEventListener('click', (event) => {
  playerMove(1);
});
document.getElementById('moveDown').addEventListener('click', (event) => {
  playerDrop();
});

// drawMatrix(matrix, {x: 5, y: 5});
update();
