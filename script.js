const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Устанавливаем размеры canvas.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function resizeCanvas() {
  const centerX = canvas.width / 2 - 192 / 4 / 2;
  const centerY = canvas.height / 2 - 68 / 2;

  // Сохраняем текущие координаты игрока
  const currentPlayerX = player.position.x;
  const currentPlayerY = player.position.y;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Устанавливаем новые координаты игрока в центре canvas
  player.position.x = canvas.width / 2 - 192 / 4 / 2;
  player.position.y = canvas.height / 2 - 68 / 2;

  // Перемещаем игрока на разницу между старым и новым центром
  const diffX = player.position.x - centerX;
  const diffY = player.position.y - centerY;

  // Пересчитываем позиции объектов на карте с учетом смещения игрока
  player.position.x = currentPlayerX + diffX;
  player.position.y = currentPlayerY + diffY;



  // Пересчитываем позиции границ и зон битвы соответственно
  boundaries.forEach((boundary) => {
    boundary.position.x += diffX;
    boundary.position.y += diffY;
  });

  battleZones.forEach((battleZone) => {
    battleZone.position.x += diffX;
    battleZone.position.y += diffY;
  });



  // Пересчитываем позиции фона
  background.position.x += diffX;
  background.position.y += diffY;
}

// Вызовем функцию resizeCanvas() при изменении размера окна
window.addEventListener('resize', resizeCanvas);

// Генерируем карту столкновений.
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 54) {
  collisionsMap.push(collisions.slice(i, i + 54));
}

// Генерируем карту зоны битвы.
const battleZoneMap = [];
for (let i = 0; i < battleZoneData.length; i += 54) {
  battleZoneMap.push(battleZoneData.slice(i, i + 54));
}

// Генерируем границы с учетом смещения.
const boundaries = [];
const offset = {
  x: -605,
  y: -450,
};

// Создаем границы для обработки столкновений.
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

// Создаем зоны битвы.
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

// Создаем изображение карты.
const image = new Image();
image.src = "/img/map.png";

// Загружаем изображения для персонажа в разных направлениях.
const playerDown = new Image();
playerDown.src = "/img/playerDown.png";

const playerUp = new Image();
playerUp.src = "/img/playerUp.png";

const playerLeft = new Image();
playerLeft.src = "/img/playerLeft.png";

const playerRight = new Image();
playerRight.src = "/img/playerRight.png";

// Создаем спрайт игрока.
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

// Создаем спрайт для фона.
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

// Объект для отслеживания нажатых клавиш.
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

// Массив объектов, которые можно перемещать.
const movable = [background, ...boundaries, ...battleZones];

// Функция проверки столкновения.
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

// Объект для отслеживания начала битвы.
const battle = {
  initiated: false,
};

// Скрытие интерфейса.
function hideUserInterface() {
  const barDragon = document.getElementById("barDragon");
    const barEmby = document.getElementById("barEmby");
    const userIntarfase = document.getElementById("userIntarfase");

    if (barDragon) barDragon.style.display = "none";
    if (barEmby) barEmby.style.display = "none";
    if (userIntarfase) userIntarfase.style.display = "none";
}

  // Отображение интерфейса.
function showUserInterface() {
  const barDragon = document.getElementById("barDragon");
  const barEmby = document.getElementById("barEmby");
  const userIntarfase = document.getElementById("userIntarfase");

  if (barDragon) barDragon.style.display = "block";
  if (barEmby) barEmby.style.display = "block";
  if (userIntarfase) userIntarfase.style.display = "block";
}

// Основная анимационная функция.
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

  // Обработчики для клавиш и их отпускания.
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
