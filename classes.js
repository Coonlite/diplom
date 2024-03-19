// Конструктор класса Sprite
// Инициализирует свойства объекта, такие как позиция, изображение, кадры анимации и другие
class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1 },
    sprites,
    name,
  }) {
    this.position = position; // Устанавливаем позицию спрайта
    this.initialX = position.x; // Сохраняем исходную позицию по оси X
    this.initialY = position.y; // Сохраняем исходную позицию по оси Y
    this.image = image; // Устанавливаем изображение спрайта
    this.frames = { ...frames, val: 0, elapsed: 0 }; // Устанавливаем информацию о кадрах анимации
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max; // Вычисляем ширину кадра анимации
      this.height = this.image.height / this.frames.max; // Вычисляем высоту кадра анимации
    };
    this.sprites = sprites; // Устанавливаем спрайты
    this.name = name; // Устанавливаем имя спрайта
  }

  draw() {
    // Метод отрисовки спрайта на холсте
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    // Проверяем, движется ли спрайт. Если нет, то прерываем выполнение метода.
    if (!this.moving) return;

    // Увеличиваем счетчик прошедших кадров анимации, если общее количество кадров больше 1.
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    // Переключаем текущий кадр анимации каждые 10 прошедших кадров.
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }

    // Отображаем шкалу здоровья спрайта в виде зеленой полоски на холсте.
    if (this.health >= 0) {
      context.fillStyle = "green";
      context.fillRect(
        this.position.x,
        this.position.y - 10,
        this.width * (this.health / 100),
        5
      );
    }
  }

  attack({ attack, recipient }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector(
      "#dialogueBox"
    ).innerHTML = `${this.name} Использован ${attack.name}`;

    switch (attack.name) {
      case "Дробящий":
        // Реализация атаки 'Дробящий'
        damageSound.play();
        this.position.x += 50;
        this.position.y -= 40;
        recipient.position.x += 20;
        recipient.position.y -= 20;

        // Функция уменьшение шкалы здоровья врага на экране с определённым интервалом.
        const decreaseHealth = () => {
          let decreaseAmount = 1;
          let interval = setInterval(() => {
            let enemyHealthBar = document.getElementById("enemyHealthBar");
            let currentWidth = parseFloat(enemyHealthBar.style.width);
            // Проверяем, что текущая ширина является числом и больше 0
            if (!isNaN(currentWidth) && currentWidth > 0) {
              currentWidth -= decreaseAmount;
              // Проверяем, чтобы ширина не стала отрицательной
              if (currentWidth < 0) {
                currentWidth = 0;
              }

              //Устанавливаем новую ширину шкалы в процентах
              enemyHealthBar.style.width = currentWidth + "%";

              if (currentWidth <= 2) {
                animate(); // Проверка на 2%
              }
            }
          }, 100);

          // Остановить уменьшение здоровья через 2 секунды
          setTimeout(() => {
            clearInterval(interval); // Остановка интервала
          }, 900);
        };

        decreaseHealth();

        // Возвращение положения в бою
        setTimeout(() => {
          this.position.x = this.initialX;
          this.position.y = this.initialY;
          recipient.position.x = recipient.initialX;
          recipient.position.y = recipient.initialY;
        }, 200);

        break;

      case "Удар":
        // Реализация атаки 'Удар'
        damageSound.play();
        this.position.x -= 20;
        this.position.y -= 20;
        recipient.position.x += 20;
        recipient.position.y -= 20;

        if (Math.random() <= 0.3) {
          const myHealthBar = document.getElementById("myHealthBar");
          let currentWidth = parseFloat(myHealthBar.style.width);
          if (!isNaN(currentWidth)) {
            currentWidth -= 30;
            if (currentWidth < 0) {
              currentWidth = 0;
            }
            myHealthBar.style.width = currentWidth + "%";

            // Проверка на 2%
            if (currentWidth <= 2) {
              animate(); // Возврат в функцию animate()
            }
          }
        }

        let enemyHealthBar = document.getElementById("enemyHealthBar");
        let currentWidth = parseFloat(enemyHealthBar.style.width);
        if (!isNaN(currentWidth)) {
          currentWidth -= 15;
          if (currentWidth < 0) {
            currentWidth = 0;
          }
          enemyHealthBar.style.width = currentWidth + "%";

          // Проверка на 2%
          if (currentWidth <= 2) {
            animate(); // Возврат в функцию animate()
          }
        }

        setTimeout(() => {
          this.position.x = this.initialX;
          this.position.y = this.initialY;
          recipient.position.x = recipient.initialX;
          recipient.position.y = recipient.initialY;
        }, 200);

        break;
    }
  }
}

class Boundary {
  static width = 64;
  static height = 64;
  constructor({ position }) {
    // Конструктор класса Boundary
    // Инициализирует объект границы с указанной позицией
    this.position = position; // Устанавливаем позицию границы
    this.width = Boundary.width; // Устанавливаем ширину границы из статического свойства класса
    this.height = Boundary.height; // Устанавливаем высоту границы из статического свойства класса
  }

  draw() {
    // Метод отрисовки границы на холсте
    context.fillStyle = "rgba(255,0,0,0)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
