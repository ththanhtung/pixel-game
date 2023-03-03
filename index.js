const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

// console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

const collisionMap = [];

for (let i = 0; i < collisions.length; i += 70) {
  collisionMap.push(collisions.slice(i, i + 70));
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

const offset = {
  x: -352,
  y: -330,
};

collisionMap.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: x * Boundary.width + offset.x,
            y: y * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

console.log(boundaries);

const img = new Image();
img.src = './img/map.png';

const playerImg = new Image();
playerImg.src = './img/playerDown.png';

class Sprite {
  constructor({ position, velocity, img, frames = { max: 1 } }) {
    this.position = position;
    this.velocity = velocity;
    this.img = img;
    this.frames = frames;
    this.img.onload = () => {
      this.width = this.img.width / this.frames.max;
      this.height = this.img.height;
    };
  }

  draw() {
    c.drawImage(
      this.img,
      0,
      0,
      this.img.width / this.frames.max,
      this.img.height,
      this.position.x,
      this.position.y,
      this.img.width / this.frames.max,
      this.img.height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  img: playerImg,
  frames: {
    max: 4,
  },
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  img: img,
});

function rectCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y <= rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height >= rect2.position.y
  );
}

const movables = [background, ...boundaries];
function animate() {
  window.requestAnimationFrame(animate);
  console.log('animate');
  background.draw();
  player.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  let moving = true;
  if (keys.w.pressed) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 5,
            },
          },
        })
      ) {
        console.log('collide');
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.y += 5));
    }
  }
  if (keys.a.pressed) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x + 5,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('collide');
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.x += 5));
    }
  }
  if (keys.s.pressed) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 5,
            },
          },
        })
      ) {
        console.log('collide');
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.y -= 5));
    }
  }
  if (keys.d.pressed) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: {
              x: boundary.position.x - 5,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log('collide');
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => (movable.position.x -= 5));
    }
  }
}

animate();

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      console.log('w');
      break;
    case 'a':
      keys.a.pressed = true;
      console.log('a');
      break;
    case 's':
      keys.s.pressed = true;
      console.log('s');
      break;
    case 'd':
      keys.d.pressed = true;
      console.log('d');
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      console.log('w');
      break;
    case 'a':
      keys.a.pressed = false;
      console.log('a');
      break;
    case 's':
      keys.s.pressed = false;
      console.log('s');
      break;
    case 'd':
      keys.d.pressed = false;
      console.log('d');
      break;
  }
});
