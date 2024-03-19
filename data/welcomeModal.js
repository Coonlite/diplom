const modal = document.getElementById('modal');

// Показывать приветствие
function showModal() {
  modal.style.display = 'block';
}

// Скрывать приветствие
function hideModal() {
  modal.style.display = 'none';
  mapSound.play();
}

// Обработка клика в модальном окне
document.getElementById('startButton').addEventListener('click', () => {
  hideModal();
});



// Показывать модальное окно при заходе в игру
showModal();

