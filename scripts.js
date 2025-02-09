// scripts.js
document.addEventListener("DOMContentLoaded", function() {
  // Keep a map/dictionary of like counts per image src
  const imageLikes = {};

  // Grab all images in the gallery
  const galleryImages = document.querySelectorAll(".gallery img");

  // Create a modal (hidden by default)
  const modal = document.createElement("div");
  modal.classList.add("image-modal");
  modal.innerHTML = `
    <div class="image-modal-content">
      <span class="modal-close">&times;</span>
      <img class="modal-image" src="" alt="Enlarged Image"/>
      <div class="modal-likes">
        Likes: <span class="modal-like-count">0</span>
      </div>
      <button class="modal-like-btn">Like</button>
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector(".modal-image");
  const modalLikeCountSpan = modal.querySelector(".modal-like-count");
  const modalLikeBtn = modal.querySelector(".modal-like-btn");
  const closeModal = modal.querySelector(".modal-close");

  // Close modal when the user clicks the [x]
  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // For each gallery image, open modal on click
  galleryImages.forEach((img) => {
    // Initialize each image's like count at 0 (or only if not set)
    if (imageLikes[img.src] == null) {
      imageLikes[img.src] = 0;
    }

    img.addEventListener("click", function() {
      // Show the modal
      modal.style.display = "block";
      // Set the modal image to the clicked image's src
      modalImg.src = this.src;
      // Update the displayed like count
      modalLikeCountSpan.textContent = imageLikes[this.src];
    });
  });

  // Handle "Like" button inside modal
  modalLikeBtn.addEventListener("click", function() {
    // Increase like count for the current modal image
    const currentSrc = modalImg.src;
    imageLikes[currentSrc]++;
    modalLikeCountSpan.textContent = imageLikes[currentSrc];
  });
});


class UserInterface {
  constructor(settings) {
    this._settings = settings;
    this._preExtendSettings();
    this._setRoot();
    this._setHTML();
    this._postExtendSettings();
    this.setPauseState();
  }

  _preExtendSettings() {
    this._settings.buttonIconClass = 'mmp-icon';
    this._settings.equalizerImageClass = 'mmp-equalizer';
  }

  _setRoot() {
    this._root = document.getElementById(this._settings.containerID);
  }

  _setHTML() {
    let html = this._createHTML();
    this._root.appendChild(html);
  }

  _createHTML() {
    let container = this._createContainer();
    let innerHTML = this._getInnerHTML();
    container.innerHTML = innerHTML;

    return container;
  }

  _createContainer() {
    let container = document.createElement('div');
    container.setAttribute('class', 'mmp-ui-container');

    return container;
  }

  _getInnerHTML() {
    let innerHTML = `
      <div class="mmp-button-container">
        <button type="button">
          <i class="${this._settings.buttonIconClass} material-icons"></i>
        </button>
      </div>

      <div class="mmp-display-container">
        <div class="mmp-song-info-container">
          <div class="mmp-song-name">${this._settings.song}</div>
          <div class="mmp-artist-name">${this._settings.artist}</div>
        </div>
      
        <div class="mmp-eq-container">
          <img class="${this._settings.equalizerImageClass}" src="" alt="Eq Icon">
        </div>
      </div>
    `;

    return innerHTML;
  }

  _postExtendSettings(){
    this._buttonIcon = this._root.querySelector(`.${this._settings.buttonIconClass}`);
    this._equalizer = this._root.querySelector(`.${this._settings.equalizerImageClass}`);
    this._settings.buttonIconPauseClass = 'mmp-pause-icon';
    this._settings.buttonIconPlayClass = 'mmp-play-icon';
  }

  setPauseState() {
    this._setButtonPauseState();
    this._setEqualizerPauseState();
  }

  _setButtonPauseState() {
    let buttonIcon = this._buttonIcon;
    buttonIcon.innerHTML = 'play_arrow';
    buttonIcon.classList.remove(this._settings.buttonIconPauseClass);
    buttonIcon.classList.add(this._settings.buttonIconPlayClass);
  }

  _setEqualizerPauseState() {
    let equalizer = this._equalizer;
    equalizer.setAttribute('src', 'img/eq_pause.png');
  }

  setPlayState() {
    this._setButtonPlayState();
    this._setEqualizerPlayState();
  }

  _setButtonPlayState() {
    let buttonIcon = this._buttonIcon;
    buttonIcon.innerHTML = 'pause';
    buttonIcon.classList.remove(this._settings.buttonIconPlayClass);
    buttonIcon.classList.add(this._settings.buttonIconPauseClass);
  }

  _setEqualizerPlayState() {
    let equalizer = this._equalizer;
    equalizer.setAttribute('src', 'img/eq_play.gif');
  }

  setButtonClickCallback(callback) {
    let button = this._root.querySelector('button');
    button.addEventListener('click', callback);
  }
}

class Engine {
  constructor(settings) {
    this._settings = settings;
    this._preExtendSettings();
    this._setRoot();
    this._setHTML();
    this._postExtendSettings();
  }

  _preExtendSettings() {
    this._settings.audioTag = 'audio';
  }

  _setRoot() {
    this._root = document.getElementById(this._settings.containerID);
  }

  _setHTML() {
    let html = this._createHTML();
    this._root.appendChild(html);
  }

  _createHTML() {
    let container = this._createContainer();
    let innerHTML = this._getInnerHTML();
    container.innerHTML = innerHTML;

    return container;
  }

  _createContainer() {
    let container = document.createElement(this._settings.audioTag);
    return container;
  }

  _getInnerHTML() {
    let innerHTML = `<source src="${this._settings.audioFilePath}" type="audio/mpeg">`;
    return innerHTML;
  }

  _postExtendSettings(){
    this._engine = this._root.querySelector(this._settings.audioTag);
  }

  play() {
    this._engine.play();
  }

  pause() {
    this._engine.pause();
  }

  isPaused() {
    return this._engine.paused;
  }

  setOnEndedCallback(callback) {
    this._engine.addEventListener('ended', callback);
  }
}

class MyspaceMusicPlayer {
  constructor(settings) {
    this._settings = settings;
    this._buildUserInterface();
    this._buildEngine();
    this._setButtonClickCallback();
    this._setOnEndedCallback();
  }

  _buildUserInterface() {
    let userInterfaceSettings = {
      containerID: this._settings.containerID,
      song: this._settings.song,
      artist: this._settings.artist,
    };

    this._userInterface = new UserInterface(userInterfaceSettings);
  }

  _buildEngine() {
    let engineSettings = {
      containerID: this._settings.containerID,
      audioFilePath: this._settings.audioFilePath
    };

    this._engine = new Engine(engineSettings);
  }

  _setButtonClickCallback() {
    let buttonClickCallback = this._buttonClickCallback();
    this._userInterface.setButtonClickCallback(buttonClickCallback);
  }

  _buttonClickCallback() {
    return () => {
      if (this._engine.isPaused()) {
        this._engine.play();
        this._userInterface.setPlayState();
      } else {
        this._engine.pause();
        this._userInterface.setPauseState();
      }
    }
  }

  _setOnEndedCallback() {
    let onEndedCallback = this._onEndedCallback();
    this._engine.setOnEndedCallback(onEndedCallback);
  }

  _onEndedCallback() {
    return () => {
      this._userInterface.setPauseState();
    }
  }

}