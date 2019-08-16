const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20)



const colors = [
  null,
  'red',
  'blue',
  'violet',
  'lightgreen',
  'yellow',
  'orange',
  'pink'

]

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

const createPiece = (type) => {
  if(type === 'T'){
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if(type === 'O'){
    return [
      [2, 2],
      [2, 2]
    ];
  } else if(type === 'L'){
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if(type === 'I'){
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0]
    ];
  } else if(type === 'S'){
    return [
      [0, 0, 0],
      [0, 6, 6],
      [6, 6, 0],
    ];
  } else if(type === 'Z'){
    return [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ];
  }
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
        context.fillStyle = colors[value];
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
    playerReset();
  }
  dropCounter = 0;
}

const playerMove = (dir) => {
  player.pos.x += dir;
  if(collide(arena, player)){
    player.pos.x -= dir;
  }
}

const letters = ['T', 'O', 'L', 'J', 'I', 'S', 'Z']

const playerReset = () => {
  player.matrix = createPiece(letters[Math.floor(Math.random() * letters.length)])
  player.pos.y = 0;
  player.pos.x = Math.floor(arena[0].length / 2) -
                 Math.floor(player.matrix[0].length / 2);
  if(collide(arena, player)){
    arena.forEach(row => row.fill(0))
  }
}

const playerRotate = (dir) => {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1))
    if(offset > player.matrix[0].length){
      rotate(player.matrix - dir);
      player.pos.x = pos;
      return;
    }
  }
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
  matrix: createPiece(letters[Math.floor(Math.random() * letters.length)])
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
  } else if(event.key === "W" || event.key === "w"){
    playerRotate(1);
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
document.getElementById('rotate').addEventListener('click', (event) => {
  playerRotate(1)
})

// drawMatrix(matrix, {x: 5, y: 5});
update();
