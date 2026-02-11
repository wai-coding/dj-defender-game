window.onload = function () {
  const MUSIC_VOLUME = 0.35;
  const SFX_VOLUME = 0.65;
  const MUSIC_GAMEOVER_VOLUME = 0.12;
  const MUTE_LS_KEY = "dancefloor_defender_muted";

  let ourGame = null;

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const gameScreenElement = document.getElementById("game-screen");

  const introGameArea = document.getElementById("intro-game-area");
  const endGameArea = document.getElementById("end-game-area");

  const pauseOverlay = document.getElementById("pause-overlay");
  const pauseMenuButton = document.getElementById("pause-menu-button");
  const resumeButton = document.getElementById("resume-button");
  const optionsButton = document.getElementById("options-button");
  const optionsPanel = document.getElementById("options-panel");
  const pauseRestartButton = document.getElementById("pause-restart-button");
  const quitButton = document.getElementById("quit-button");

  const themeButton = document.getElementById("pause-theme-button");

  const LIGHT_BG = "./images/background-light.png";
  const DARK_BG = "./images/background-dark.png";

  let isDarkMode = false;

  function applyTheme() {
    const bgUrl = isDarkMode ? `url("${DARK_BG}")` : `url("${LIGHT_BG}")`;

    if (introGameArea) introGameArea.style.backgroundImage = bgUrl;
    if (gameScreenElement) gameScreenElement.style.backgroundImage = bgUrl;
    if (endGameArea) endGameArea.style.backgroundImage = bgUrl;

    if (themeButton) {
      themeButton.textContent = isDarkMode
        ? "TURN ON THE LIGHTS"
        : "TURN OFF THE LIGHTS";
    }
  }

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      isDarkMode = !isDarkMode;
      applyTheme();
      // blur avoids space bar re-triggering
      themeButton.blur();
    });
  }

  applyTheme();

  const muteButton = document.getElementById("pause-mute-button");

  const bgMusic = new Audio("./assets/music.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 0;

  const shootSound = new Audio("./assets/shoot.wav");
  shootSound.volume = SFX_VOLUME;

  const enemyHitSound = new Audio("./assets/enemy-hit.wav");
  enemyHitSound.volume = SFX_VOLUME;

  let isMuted = localStorage.getItem(MUTE_LS_KEY) === "true";

  function fadeAudio(audio, targetVolume, duration) {
    if (!audio) return;
    const startVolume = audio.volume;
    const diff = targetVolume - startVolume;
    if (Math.abs(diff) < 0.01) {
      audio.volume = targetVolume;
      return;
    }
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;

    const fadeInterval = setInterval(() => {
      step++;
      const progress = step / steps;
      audio.volume = Math.max(0, Math.min(1, startVolume + diff * progress));
      if (step >= steps) {
        clearInterval(fadeInterval);
        audio.volume = targetVolume;
      }
    }, stepTime);
  }

  function playEnemyHitSound() {
    if (isMuted) return;
    try {
      enemyHitSound.currentTime = 0;
      enemyHitSound.play();
    } catch (e) {}
  }

  // expose globally for game.js
  window.playEnemyHitSound = playEnemyHitSound;

  window.onGameOver = function () {
    if (!isMuted) {
      fadeAudio(bgMusic, MUSIC_GAMEOVER_VOLUME, 400);
    }
  };

  function updateMuteUI() {
    if (muteButton) {
      muteButton.textContent = isMuted ? "UNMUTE" : "MUTE";
    }
  }

  if (muteButton) {
    muteButton.addEventListener("click", function () {
      isMuted = !isMuted;
      localStorage.setItem(MUTE_LS_KEY, isMuted);

      if (isMuted) {
        bgMusic.pause(); // pause, keep position
      } else {
        // resume from same spot
        bgMusic.volume = 0;
        bgMusic.play().catch(() => {});
        fadeAudio(bgMusic, MUSIC_VOLUME, 300);
      }

      updateMuteUI();
      muteButton.blur(); // avoid space bar re-trigger
    });
  }

  updateMuteUI();

  // prevent restarting music on game restart
  let musicStarted = false;

  function startMusicIfNeeded() {
    if (isMuted) return;
    if (!musicStarted) {
      bgMusic.volume = 0;
      bgMusic.play().catch(() => {});
      fadeAudio(bgMusic, MUSIC_VOLUME, 400);
      musicStarted = true;
    } else {
      // already playing, just restore volume
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
      }
      fadeAudio(bgMusic, MUSIC_VOLUME, 300);
    }
  }

  startButton.addEventListener("click", function () {
    ourGame = new Game();
    ourGame.start();

    // user gesture needed for audio
    startMusicIfNeeded();
  });

  restartButton.addEventListener("click", function () {
    if (!ourGame) return;
    ourGame.restart();

    // restore volume, don't restart track
    startMusicIfNeeded();
  });

  function showPauseOverlay() {
    if (pauseOverlay) pauseOverlay.classList.add("visible");
  }

  function hidePauseOverlay() {
    if (pauseOverlay) pauseOverlay.classList.remove("visible");
    if (optionsPanel) optionsPanel.classList.remove("visible");
  }

  function doPauseToggle() {
    if (!ourGame || ourGame.gameIsOver || !ourGame.player) return;
    ourGame.togglePause();
    if (ourGame.isPaused) {
      showPauseOverlay();
    } else {
      hidePauseOverlay();
    }
  }

  if (pauseMenuButton) {
    pauseMenuButton.addEventListener("click", function () {
      doPauseToggle();
      this.blur();
    });
  }

  if (resumeButton) {
    resumeButton.addEventListener("click", function () {
      if (ourGame && ourGame.isPaused) {
        doPauseToggle();
      }
      this.blur();
    });
  }

  if (optionsButton) {
    optionsButton.addEventListener("click", function () {
      if (optionsPanel) optionsPanel.classList.toggle("visible");
      this.blur();
    });
  }

  if (pauseRestartButton) {
    pauseRestartButton.addEventListener("click", function () {
      if (!ourGame) return;
      ourGame.isPaused = false;
      hidePauseOverlay();
      ourGame.restart();
      startMusicIfNeeded();
      this.blur();
    });
  }

  if (quitButton) {
    quitButton.addEventListener("click", function () {
      if (!ourGame) return;
      hidePauseOverlay();
      ourGame.quitToStart();
      this.blur();
    });
  }

  window.addEventListener("keydown", function (event) {
    if (!ourGame || !ourGame.player) return;

    if (event.code === "KeyP") {
      doPauseToggle();
      return;
    }

    // block input while paused
    if (ourGame.isPaused || ourGame.gameIsOver) return;

    if (event.code === "ArrowLeft") {
      ourGame.player.speedX = -5;
    }

    if (event.code === "ArrowRight") {
      ourGame.player.speedX = 5;
    }

    if (event.code === "Space") {
      const bulletLeft = ourGame.player.left + ourGame.player.width / 2 - 3;
      const bulletTop = ourGame.player.top - 10;

      const newBullet = new Bullet(ourGame.gameScreen, bulletLeft, bulletTop);
      ourGame.bullets.push(newBullet);

      if (!isMuted) {
        try {
          // reset to allow rapid fire
          shootSound.currentTime = 0;
          shootSound.play();
        } catch (e) {
          // browser may block autoplay
        }
      }
    }
  });

  window.addEventListener("keyup", function (event) {
    if (!ourGame || !ourGame.player) return;

    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      ourGame.player.speedX = 0;
    }
  });

  // touch controls
  if (gameScreenElement) {
    gameScreenElement.addEventListener("touchstart", function (event) {
      if (!ourGame || !ourGame.player) return;
      if (ourGame.isPaused || ourGame.gameIsOver) return;

      const touch = event.touches[0];
      const rect = gameScreenElement.getBoundingClientRect();

      const relativeX = touch.clientX - rect.left;
      const third = rect.width / 3;

      if (relativeX < third) {
        ourGame.player.speedX = -5;
      } else if (relativeX > 2 * third) {
        ourGame.player.speedX = 5;
      } else {
        const bulletLeft = ourGame.player.left + ourGame.player.width / 2 - 3;
        const bulletTop = ourGame.player.top - 10;

        const newBullet = new Bullet(ourGame.gameScreen, bulletLeft, bulletTop);
        ourGame.bullets.push(newBullet);

        if (!isMuted) {
          try {
            shootSound.currentTime = 0;
            shootSound.play();
          } catch (e) {}
        }
      }
    });

    gameScreenElement.addEventListener("touchend", function (event) {
      if (!ourGame || !ourGame.player) return;
      ourGame.player.speedX = 0;
    });
  }
};
