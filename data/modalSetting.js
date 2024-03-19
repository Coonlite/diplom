let isModalVisible = false;

// Обработка нажатия на ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    if (isModalVisible) {
      hideSettingsModal();
      isModalVisible = false;
    } else {
      showSettingsModal();
      isModalVisible = true;
    }
  }
});

// Показать настройки
function showSettingsModal() {
  const settingsModal = document.getElementById("settingsModal");
  settingsModal.style.display = "block";
}

//Скрыть настройки
function hideSettingsModal() {
  const settingsModal = document.getElementById("settingsModal");
  settingsModal.style.display = "none";
}
