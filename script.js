import {
  Application,
  Assets,
  Graphics,
  Sprite,
  RenderTexture,
  Point,
} from "https://cdn.skypack.dev/pixi.js";

const canvas = document.createElement("canvas");
const appWidth = 1900;
const appHeight = 800;
const app = new PIXI.Application({ view: canvas });

(async () => {
  await app.init();
  app.renderer.resize(appWidth, appHeight);
  document.body.appendChild(app.view);

  await Assets.load([
    "img/1.png",
    "img/3.png",
    "img/4.png",
    "img/tiles.png",
    "img/image.png",
  ]);

  const background = Sprite.from("img/1.png");
  const clouds1 = Sprite.from("img/3.png");
  const clouds2 = Sprite.from("img/4.png");
  const tiles = Sprite.from("img/tiles.png");
  const player1 = Sprite.from("img/image.png");

  player1.interactive = true;

  background.width = appWidth;
  background.height = appHeight;

  clouds1.width = appWidth;
  clouds1.height = appHeight;

  clouds2.width = appWidth;
  clouds2.height = appHeight;

  tiles.width = appHeight * 3.7;
  tiles.height = appWidth / 2;

  player1.position.set(150, 490);
  player1.scale.set(0.5, 0.5);

  app.stage.addChild(background, clouds1, clouds2, tiles, player1);

  let isJumping = false;
  let jumpVelocity = -60;
  let gravityVelocity = 5;
  let originalPointOfPlayer = player1.y;
  let movingSpriteMesure = 10;
  let cloudSpeed = 1; // Vitesse de déplacement des nuages

  document.addEventListener('keydown', keyPressed);

  app.ticker.add(() => {
    if (isJumping) {
      player1.y += jumpVelocity;
      jumpVelocity += gravityVelocity;

      if (player1.y >= originalPointOfPlayer) {
        player1.y = originalPointOfPlayer;
        isJumping = false;
        jumpVelocity = -20;
      }
    } else {
      const tileMinX = tiles.y;
      const tileMaxX = tiles.y + tiles.height;

      if (player1.x < tileMinX || player1.x > tileMaxX) {
        player1.y += gravityVelocity * 5;
      }

      if (player1.y > appHeight) {
        showGameOverScreen();
      }
    }

    // Déplacer les nuages horizontalement
    clouds1.x += cloudSpeed;
    clouds2.x -= cloudSpeed;

    // Réinitialiser la position des nuages lorsqu'ils sortent de l'écran
    if (clouds1.x >= appWidth) {
      clouds1.x = -clouds1.width++;
    }
    if (clouds2.x >= appWidth) {
      clouds2.x = -clouds2.width++;
    }
  });

  function keyPressed(event) {
    event.preventDefault();
    if (event.key === "ArrowUp" && !isJumping) {
      isJumping = true;
    } else if (event.key === 'ArrowRight') {
      player1.x += movingSpriteMesure;
    } else if (event.key === 'ArrowLeft') {
      player1.x -= movingSpriteMesure;
    }
  }
})();
