class Bullet {
  constructor(gameScreen, left, top) {
    this.gameScreen = gameScreen;

    this.width = 6;
    this.height = 18;

    this.left = left;
    this.top = top;

    this.speedY = -6; // negative = moves up

    this.element = document.createElement("img");
    this.element.src = "./images/bullet.svg";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    this.gameScreen.appendChild(this.element);
  }

  move() {
    this.top += this.speedY;
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }

  didHit(enemy) {
    const bulletRect = this.element.getBoundingClientRect();
    const enemyRect = enemy.element.getBoundingClientRect();

    return (
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top
    );
  }

  remove() {
    this.element.remove();
  }
}
