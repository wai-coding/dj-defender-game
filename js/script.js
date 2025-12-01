window.onload = () => {
  let game;

  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

  startButton.onclick = () => {
    game = new Game();
    game.start();
  };

  restartButton.onclick = () => {
    window.location.reload();
  };

window.addEventListener("keydown", (event) => {
  if (!game || !game.player) return;

  if (event.code === "ArrowLeft") {
    game.player.speedX = -5;
  }
  if (event.code === "ArrowRight") {
    game.player.speedX = 5;
  }

  if (event.code === "Space") {
    const pos = game.player.shoot();
    const newBullet = new Bullet(game.gameScreen, pos.left, pos.top);
    game.bullets.push(newBullet);
  }
});

  window.addEventListener("keyup", (event) => {
    if (!game || !game.player) return;

    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      game.player.speedX = 0;
    }
  });
};