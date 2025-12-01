class Player {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;

    this.width = 80;
    this.height = 90;

    this.left = (500 - this.width) / 2;
    this.top = 600 - this.height - 20;

    this.speedX = 0;

    this.element = document.createElement("img");
    this.element.src = "./images/player.svg";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.left += this.speedX;

    if (this.left < 0) this.left = 0;
    if (this.left + this.width > 500) this.left = 500 - this.width;

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
  }

  didCollide(enemy) {
    const playerRect = this.element.getBoundingClientRect();
    const enemyRect = enemy.element.getBoundingClientRect();

    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
  shoot() {
    const bulletLeft = this.left + this.width / 2 - 3;
    const bulletTop = this.top - 10;
    return { left: bulletLeft, top: bulletTop };
  }
}