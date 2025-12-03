class Player {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;

    // Player size
    this.width = 80;
    this.height = 90;

    // Initial position (centered horizontally, in the bottom of the game area)
    this.left = (500 - this.width) / 2;
    this.top = 600 - this.height - 20;

    // Horizontal movement speed
    this.speedX = 0;

    // Create the player's DOM element
    this.element = document.createElement("img");
    this.element.src = "./images/player.svg";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;

    // Add the player to the game screen
    this.gameScreen.appendChild(this.element);
  }

  // Called every frame by Game.update()
  move() {
    // Update horizontal position
    this.left += this.speedX;

    // Keep player inside the game area boundaries
    if (this.left < 0) this.left = 0;
    if (this.left + this.width > 500) this.left = 500 - this.width;

    // Apply updated position to the DOM
    this.updatePosition();
  }

  // Sync DOM element with current position values
  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  // Return the initial coordinates for a new bullet (The bullet itself is created in the Game class)
  shoot() {
    const bulletLeft = this.left + this.width / 2 - 3; // center the bullet
    const bulletTop = this.top - 10; // slightly above the player
    return { left: bulletLeft, top: bulletTop };
  }
}
