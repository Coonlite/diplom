const volumeControl = document.getElementById("volumeControl");
const mapSound = new Audio ('/audio/map.wav')
const battleSound= new Audio ('/audio/battle.mp3')
const damageSound= new Audio ('/audio/damage.wav')

// Функция управления громкостью звуков
function setSoundsVolume(volumePercent) {
  const volume = volumePercent / 100;

  // Установить громкость для mapSound
  mapSound.volume = volume;

  // Установить громкость для battleSound
  damageSound.volume = volume;

  // Установить громкость для attackSound
  battleSound.volume = volume;
}

// Изменение громкости при перемещении ползунка
volumeControl.addEventListener("input", function () {
  const volumePercent = parseInt(this.value);
  setSoundsVolume(volumePercent);
});

// Устанавливаем начальное значение громкости для всех звуков
setSoundsVolume(parseInt(volumeControl.value));
