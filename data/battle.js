const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
});

const dragonImage = new Image();
dragonImage.src = "./img/draggleSprite.png";
const dragon = new Sprite({
  position: { x: 800, y: 100 },
  image: dragonImage,
  frames: { max: 4 },
  name: "Дракончик",
});

const embyImage = new Image();
embyImage.src = "./img/embySprite.png";
const emby = new Sprite({
  position: { x: 280, y: 320 },
  image: embyImage,
  frames: { max: 4 },
  name: "Яшва",
});

let gameOver = false;

function animateBattle() {
  const animationID = window.requestAnimationFrame(animateBattle);
  showUserInterface();
  battleBackground.draw();
  dragon.draw();
  emby.draw();
}

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({ attack: selectAttack, recipient: dragon });
  });
});

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  e.currentTarget.style.display = "none";
});

animate();
