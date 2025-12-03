class Bullet {
  constructor(gameScreen, left, top) {
    this.gameScreen = gameScreen;

    // Bullet size
    this.width = 6;
    this.height = 18;

    // Initial position (passed from the Player)
    this.left = left;
    this.top = top;

    // Negative speed so the bullet moves upwards
    this.speedY = -6;

    // Create the DOM element for the bullet
    this.element = document.createElement("img");
    this.element.src = "./images/bullet.svg"; // Bullet image
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    // Add the bullet element to the game screen
    this.gameScreen.appendChild(this.element);
  }

  // Move the bullet each frame
  move() {
    // Update position in the game
    this.top += this.speedY;

    // Sync DOM element with internal position
    this.updatePosition();
  }

  // Apply the current left/top values to the DOM element
  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }

  // Check collision with a given enemy
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

  // Remove the bullet from the DOM
  remove() {
    this.element.remove();
  }
}
