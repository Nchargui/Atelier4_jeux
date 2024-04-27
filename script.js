import {
  Application,
  Assets,
  Graphics,
  Sprite,
  RenderTexture,
  Point,
} from "https://cdn.skypack.dev/pixi.js";

// Lancement de l'application +++++++++++++++++
const canvas = document.createElement("canvas");
const appWidth = 1900;
const appHeight = 900;
const app = new PIXI.Application({ view: canvas });

(async () => {
  await app.init();
  app.renderer.resize(appWidth, appHeight);
  document.body.appendChild(app.view);

  // load the sprites  +++++++++++++++++

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

  // give the spirtes their inital placement +++++++++++++++++

  background.width = appWidth; //background ======
  background.height = appHeight;

  clouds1.width = appWidth;
  clouds1.height = appHeight;

  clouds2.width = appWidth;
  clouds2.height = appHeight;


  tiles.height = appWidth;
  tiles.width = appHeight;
  tiles.y += 50;

  player1.scale.set(2);
  player1.x = canvas.width / 2;
  player1.y = canvas.height / 2;

  //bring up the sprites
  app.stage.addChild(background, clouds1, clouds2, tiles, player1);

  // class for the box of player
  // class Box {
  //     constructor(player)
  // }

  ///// GRAVITY //////

  let gravity = new Point(0, 0.5); // Adjust the Y value to control gravity strength

  function applyGravity() {
    player1.y += gravity.y;
  }

  function animate() {
    applyGravity();
    window.requestAnimationFrame(animate);
  }

  animate();
})();
