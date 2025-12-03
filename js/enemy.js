class Enemy {
  constructor(gameScreen, speedBoost = 0) {
    this.gameScreen = gameScreen;

    // Enemy size
    this.width = 70;
    this.height = 70;

    // Random horizontal starting position, slightly above the top of the screen
    this.left = Math.floor(Math.random() * (500 - this.width));
    this.top = -this.height; // appear slightly inside the background

    // Base vertical speed (2 to 4) plus a difficulty-based boost
    // The higher the difficulty, the faster enemies fall.
    this.speedY = 2 + Math.random() * 2 + speedBoost;

    // Create the DOM element for the enemy
    this.element = document.createElement("img");
    this.element.src = "./images/enemy.svg";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    // Add the enemy element to the game screen
    this.gameScreen.appendChild(this.element);
  }

  // Move the enemy each frame (downwards)
  move() {
    this.top += this.speedY;
    this.updatePosition();
  }

  // Apply the current left/top values to the DOM element
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  // Check collision with the player
  didCollide(player) {
    const enemyRect = this.element.getBoundingClientRect();
    const playerRect = player.element.getBoundingClientRect();

    // Shrink hitbox margin (higher number = smaller collision zone) (Fix for player getting killed without colliding)
    const margin = 15;

    return (
      enemyRect.left + margin < playerRect.right - margin &&
      enemyRect.right - margin > playerRect.left + margin &&
      enemyRect.top + margin < playerRect.bottom - margin &&
      enemyRect.bottom - margin > playerRect.top + margin
    );
  }

  // Remove the enemy from the DOM
  remove() {
    this.element.remove();
  }
}
