class Enemy {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;

    // Enemy size in pixels
    this.width = 70;
    this.height = 70;

    // Random horizontal starting position, slightly above the top of the screen
    this.left = Math.floor(Math.random() * (500 - this.width));
    this.top = -this.height;

    // Vertical speed (randomized so enemies don't all move the same)
    this.speedY = 2 + Math.random() * 2;

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

    return (
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left &&
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top
    );
  }

  // Remove the enemy from the DOM
  remove() {
    this.element.remove();
  }
}
