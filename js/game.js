const DIFFICULTY_CONFIG = {
  baseSpawnInterval: 90,      // frames between spawns at level 1
  minSpawnInterval: 40,       // fastest allowed spawn rate
  spawnReductionPerLevel: 5,  // frames subtracted per difficulty tick
  difficultyTickFrames: 600,  // frames between difficulty increases (~10 s)
  maxDifficulty: 15,          // cap difficulty so it doesn't go infinite
  speedBoostPerLevel: 0.3,    // enemy speed increase per difficulty tick
  maxSpeedBoost: 4.5,         // cap speed boost (prevents unreactable speeds)
};

class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreen = document.getElementById("game-end");

    this.score = 0;
    this.displayedScore = 0;
    this.scoreAnimationId = null; // avoid stacking RAF
    this.scoreElement = document.getElementById("score");
    this.finalScoreElement = document.getElementById("final-score");

    this.bestScoreElement = document.getElementById("best-score");
    this.bestScoreEndElement = document.getElementById("best-score-end");

    this.highScoreContainer = document.getElementById("high-scores");

    this.level = 1;
    this.levelElement = document.getElementById("level");

    this.lives = 3;
    this.livesElement = document.getElementById("lives");
    this.levelIndicator = document.getElementById("level-indicator");
    this.damageOverlay = document.getElementById("damage-overlay");
    this.maxLives = 3;

    this.player = null;
    this.enemies = [];
    this.bullets = [];

    this.gameIsOver = false;
    this.frames = 0;
    this.difficulty = 0;

    this.gameInterval = null;
    this.isPaused = false;

    this.width = 500;
    this.height = 600;

    this.updateBestScoreDisplay();
  }

  showScreen(screen, displayMode) {
    screen.style.display = displayMode || "flex";
    requestAnimationFrame(() => {
      screen.classList.remove("is-hidden");
    });
  }

  hideScreen(screen, cb) {
    screen.classList.add("is-hidden");
    setTimeout(() => {
      screen.style.display = "none";
      if (cb) cb();
    }, 220);
  }

  triggerShake() {
    this.gameScreen.classList.remove("shake");
    void this.gameScreen.offsetWidth; // force reflow to re-trigger animation
    this.gameScreen.classList.add("shake");
    this.gameScreen.addEventListener(
      "animationend",
      () => this.gameScreen.classList.remove("shake"),
      { once: true }
    );
  }

  showLevelUp(level) {
    if (!this.levelIndicator) return;
    this.levelIndicator.textContent = `Level ${level}`;
    this.levelIndicator.classList.add("show");
    clearTimeout(this._levelTimeout);
    this._levelTimeout = setTimeout(() => {
      this.levelIndicator.classList.remove("show");
    }, 1000);
  }

  updateLivesDisplay() {
    if (!this.livesElement) return;
    let hearts = "";
    for (let i = 0; i < this.maxLives; i++) {
      if (i < this.lives) {
        hearts += '<span class="heart full">\u2665</span>';
      } else {
        hearts += '<span class="heart empty">\u2661</span>';
      }
    }
    this.livesElement.innerHTML = hearts;
  }

  triggerDamageFlash() {
    if (!this.damageOverlay) return;
    this.damageOverlay.classList.add("flash");
    setTimeout(() => {
      this.damageOverlay.classList.remove("flash");
    }, 150);
  }

  setScore(nextScore) {
    this.score = nextScore;

    // cancel previous to avoid stacking
    if (this.scoreAnimationId) {
      cancelAnimationFrame(this.scoreAnimationId);
    }

    const startVal = this.displayedScore;
    const diff = nextScore - startVal;
    const duration = 150; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      this.displayedScore = Math.round(startVal + diff * progress);
      this.scoreElement.innerText = this.displayedScore;

      if (progress < 1) {
        this.scoreAnimationId = requestAnimationFrame(animate);
      } else {
        this.scoreAnimationId = null;
        // pop feedback
        this.scoreElement.classList.remove("score-pop");
        void this.scoreElement.offsetWidth;
        this.scoreElement.classList.add("score-pop");
      }
    };

    this.scoreAnimationId = requestAnimationFrame(animate);
  }

  getBestScoreFromLS() {
    const scores = JSON.parse(localStorage.getItem("high-scores"));
    if (!scores || scores.length === 0) return 0;
    return scores[0].score; // already sorted descending
  }

  updateBestScoreDisplay() {
    const best = this.getBestScoreFromLS();
    if (this.bestScoreElement) this.bestScoreElement.innerText = best;
    if (this.bestScoreEndElement) this.bestScoreEndElement.innerText = best;
  }

  // shared cleanup for restart and gameOver
  clearGameEntities() {
    if (this.player && this.player.element && this.player.element.parentNode) {
      this.player.element.remove();
    }
    this.player = null;

    this.enemies.forEach((e) => {
      if (e.element && e.element.parentNode) e.element.remove();
    });
    this.enemies = [];

    this.bullets.forEach((b) => {
      if (b.element && b.element.parentNode) b.element.remove();
    });
    this.bullets = [];
  }

  start() {
    this.hideScreen(this.startScreen);
    this.hideScreen(this.endScreen);

    // wait for hide transition
    setTimeout(() => {
      this.gameScreen.style.display = "";
      this.showScreen(this.gameContainer, "flex");

      this.gameScreen.style.width = `${this.width}px`;
      this.gameScreen.style.height = `${this.height}px`;

      this.clearGameEntities();

      this.player = new Player(this.gameScreen);

      this.enemies = [];
      this.bullets = [];
      this.frames = 0;
      this.gameIsOver = false;
      this.isPaused = false;

      this.difficulty = 0;
      this.level = 1;
      this.levelElement.innerText = this.level;

      this.score = 0;
      this.displayedScore = 0;
      this.scoreElement.innerText = 0;

      this.lives = 3;
      this.updateLivesDisplay();

      if (this.levelIndicator) this.levelIndicator.classList.remove("show");
      if (this.damageOverlay) this.damageOverlay.classList.remove("flash");

      this.updateBestScoreDisplay();

      // avoid interval stacking
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.gameInterval = null;
      }

      this.gameInterval = setInterval(() => {
        this.gameLoop();
      }, 1000 / 60);
    }, 240);
  }

  restart() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    // prevent orphan animation
    if (this.scoreAnimationId) {
      cancelAnimationFrame(this.scoreAnimationId);
      this.scoreAnimationId = null;
    }

    this.clearGameEntities();
    this.hideScreen(this.endScreen);

    setTimeout(() => {
      this.gameScreen.style.display = "";
      this.showScreen(this.gameContainer, "flex");

      this.player = new Player(this.gameScreen);

      this.enemies = [];
      this.bullets = [];
      this.frames = 0;
      this.gameIsOver = false;
      this.isPaused = false;

      this.difficulty = 0;
      this.level = 1;
      this.levelElement.innerText = this.level;

      this.score = 0;
      this.displayedScore = 0;
      this.scoreElement.innerText = 0;

      this.lives = 3;
      this.updateLivesDisplay();

      if (this.levelIndicator) this.levelIndicator.classList.remove("show");
      if (this.damageOverlay) this.damageOverlay.classList.remove("flash");

      this.updateBestScoreDisplay();

      this.gameInterval = setInterval(() => {
        this.gameLoop();
      }, 1000 / 60);
    }, 240);
  }

  quitToStart() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    if (this.scoreAnimationId) {
      cancelAnimationFrame(this.scoreAnimationId);
      this.scoreAnimationId = null;
    }

    this.isPaused = false;
    this.gameIsOver = false;

    this.clearGameEntities();

    this.enemies = [];
    this.bullets = [];
    this.frames = 0;
    this.difficulty = 0;
    this.level = 1;
    this.score = 0;
    this.displayedScore = 0;

    this.scoreElement.innerText = 0;
    this.levelElement.innerText = 1;
    this.lives = 3;
    this.updateLivesDisplay();

    if (this.levelIndicator) this.levelIndicator.classList.remove("show");
    if (this.damageOverlay) this.damageOverlay.classList.remove("flash");
    clearTimeout(this._levelTimeout);

    this.hideScreen(this.gameContainer);
    this.hideScreen(this.endScreen);
    setTimeout(() => {
      this.showScreen(this.startScreen, "flex");
    }, 240);
  }

  pause() {
    if (this.gameIsOver || this.isPaused) return;
    this.isPaused = true;
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  resume() {
    if (this.gameIsOver || !this.isPaused) return;
    this.isPaused = false;
    // prevent ghost movement from held keys
    if (this.player) this.player.speedX = 0;
    if (!this.gameInterval) {
      this.gameInterval = setInterval(() => {
        this.gameLoop();
      }, 1000 / 60);
    }
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  gameLoop() {
    if (this.gameIsOver) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
      this.gameOver();
      return;
    }

    this.frames++;

    // bump difficulty every ~10s, capped
    if (
      this.frames % DIFFICULTY_CONFIG.difficultyTickFrames === 0 &&
      this.difficulty < DIFFICULTY_CONFIG.maxDifficulty
    ) {
      this.difficulty++;

      this.level = this.difficulty + 1;
      this.levelElement.innerText = this.level;
      this.showLevelUp(this.level);
    }

    const spawnInterval = Math.max(
      DIFFICULTY_CONFIG.minSpawnInterval,
      DIFFICULTY_CONFIG.baseSpawnInterval -
        this.difficulty * DIFFICULTY_CONFIG.spawnReductionPerLevel
    );

    if (this.frames % spawnInterval === 0) {
      const speedBoost = Math.min(
        this.difficulty * DIFFICULTY_CONFIG.speedBoostPerLevel,
        DIFFICULTY_CONFIG.maxSpeedBoost
      );
      const newEnemy = new Enemy(this.gameScreen, speedBoost);
      this.enemies.push(newEnemy);
    }

    this.update();
  }

  update() {
    this.player.move();

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.move();

      if (enemy.didCollide(this.player)) {
        enemy.remove();
        this.enemies.splice(i, 1);
        i--;

        this.triggerShake();

        this.lives--;
        this.updateLivesDisplay();
        this.triggerDamageFlash();

        if (this.lives <= 0) {
          this.gameIsOver = true;
        }

        continue;
      }

      // dodged enemy = +1 point
      if (enemy.top > this.height) {
        enemy.remove();
        this.enemies.splice(i, 1);
        i--;

        this.setScore(this.score + 1);
      }
    }

    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.move();

      if (bullet.top < -20) {
        bullet.remove();
        this.bullets.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];

      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];

        if (bullet.didHit(enemy)) {
          if (window.playEnemyHitSound) {
            window.playEnemyHitSound();
          }

          this.triggerShake();

          bullet.remove();
          this.bullets.splice(i, 1);

          this.enemies.splice(j, 1);

          // flash then remove
          enemy.element.classList.add("enemy-hit");
          setTimeout(() => {
            enemy.remove();
          }, 70);

          this.setScore(this.score + 2);

          i--;
          break;
        }
      }
    }
  }

  gameOver() {
    // notify audio to fade music
    if (window.onGameOver) {
      window.onGameOver();
    }

    this.hideScreen(this.gameContainer);
    setTimeout(() => {
      this.showScreen(this.endScreen, "flex");
    }, 240);

    this.finalScoreElement.innerText = this.score;

    const highScoresFromLS = JSON.parse(localStorage.getItem("high-scores"));

    const currentEntry = {
      score: this.score,
      level: this.level,
    };

    let updatedScores;

    if (!highScoresFromLS) {
      updatedScores = [currentEntry];
    } else {
      updatedScores = highScoresFromLS;
      updatedScores.push(currentEntry);
      updatedScores.sort((a, b) => b.score - a.score);
      updatedScores = updatedScores.slice(0, 3);
    }

    localStorage.setItem("high-scores", JSON.stringify(updatedScores));
    this.updateBestScoreDisplay();
    this.highScoreContainer.innerHTML = "";

    updatedScores.forEach((entry) => {
      const li = document.createElement("li");
      li.innerText = `${entry.score} points - Level ${entry.level}`;

      this.highScoreContainer.appendChild(li);
    });
  }
}
