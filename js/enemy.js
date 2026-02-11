class Enemy {
  constructor(gameScreen, speedBoost = 0) {
    this.gameScreen = gameScreen;

    this.width = 70;
    this.height = 70;

    this.left = Math.floor(Math.random() * (500 - this.width));
    this.top = -this.height;

    // base speed + difficulty boost
    this.speedY = 2 + Math.random() * 2 + speedBoost;

    this.element = document.createElement("img");
    this.element.src = "./images/enemy.svg";
    this.element.classList.add("enemy");
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
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  // Check collision with the player
  didCollide(player) {
    const enemyRect = this.element.getBoundingClientRect();
    const playerRect = player.element.getBoundingClientRect();

    // tighter hitbox to feel fair
    const margin = 15;

    return (
      enemyRect.left + margin < playerRect.right - margin &&
      enemyRect.right - margin > playerRect.left + margin &&
      enemyRect.top + margin < playerRect.bottom - margin &&
      enemyRect.bottom - margin > playerRect.top + margin
    );
  }

  remove() {
    this.element.remove();
  }
}
