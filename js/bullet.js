class Bullet {
  constructor(gameScreen, left, top) {
    this.gameScreen = gameScreen;

    this.width = 6;
    this.height = 18;

    this.left = left;
    this.top = top;

    this.speedY = -6;

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

  remove() {
    this.element.remove();
  }
}