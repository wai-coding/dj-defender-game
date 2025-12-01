class Enemy {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;

    this.width = 70;
    this.height = 70;

    this.left = Math.floor(Math.random() * (500 - this.width));
    this.top = -this.height;

    this.speedY = 2 + Math.random() * 2;

    this.element = document.createElement("img");
    this.element.src = "./images/enemy.svg";
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

  remove() {
    this.element.remove();
  }
}