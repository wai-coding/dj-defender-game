class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameContainer = document.getElementById("game-container");
    this.gameScreen = document.getElementById("game-screen");
    this.endScreen = document.getElementById("game-end");

    this.score = 0;
    this.scoreElement = document.getElementById("score");
    this.finalScoreElement = document.getElementById("final-score");

    this.player = null;
    this.gameIsOver = false;

    this.gameInterval = null;

    this.enemies = [];
    this.bullets = [];
    this.frames = 0;
  }

  start() {
    this.startScreen.style.display = "none";
    this.endScreen.style.display = "none";
    this.gameContainer.style.display = "flex";

    this.player = new Player(this.gameScreen);
    this.enemies = [];
    this.frames = 0;

    this.gameInterval = setInterval(() => {
      this.gameLoop();
    }, 1000 / 60);
  }

  gameLoop() {
    if (this.gameIsOver) {
      clearInterval(this.gameInterval);
      this.gameOver();
      return;
    }

    this.frames++;

    this.player.move();

    if (this.frames % 90 === 0) {
      this.enemies.push(new Enemy(this.gameScreen));
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.move();

      if (this.player.didCollide(enemy)) {
        this.gameIsOver = true;
        break;
      }

      if (enemy.top > 600) {
        enemy.remove();
        this.enemies.splice(i, 1);
        i--;
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
      const bulletRect = bullet.element.getBoundingClientRect();

      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];
        const enemyRect = enemy.element.getBoundingClientRect();

        if (this.rectanglesCollide(bulletRect, enemyRect)) {
          bullet.remove();
          enemy.remove();

          this.bullets.splice(i, 1);
          this.enemies.splice(j, 1);

          i--;

          break;
        }
      }
    }
  }
  gameOver() {
    this.gameContainer.style.display = "none";
    this.endScreen.style.display = "block";
    this.finalScoreElement.innerText = this.score;
  }
  rectanglesCollide(rectA, rectB) {
    return (
      rectA.left < rectB.right &&
      rectA.right > rectB.left &&
      rectA.top < rectB.bottom &&
      rectA.bottom > rectB.top
    );
  }
}