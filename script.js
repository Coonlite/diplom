const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 54) {
  collisionsMap.push(collisions.slice(i, i + 54));
}

const battleZoneMap = [];
for (let i = 0; i < battleZoneData.length; i += 54) {
  battleZoneMap.push(battleZoneData.slice(i, i + 54));
}

const boundaries = [];
const offset = {
  x: -605,
  y: -450,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 778) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const battleZones = [];

battleZoneMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 680) {
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
    }
  });
});

const image = new Image();
image.src = "/img/map.png";

const playerDown = new Image();
playerDown.src = "/img/playerDown.png";

const playerUp = new Image();
playerUp.src = "/img/playerUp.png";

const playerLeft = new Image();
playerLeft.src = "/img/playerLeft.png";

const playerRight = new Image();
playerRight.src = "/img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDown,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUp,
    left: playerLeft,
    right: playerRight,
    down: playerDown,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

const movable = [background, ...boundaries, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiated: false,
};

function hideUserInterface() {
  const barDragon = document.getElementById("barDragon");
    const barEmby = document.getElementById("barEmby");
    const userIntarfase = document.getElementById("userIntarfase");

    if (barDragon) barDragon.style.display = "none";
    if (barEmby) barEmby.style.display = "none";
    if (userIntarfase) userIntarfase.style.display = "none";
}

function showUserInterface() {
  const barDragon = document.getElementById("barDragon");
  const barEmby = document.getElementById("barEmby");
  const userIntarfase = document.getElementById("userIntarfase");

  if (barDragon) barDragon.style.display = "block";
  if (barEmby) barEmby.style.display = "block";
  if (userIntarfase) userIntarfase.style.display = "block";
}

function animate() {
  mapSound.play();
  const animationID = window.requestAnimationFrame(animate);
  hideUserInterface();
  background.draw();
  boundaries.forEach((Boundary) => Boundary.draw());
  battleZones.forEach((battleZone) => battleZone.draw());
  player.draw();

  let moving = true;
  player.moving = false;

  if (battle.initiated) return;

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
      for (let i = 0; i < battleZones.length; i++) {
          const battleZone = battleZones[i];

          if (rectangularCollision({
              rectangle1: player,
              rectangle2: battleZone,
          })) {
            battleSound.play();
            mapSound.pause();
              console.log("activate battle ");
              window.cancelAnimationFrame(animationID);
              battle.initiated = true;
              animateBattle();
              return; // Возвращаемся из animate после запуска битвы
          }
      }
  }


  const speed = 3; // Скорость перемещения
  const diagonalSpeed = Math.sqrt(0.5) * speed; // Диагональная скорость

  // Обработка движения по диагонали
  if (keys.w.pressed && keys.a.pressed) {
    movable.forEach((movable) => {
      movable.position.x += diagonalSpeed;
    });
    movable.forEach((movable) => {
      movable.position.y += diagonalSpeed;
    });
  } else if (keys.w.pressed && keys.d.pressed) {
    movable.forEach((movable) => {
      movable.position.x -= diagonalSpeed;
    });
    movable.forEach((movable) => {
      movable.position.y += diagonalSpeed;
    });
  } else if (keys.s.pressed && keys.a.pressed) {
    movable.forEach((movable) => {
      movable.position.x += diagonalSpeed;
    });
    movable.forEach((movable) => {
      movable.position.y -= diagonalSpeed;
    });
  } else if (keys.s.pressed && keys.d.pressed) {
    movable.forEach((movable) => {
      movable.position.x -= diagonalSpeed;
    });
    movable.forEach((movable) => {
      movable.position.y -= diagonalSpeed;
    });
  } else {
    if (keys.w.pressed) {
      player.moving = true;
      player.image = player.sprites.up;
      for (let i = 0; i < boundaries.length; i++) {
        const Boundary = boundaries[i];
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...Boundary,
              position: {
                x: Boundary.position.x,
                y: Boundary.position.y + speed,
              },
            },
          })
        ) {
          console.log("colliding");
          moving = false;
          break;
        }
      }

      if (moving)
        movable.forEach((movable) => {
          movable.position.y += speed;
        });
    }
    if (keys.a.pressed) {
      player.moving = true;
      player.image = player.sprites.left;
      for (let i = 0; i < boundaries.length; i++) {
        const Boundary = boundaries[i];
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...Boundary,
              position: {
                x: Boundary.position.x + speed,
                y: Boundary.position.y,
              },
            },
          })
        ) {
          console.log("colliding");
          moving = false;
          break;
        }
      }
      if (moving)
        movable.forEach((movable) => {
          movable.position.x += speed;
        });
    }
  }
  if (keys.s.pressed) {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const Boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...Boundary,
            position: {
              x: Boundary.position.x,
              y: Boundary.position.y - speed,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      movable.forEach((movable) => {
        movable.position.y -= speed;
      });
  }
  if (keys.d.pressed) {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const Boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...Boundary,
            position: {
              x: Boundary.position.x - speed,
              y: Boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving)
      movable.forEach((movable) => {
        movable.position.x -= speed;
      });
  }
}


// Обработка нажатия клавиш
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "s":
      keys.s.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
