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
  player1.interactive = true;

  // give the spirtes their inital placement +++++++++++++++++


  background.width = appWidth; //background ======
  background.height = appHeight;

  clouds1.width = appWidth;
  clouds1.height = appHeight;

  clouds2.width = appWidth;
  clouds2.height = appHeight;


  tiles.width = appHeight * 3.7;
  tiles.height = appWidth / 2

  //+++++++++++++++++


  // setting des player's position and size
  player1.position.set(200, 490);
  player1.scale.set(0.5, 0.5)


  //bring up the sprites
  app.stage.addChild(background, clouds1, clouds2, tiles, player1);

  ///// GRAVITY //////////////////////////////////////
  var isJumping = false
  var jumpVelocity = -30;
  var gravityVelocity = 4;
  var originalPointOfPlayer = player1.y;
  var movingSpriteMesure = 10;

  // function for the movment of the player
  document.addEventListener('keydown', keyPressed);



  app.ticker.add(() => {
    if (isJumping) {
      player1.y += jumpVelocity;
      jumpVelocity += gravityVelocity;

      if (player1.y >= originalPointOfPlayer) {
        player1.y = originalPointOfPlayer;
        isJumping = false;
        jumpVelocity = -20

      }
    }

    if (!isJumping) {
      const tileMinX = tiles.y;
      const tileMaxX = tiles.y + tiles.height;

      if (player1.x < tileMinX || player1.x > tileMaxX) {
        player1.y += gravityVelocity * 5;

       
      }
    }

    if (isJumping) {
      if (keyPressed.ArrowLeft) {
        player1.x -= 100;
      }
    } if (keyPressed.ArrowRight) {
      player1.x += 100;
    }
  });




  function keyPressed(event) {
    if (event.key === "ArrowUp" && !isJumping) {
      isJumping = true;

    } else if (event.key === 'ArrowRight') {
      player1.x += movingSpriteMesure;

    } else if (event.key === 'ArrowLeft') {
      player1.x -= movingSpriteMesure;
    }
  }










})();
