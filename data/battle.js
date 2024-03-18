// Создаем объект для фонового изображения битвы.
const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
});

// Создаем объект для спрайта дракона.
const dragonImage = new Image();
dragonImage.src = "./img/draggleSprite.png";
const dragon = new Sprite({
  position: { x: 800, y: 100 },
  image: dragonImage,
  frames: { max: 4 },
  name: "Дракончик",
});

// Создаем объект для спрайта персонажа Emby.
const embyImage = new Image();
embyImage.src = "./img/embySprite.png";
const emby = new Sprite({
  position: { x: 280, y: 320 },
  image: embyImage,
  frames: { max: 4 },
  name: "Яшва",
});

// Переменная для отслеживания окончания игры.
let gameOver = false;

// Функция анимации битвы, выполняющая отрисовку элементов интерфейса, фона и спрайтов.
function animateBattle() {
  const animationID = window.requestAnimationFrame(animateBattle);
  showUserInterface();
  battleBackground.draw();
  dragon.draw();
  emby.draw();
}

// Обработчик клика по кнопкам атаки, который вызывает метод атаки персонажа Emby.
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({ attack: selectAttack, recipient: dragon });
  });
});

// Обработчик клика на диалоговом окне, скрывающий его при клике.
document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  e.currentTarget.style.display = "none";
});

animate();
