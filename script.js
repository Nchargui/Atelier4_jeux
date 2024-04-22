const app = new PIXI.Application();
await app.init({ width: 1900, height: 850 });
document.body.appendChild(app.canvas);



await PIXI.Assets.load('background.png');
let sprite = PIXI.Sprite.from('background.png');

sprite.width = app.screen.width;
sprite.height = app.screen.height;

sprite.anchor.set(0.5);


sprite.position.set(app.screen.width /2, app.screen.height/2)


app.stage.addChild(sprite);




